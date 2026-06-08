// =========================================================================
// 1. HAUSHALT ERSTELLEN (POPUP)
// =========================================================================

document.getElementById("btnCreate").addEventListener("click", async () => {

    const name = document.getElementById("householdName").value.trim();
    if (!name) {
        alert("Bitte gib einen Namen für den Haushalt ein!");
        return;
    }

    // 1. Zufälligen 6-stelligen Code generieren (Großbuchstaben & Zahlen)

    const generateCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };
    const joinCode = generateCode();

    try {
        const response = await fetch("api/create_household.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            // Wir schicken den Namen und den generierten Code
            body: JSON.stringify({
                name: name,
                join_code: joinCode
            }),
        });

        const result = await response.json();

        if (result.status === "success") {
            alert(`Haushalt "${name}" wurde erstellt!\nDein Beitritts-Code ist: ${joinCode}`);
            // Seite neu laden, um den neuen Haushalt anzuzeigen
            window.location.reload();
        } else {
            alert("Fehler: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Verbindung zum Server fehlgeschlagen.");
    }

});
// =========================================================================
// 2. HAUSHALT BEITRETEN
// =========================================================================

document.getElementById("btnJoin").addEventListener("click", async () => {
    const code = document.getElementById("joinCode").value.trim().toUpperCase();

    if (!code) {
        alert("Bitte gib einen Beitritts-Code ein!");
        return;
    }

    try {
        const response = await fetch("api/join_household.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ join_code: code }),
        });
        const result = await response.json();

        if (result.status === "success") {
            alert(result.message);
            window.location.reload();
        } else {
            alert("Fehler: " + result.message);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Verbindung zum Server fehlgeschlagen.");
    }
});

// =========================================================================
// 3. BENUTZERDATEN LADEN FÜR STARTSEITE (FINALE LOGIK)
// =========================================================================

async function loadUserData() {
    try {
        const response = await fetch("api/get_user_info.php");
        const result = await response.json();

        if (result.status === "success") {
            const user = result.data;

            const householdInfoEl = document.getElementById("householdInfo");
            const noHouseholdEl = document.getElementById("noHousehold");

            // Schritt 1: Haushalts-Prüfung (Dein PHP liefert haushalt_ID)
            if (user.haushalt_ID && user.haushalt_ID !== "0" && user.haushalt_ID !== "") {

                // Haushalt existiert -> Popup sofort verstecken!
                if (noHouseholdEl) noHouseholdEl.style.display = "none";
                if (householdInfoEl) householdInfoEl.style.display = "block";

                // Text im Header setzen
                const hNameEl = document.getElementById("hName");
                if (hNameEl) {
                    hNameEl.textContent = user.haushalt_name || "Mein Haushalt";
                }

                const logoImg = document.getElementById("homeMonsterLogo");
                if (logoImg) {
                    // Falls in der DB kein Monster hinterlegt ist, Wasabi als Standard
                    const aktuellesMonster = user.monster_icon || "monster_wasabi_02";
                    logoImg.src = `resources/img/${aktuellesMonster}.svg`;
                    logoImg.alt = `Aktuelles Monster: ${aktuellesMonster}`;
                }

                // Schritt 2: Erst jetzt prüfen wir den Buzzer separat
                const aktuelleBuzzerId = user.buzzer_id;

                if (!aktuelleBuzzerId) {
                    // Fall A: Kein Buzzer im Haushalt hinterlegt
                    const trendDiv = document.getElementById("trendValue");
                    if (trendDiv) { trendDiv.textContent = "Kein Gerät aktiv"; trendDiv.style.color = "#AEB8A0"; }

                    const chartDiv = document.getElementById("chartValue");
                    if (chartDiv) { chartDiv.textContent = "Noch keine Daten gesammelt"; chartDiv.style.color = "#AEB8A0"; }

                    if (document.getElementById("monsterChart")) {
                        document.getElementById("monsterChart").style.display = "none";
                    }
                } else {
                    // Fall B: Ein aktiver Buzzer ist vorhanden!
                    if (document.getElementById("chartValue")) { document.getElementById("chartValue").style.display = "none"; }
                    if (document.getElementById("monsterChart")) { document.getElementById("monsterChart").style.display = "block"; }

                    if (typeof loadChart === "function") {
                        loadChart(aktuelleBuzzerId);
                    }

                    // Kalender-Filter für die Alarme aktivieren
                    const dateInput = document.getElementById("alarmDateFilter");
                    if (dateInput) {
                        if (!dateInput.value) {
                            dateInput.value = new Date().toISOString().split("T")[0];
                        }
                        dateInput.onchange = () => { loadBuzzerEvents(aktuelleBuzzerId); };
                        loadBuzzerEvents(aktuelleBuzzerId);
                    }

                    // Live-Monster-Ticker starten (Alle 5 Sekunden)
                    checkLiveMonsterAlert(aktuelleBuzzerId);
                    setInterval(() => {
                        checkLiveMonsterAlert(aktuelleBuzzerId);
                    }, 5000);
                }

            } else {
                // User hat wirklich KEINEN Haushalt -> Popup anzeigen
                if (householdInfoEl) householdInfoEl.style.display = "none";
                if (noHouseholdEl) noHouseholdEl.style.display = "flex";
            }
        } else {
            console.error("Fehler beim Laden:", result.message);
        }
    } catch (error) {
        console.error("Verbindung zum Server fehlgeschlagen", error);
    }
}

