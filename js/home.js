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

            // Schritt 1: REINE Haushalts-Prüfung (Dein PHP liefert haushalt_ID)
            if (user.haushalt_ID && user.haushalt_ID !== "0" && user.haushalt_ID !== "") {

                // Haushalt existiert -> Popup SOFORT und bedingungslos verstecken!
                if (noHouseholdEl) noHouseholdEl.style.display = "none";
                if (householdInfoEl) householdInfoEl.style.display = "block";

                // Text im Header setzen
                const hNameEl = document.getElementById("hName");
                if (hNameEl) {
                    hNameEl.textContent = user.haushalt_name || "Mein Haushalt";
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

// // =========================================================================

// // 3. BENUTZERDATEN LADEN FÜR STARTSEITE

// // =========================================================================
// async function loadUserData() {
//     try {
//         const response = await fetch("api/get_user_info.php");
//         const result = await response.json();

//         if (result.status === "success") {
//             const user = result.data;

//             // Neu ausgeblendet (bis 2.)

//             // if (document.getElementById("displayUserName")) {
//             //     document.getElementById("displayUserName").textContent = user.name;
//             // }

//             // if (document.getElementById("displayChildName")) {
//             //     document.getElementById("displayChildName").textContent = user.childname;
//             // }

//             // //Namen bereits in die Input-Felder des Bearbeitungs-Modus setzen

//             // if (document.getElementById("editUserName")) {
//             //     document.getElementById("editUserName").value = user.name;
//             // }

//             // if (document.getElementById("editChildName")) {
//             //     document.getElementById("editChildName").value = user.childname;
//             // }

//             // // Email anzeigen
//             // if (document.getElementById("userEmail")) {
//             //     document.getElementById("userEmail").textContent = user.email;
//             // }

//             const householdInfoEl = document.getElementById("householdInfo");
//             const noHouseholdEl = document.getElementById("noHousehold");

//             if (user.haushalt_ID && user.haushalt_ID !== "0" && user.haushalt_ID !== "") {

//                 //sofort Popup ausbenden und Hauptinhalt einblenden
//                 if (noHouseholdEl) noHouseholdEl.style.display = "none";
//                 if (householdInfoEl) householdInfoEl.style.display = "block";

//                 // Text im Header aktualisieren
//                 const hNameEl = document.getElementById("hName");
//                 if (hNameEl) { hNameEl.textContent = user.haushalt_name || "Geladen"; }

//                 // Buzzer-Daten verarbeiten
//                 const aktuelleBuzzerId = user.buzzer_id;

//                 if (!aktuelleBuzzerId) {

//                     // 1. Trend-Text setzen
//                     const trendDiv = document.getElementById("trendValue");
//                     if (trendDiv) {
//                         trendDiv.textContent = "Kein Gerät aktiv";
//                         trendDiv.style.color = "#AEB8A0";
//                     }

//                     const chartDiv = document.getElementById("chartValue");
//                     if (chartDiv) {
//                         chartDiv.textContent = "Noch keine Daten gesammelt";
//                         chartDiv.style.color = "#AEB8A0";
//                     }

//                     if (document.getElementById("monsterChart")) {
//                         document.getElementById("monsterChart").style.display = "none";
//                     }
//                 } else {
//                     if (document.getElementById("chartValue")) {
//                         document.getElementById("chartValue").style.display = "none";
//                     }
//                     if (document.getElementById("monsterChart")) {
//                         document.getElementById("monsterChart").style.display = "block";
//                     }

//                     if (typeof loadChart === "function") {
//                         loadChart(aktuelleBuzzerId);
//                     }

//                     // Kalender
//                     const dateInput = document.getElementById("alarmDateFilter");

//                     if (dateInput) {
//                         if (!dateInput.value) {
//                             dateInput.value = new Date().toISOString().split("T")[0];
//                         }
//                         dateInput.onchange = () => {
//                             loadBuzzerEvents(aktuelleBuzzerId);
//                         };
//                         loadBuzzerEvents(aktuelleBuzzerId);

//                         //Live-Check alle 30 Sekunden
//                         checkLiveMonsterAlert(aktuelleBuzzerId);
//                         setInterval(() => {
//                             checkLiveMonsterAlert(aktuelleBuzzerId);
//                         }, 30000);
//                     }
//                 }
//             } else {

//                 // User hat wirklich keinen Haushalt
//                 if (householdInfoEl) householdInfoEl.style.display = "none";
//                 if (noHouseholdEl) noHouseholdEl.style.display = "flex";
//             }
//         } else {
//             console.error("Fehler beim Laden:", result.message);
//         }
//     } catch (error) {
//         console.error("Verbindung zum Server fehlgeschlagen", error);
//     }
// }
document.addEventListener("DOMContentLoaded", loadUserData);

// Wir merken uns global die ID des Alarms, den der User weggeklickt hat
let vonUserWeggeklickteAlertId = null;

// =========================================================================
// 5. LIVE-MONSTER-ALARM CHECKER (MIT COOLEM AUTO-TIMEOUT & SCHLIESS-KREUZ)
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

//                 // User hat einen Haushalt, Code und Name anzeigen
//                 if (document.getElementById("hName")) document.getElementById("hName").textContent = user.haushalt_name;
//                 if (document.getElementById("hCode")) document.getElementById("hCode").textContent = user.join_code;

//                 // Nur umschalten, wenn die Elemente auf DIESER Seite existieren!
//                 if (householdInfoEl) householdInfoEl.style.display = "block";
//                 if (noHouseholdEl) noHouseholdEl.style.display = "none";

//                 // Mitgliederliste aktualisieren
//                 const listContainer = document.getElementById("memberList");
//                 if (listContainer && result.members) {
//                     listContainer.innerHTML = ""; // Vorherige Liste leeren
//                     result.members.forEach(member => {
//                         const li = document.createElement("li");
//                         li.style.padding = "8px 0";
//                         li.style.borderBottom = "1px solid #ddd";

//                         const memberName = member.name || "Unbekannt";
//                         const memberEmail = member.email || "Keine E-Mail";

//                         li.innerHTML = `
//                             <strong>👤 ${memberName}</strong> <br>
//                             <span style="font-size: 0.85em; color: #555;"> 📧 ${memberEmail}</span>
//                         `;
//                         listContainer.appendChild(li);
//                     });
//                 }

//                 const aktuelleBuzzerId = user.buzzer_id;

//                 if (!aktuelleBuzzerId) {
//                     // 1. Trend-Text setzen
//                     const trendDiv = document.getElementById("trendValue");
//                     if (trendDiv) {
//                         trendDiv.textContent = "Kein Gerät aktiv";
//                         trendDiv.style.color = "#AEB8A0";
//                     }

//                     // 2. Nachtaktivität-Text setzen
//                     const chartDiv = document.getElementById("chartValue");
//                     if (chartDiv) {
//                         chartDiv.textContent = "Noch keine Daten gesammelt";
//                         chartDiv.style.color = "#AEB8A0";
//                     }

//                     if (document.getElementById("monsterChart")) {
//                         document.getElementById("monsterChart").style.display = "none";
//                     }
//                 } else {
//                     if (document.getElementById("chartValue")) {
//                         document.getElementById("chartValue").style.display = "none";
//                     }
//                     if (document.getElementById("monsterChart")) {
//                         document.getElementById("monsterChart").style.display = "block";
//                     }

//                     if (typeof loadChart === "function") {
//                         loadChart(aktuelleBuzzerId);
//                     }

//                     // Kalender
//                     const dateInput = document.getElementById("alarmDateFilter");

//                     if (dateInput) {
//                         if (!dateInput.value) {
//                             const heute = new Date().toISOString().split("T")[0];
//                             dateInput.value = heute;
//                         }

//                         dateInput.onchange = () => {
//                             loadBuzzerEvents(aktuelleBuzzerId);
//                         };

//                         loadBuzzerEvents(aktuelleBuzzerId);
//                     }
//                 }

//             } else {
//                 // User hat keinen Haushalt -> Nur umschalten, wenn Elemente existieren!
//                 if (householdInfoEl) householdInfoEl.style.display = "none";
//                 if (noHouseholdEl) noHouseholdEl.style.display = "flex";
//             }
//         } else {
//             console.error("Fehler beim Laden:", result.message);
//         }
//     } catch (error) {
//         console.error("Verbindung zum Server fehlgeschlagen", error);
//     }
// }

// const haushaltID = user.haushalt_ID || user.haushalt_id;

//             if (user.haushalt_ID !== null && user.haushalt_ID !== undefined && user.haushalt_ID !== "") {

//                 //User hat einen Haushalt, Code und Name anzeigen

//                 if (document.getElementById("hName")) document.getElementById("hName").textContent = user.haushalt_name;
//                 if (document.getElementById("hCode")) document.getElementById("hCode").textContent = user.join_code;

//                 if (document.getElementById("householdInfo")) document.getElementById("householdInfo").style.display = "block";
//                 if (document.getElementById("noHousehold")) document.getElementById("noHousehold").style.display = "none";

//                 // Mitgliederliste aktualisieren
//                 const listContainer = document.getElementById("memberList");
//                 if (listContainer && result.members) {
//                     listContainer.innerHTML = ""; // Vorherige Liste leeren
//                     result.members.forEach(member => {
//                         const li = document.createElement("li");

//                         // Styling
//                         li.style.padding = "8px 0";
//                         li.style.borderBottom = "1px solid #ddd";

//                         const memberName = member.name || "Unbekannt";
//                         const memberEmail = member.email || "Keine E-Mail";

//                         // Strutkur: Name fett, Mail darunter
//                         li.innerHTML = `
//                             <strong>👤 ${member.name}</strong> <br>
//                         <span style="font-size: 0.85em; color: #555;"> 📧 ${member.email}</span>
// `;
//                         listContainer.appendChild(li);
//                     });
//                 }

//                 const aktuelleBuzzerId = user.buzzer_id;
//                 const container = document.getElementById("canvasContainer");

//                 if (!aktuelleBuzzerId) {
//                     // 1. Trend-Text setzen
//                     const trendDiv = document.getElementById("trendValue");
//                     if (trendDiv) {
//                         trendDiv.textContent = "Kein Gerät aktiv";
//                         trendDiv.style.color = "#AEB8A0";
//                     }

//                     // 2. NEU: Nachtaktivität-Text setzen (identisch gelöst!)
//                     const chartDiv = document.getElementById("chartValue");
//                     if (chartDiv) {
//                         chartDiv.textContent = "Noch keine Daten gesammelt";
//                         chartDiv.style.color = "#AEB8A0"; // Schön salbeigrün gefärbt
//                     }

//                     // Leeres Canvas verstecken
//                     if (document.getElementById("monsterChart")) {
//                         document.getElementById("monsterChart").style.display = "none";
//                     }
//                 } else {
//                     // Buzzer ist da -> Text wegschalten & Chart anzeigen
//                     if (document.getElementById("chartValue")) {
//                         document.getElementById("chartValue").style.display = "none";
//                     }
//                     if (document.getElementById("monsterChart")) {
//                         document.getElementById("monsterChart").style.display = "block";
//                     }

//                     // Chart ganz normal laden
//                     if (typeof loadChart === "function") {
//                         loadChart(aktuelleBuzzerId);
//                     }

//                     // Kalender
//                     const dateInput = document.getElementById("alarmDateFilter");

//                     // überprüfen, ob Element da
//                     if (dateInput) {
//                         //falls noch keine Datum gesetzt ist, das heutige setzen
//                         if (!dateInput.value) {
//                             const heute = new Date().toISOString().split("T")[0];
//                             dateInput.value = heute;
//                         }

//                         // Liste neu laden, wenn neues Datum ausgewählt
//                         dateInput.onchange = () => {
//                             loadBuzzerEvents(aktuelleBuzzerId);
//                         };

//                         // Alarme für das standardmässig gesetzte Datum laden (für heute)
//                         loadBuzzerEvents(aktuelleBuzzerId);
//                     }

//                 }

//             } else {
//                 // User hat keinen Haushalt
//                 if (document.getElementById("householdInfo")) document.getElementById("householdInfo").style.display = "none";
//                 if (document.getElementById("noHousehold")) document.getElementById("noHousehold").style.display = "flex";
//             }
//         } else {
//             console.error("Fehler beim Laden:", result.message);
//         }
//     } catch (error) {
//         console.error("Verbindung zum Server fehlgeschlagen", error);
//     }
// }

// Wenn Seite fertig geladen ist, Daten holen
// document.addEventListener("DOMContentLoaded", loadUserData);

// =========================================================================

// BUZZER-Events LADEN

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

// =========================================================================

// 4. PROFIL BEARBEITEN

// =========================================================================



// Ansicht wechseln zu: Bearbeiten

// document.getElementById("btnEditProfile").addEventListener("click", () => {
//     document.getElementById("profileViewMode").style.display = "none";
//     document.getElementById("profileEditMode").style.display = "block";
// });



// // Ansicht wechseln zu: Anzeigen (Abbrechen)

// document.getElementById("btnCancelEdit").addEventListener("click", () => {
//     document.getElementById("profileEditMode").style.display = "none";
//     document.getElementById("profileViewMode").style.display = "block";
// });



// // Profiländerungen an PHP senden

// document.getElementById("btnSaveProfile").addEventListener("click", async () => {

//     const updatedName = document.getElementById("editUserName").value.trim();

//     const updatedChildName = document.getElementById("editChildName").value.trim();



//     if (!updatedName) {

//         alert("Der Benutzername darf nicht leer sein!");

//         return;

//     }



//     try {

//         const response = await fetch("api/update_profile.php", {

//             method: "POST",

//             headers: {

//                 "Content-Type": "application/json",

//             },

//             body: JSON.stringify({

//                 name: updatedName,

//                 childname: updatedChildName

//             }),

//         });



//         const result = await response.json();



//         if (result.status === "success") {

//             alert("Profil erfolgreich aktualisiert!");

//             window.location.reload(); // Seite neu laden, um Daten frisch anzuzeigen

//         } else {

//             alert("Fehler beim Speichern: " + result.message);

//         }

//     } catch (error) {

//         console.error("Netzwerkfehler:", error);

//         alert("Verbindung zum Server fehlgeschlagen.");

//     }



// });



// // =========================================================================

// // 5. PASSWORT ÄNDERN (NEU HIER UNTEN EINGEBUNDEN)

// // =========================================================================

// const btnTogglePasswordForm = document.getElementById("btnTogglePasswordForm");
// const passwordForm = document.getElementById("passwordForm");
// const btnCancelPassword = document.getElementById("btnCancelPassword");

// // Formular einblenden und Hauptbutton verstecken
// if (btnTogglePasswordForm && passwordForm) {
//     btnTogglePasswordForm.addEventListener("click", () => {
//         passwordForm.style.display = "block";
//         btnTogglePasswordForm.style.display = "none";
//     });
// }

// // Formular ausblenden, Felder leeren und Hauptbutton wieder anzeigen
// if (btnCancelPassword && passwordForm && btnTogglePasswordForm) {
//     btnCancelPassword.addEventListener("click", () => {
//         passwordForm.style.display = "none";
//         passwordForm.reset(); // Löscht die Eingaben bei Klick auf Abbrechen
//         btnTogglePasswordForm.style.display = "block";
//     });
// }

// // Passwort-Daten an Server senden
// if (passwordForm) {
//     passwordForm.addEventListener("submit", async (e) => {
//         e.preventDefault(); // Verhindert Neuladen der Seite beim Abschicken

//         const oldPassword = document.getElementById("oldPassword").value;
//         const newPassword = document.getElementById("newPassword").value;
//         const newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

//         // Überprüfung im Frontend
//         if (newPassword !== newPasswordConfirm) {
//             alert("Die neuen Passwörter stimmen nicht überein!");
//             return;
//         }

//         if (newPassword.length < 6) {
//             alert("Das neue Passwort muss mindestens 6 Zeichen lang sein!");
//             return;
//         }

//         try {
//             const response = await fetch("api/change_password.php", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     old_password: oldPassword,
//                     new_password: newPassword
//                 }),
//             });

//             const result = await response.json();

//             if (result.status === "success") {
//                 alert("Passwort erfolgreich geändert!");
//                 passwordForm.reset(); // Formular-Felder leeren
//                 passwordForm.style.display = "none"; // Formular wieder einklappen

//                 // Bringt den "Passwort ändern"-Button nach erfolgreichem Absenden zurück
//                 if (btnTogglePasswordForm) {
//                     btnTogglePasswordForm.style.display = "block";
//                 }
//             } else {
//                 alert("Fehler: " + result.message);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             alert("Verbindung zum Server fehlgeschlagen.");
//         }
//     });
// }




/* // Formular ein- und ausklappen

document.getElementById("btnTogglePasswordForm").addEventListener("click", () => {

    const form = document.getElementById("passwordForm");

    if (form.style.display === "none") {

        form.style.display = "block";

    } else {

        form.style.display = "none";

    }

});



// Passwort-Daten an Server senden

document.getElementById("passwordForm").addEventListener("submit", async (e) => {

    e.preventDefault(); // Verhindert Neuladen der Seite beim Abschicken



    const oldPassword = document.getElementById("oldPassword").value;

    const newPassword = document.getElementById("newPassword").value;

    const newPasswordConfirm = document.getElementById("newPasswordConfirm").value;



    // Überprüfung im Frontend

    if (newPassword !== newPasswordConfirm) {

        alert("Die neuen Passwörter stimmen nicht überein!");

        return;

    }



    if (newPassword.length < 6) {

        alert("Das neue Passwort muss mindestens 6 Zeichen lang sein!");

        return;

    }



    try {

        const response = await fetch("api/change_password.php", {

            method: "POST",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({

                old_password: oldPassword,

                new_password: newPassword

            }),

        });



        const result = await response.json();



        if (result.status === "success") {

            alert("Passwort erfolgreich geändert!");

            document.getElementById("passwordForm").reset(); // Formular-Felder leeren

            document.getElementById("passwordForm").style.display = "none"; // Formular wieder einklappen

        } else {

            alert("Fehler: " + result.message);

        }

    } catch (error) {

        console.error("Error:", error);

        alert("Verbindung zum Server fehlgeschlagen.");

    }

}); */