document.addEventListener("DOMContentLoaded", loadUserData);

// Wir merken uns global die ID des Alarms, den der User weggeklickt hat
let vonUserWeggeklickteAlertId = null;

// =========================================================================
// 4. LIVE-MONSTER-ALARM CHECKER (MIT COOLEM AUTO-TIMEOUT & SCHLIESS-KREUZ)
// =========================================================================

async function checkLiveMonsterAlert(buzzerId) {
    const alertBox = document.getElementById("liveMonsterAlert");
    const alertTimeSpan = document.getElementById("alertTime");
    const closeBtn = document.getElementById("closeAlertBtn");
    if (!alertBox) return;

    // EINMALIGER EVENT LISTENER: Schließt die Box bei Klick auf das "X"
    if (closeBtn && !closeBtn.dataset.listenerActive) {
        closeBtn.dataset.listenerActive = "true"; // Verhindert doppelte Event-Listener
        closeBtn.addEventListener("click", () => {
            alertBox.style.display = "none";
            // Wir merken uns, welchen konkreten Alarm der User ignoriert hat
            const aktuelleId = alertBox.dataset.currentAlertId;
            if (aktuelleId) {
                vonUserWeggeklickteAlertId = aktuelleId;
            }
        });
    }

    try {
        const response = await fetch(`api/get_buzzer_events.php?buzzer_ID=${buzzerId}`);
        const result = await response.json();

        if (result.status === "success" && result.events.length > 0) {
            const neuestesEvent = result.events[0];
            const istMonster = parseInt(neuestesEvent.monster_da) === 1;
            const eventId = neuestesEvent.ID; // Die eindeutige ID aus der Datenbank

            // Falls der User GENAU DIESEN Alarm schon weggeklickt hat -> Nichts tun
            if (vonUserWeggeklickteAlertId == eventId) {
                alertBox.style.display = "none";
                return;
            }

            if (istMonster) {
                // Zeit-Check: Wie viele Minuten ist der Alarm her?
                const zeitTeile = neuestesEvent.formatiert_zeit.split(" ")[0].split(":");

                const jetzt = new Date();
                const alarmZeit = new Date();
                alarmZeit.setHours(parseInt(zeitTeile[0]), parseInt(zeitTeile[1]), 0);

                const differenzInMinuten = (jetzt - alarmZeit) / 1000 / 60;

                // Wenn der Alarm jünger als 5 Minuten ist -> Zeigen!
                if (differenzInMinuten >= 0 && differenzInMinuten < 5) {
                    alertTimeSpan.textContent = neuestesEvent.formatiert_zeit;
                    alertBox.dataset.currentAlertId = eventId; // ID an der Box für das "X" zwischenspeichern
                    alertBox.style.display = "flex";
                    alertBox.style.alignItems = "center";
                } else {
                    // Älter als 5 Minuten -> Auto-Ausblendung
                    alertBox.style.display = "none";
                }
            } else {
                // Neuester Eintrag ist Entwarnung -> Ausblenden
                alertBox.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Fehler beim Live-Alarm-Check:", error);
    }
}

// =========================================================================
// 5. BUZZER-Events LADEN
// =========================================================================

async function loadBuzzerEvents(buzzerId) {
    const eventList = document.getElementById("buzzerEventList");
    const selectedDate = document.getElementById("alarmDateFilter");
    if (!eventList) return;

    const gewaehltesDatum = selectedDate ? selectedDate.value : "";

    try {
        const response = await fetch(`api/get_buzzer_events.php?buzzer_ID=${buzzerId}&datum=${gewaehltesDatum}`);
        const result = await response.json();

        if (result.status === "success") {
            eventList.innerHTML = "";

            if (result.events.length === 0) {
                eventList.innerHTML = `<li class="no-events">Keine Alarme am ${gewaehltesDatum}.</li>`;
                return;
            }

            result.events.forEach(event => {
                const li = document.createElement("li");
                li.className = "event-item";

                const monsterDa = parseInt(event.monster_da) === 1;
                const statusText = monsterDa
                    ? `<span class="event-status status-monster"> Monster entdeckt! </span>`
                    : `<span class="event-status status-normal"> Alles sicher </span>`;

                li.innerHTML = `
                <div class="event-time"> ⏰ ${event.formatiert_zeit} </div>
                ${statusText}
                `;

                eventList.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Fehler beim Laden der Buzzer-Events:", error);
    }
}
