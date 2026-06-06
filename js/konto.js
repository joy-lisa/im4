// =========================================================================
// 1. HAUSHALT ERSTELLEN (Einstellungen)
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
// 2. HAUSHALT BEITRETEN (Einstellungen)
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
// 3. KONTO-DATEN BEFÜLLEN (ONLOAD)
// =========================================================================

async function loadAccountData() {
    try {
        const response = await fetch("api/get_user_info.php");
        const result = await response.json();

        if (result.status === "success") {
            const user = result.data;

            // Namen und E-Mail setzen
            document.getElementById("displayUserName").textContent = user.name;
            document.getElementById("displayChildName").textContent = user.childname || "Nicht angegeben";
            document.getElementById("editUserName").value = user.name;
            document.getElementById("editChildName").value = user.childname || "";
            document.getElementById("userEmail").textContent = user.email;

            // Haushalt prüfen
            if (user.haushalt_ID !== null && user.haushalt_ID !== undefined && user.haushalt_ID !== "") {
                document.getElementById("hName").textContent = user.haushalt_name;
                document.getElementById("hCode").textContent = user.join_code;

                document.getElementById("householdInfo").style.display = "block";
                document.getElementById("noHousehold").style.display = "none";

                // Mitgliederliste rendern
                const listContainer = document.getElementById("memberList");
                if (listContainer && result.members) {
                    listContainer.innerHTML = "";
                    result.members.forEach(member => {
                        const li = document.createElement("li");
                        li.className = "member-card";
                        li.innerHTML = `
                        <div class= "member-row">
                            <span class="member-icon">👤</span>
                            <span class="member-text">${member.name}</span>
                        </div>

                        <div class="member-email">
                            <span class="member-icon"> 📧 </span>
                            <span class="member-text">${member.email}</span>
                        </div>
                        `;
                        listContainer.appendChild(li);
                    });
                }
            } else {
                document.getElementById("householdInfo").style.display = "none";
                document.getElementById("noHousehold").style.display = "block";
            }
        } else {
            console.error("Fehler beim Laden:", result.message);
        }
    } catch (error) {
        console.error("Verbindung zum Server fehlgeschlagen", error);
    }
}
document.addEventListener("DOMContentLoaded", loadAccountData);

// =========================================================================
// 4. PROFIL BEARBEITEN
// =========================================================================

// Ansicht wechseln zu: Bearbeiten

document.getElementById("btnEditProfile").addEventListener("click", () => {
    document.getElementById("profileViewMode").style.display = "none";
    document.getElementById("profileEditMode").style.display = "block";
});

// Ansicht wechseln zu: Anzeigen (Abbrechen)

document.getElementById("btnCancelEdit").addEventListener("click", () => {
    document.getElementById("profileEditMode").style.display = "none";
    document.getElementById("profileViewMode").style.display = "block";
});

// Profiländerungen an PHP senden

document.getElementById("btnSaveProfile").addEventListener("click", async () => {
    const updatedName = document.getElementById("editUserName").value.trim();
    const updatedChildName = document.getElementById("editChildName").value.trim();

    if (!updatedName) {
        alert("Der Benutzername darf nicht leer sein!");
        return;
    }

    try {
        const response = await fetch("api/update_profile.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: updatedName, childname: updatedChildName }),
        });

        const result = await response.json();
        if (result.status === "success") {
            alert("Profil erfolgreich aktualisiert!");
            window.location.reload(); // Seite neu laden, um Daten frisch anzuzeigen
        } else {
            alert("Fehler beim Speichern: " + result.message);
        }
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        alert("Verbindung zum Server fehlgeschlagen.");
    }
});

// =========================================================================
// 5. PASSWORT ÄNDERN
// =========================================================================

const btnTogglePasswordForm = document.getElementById("btnTogglePasswordForm");
const passwordForm = document.getElementById("passwordForm");
const btnCancelPassword = document.getElementById("btnCancelPassword");

// Formular einblenden und Hauptbutton verstecken
if (btnTogglePasswordForm && passwordForm) {
    btnTogglePasswordForm.addEventListener("click", () => {
        passwordForm.style.display = "block";
        btnTogglePasswordForm.style.display = "none";
    });
}

// Formular ausblenden, Felder leeren und Hauptbutton wieder anzeigen
if (btnCancelPassword && passwordForm && btnTogglePasswordForm) {
    btnCancelPassword.addEventListener("click", () => {
        passwordForm.style.display = "none";
        passwordForm.reset(); // Löscht die Eingaben bei Klick auf Abbrechen
        btnTogglePasswordForm.style.display = "block";
    });
}

// Passwort-Daten an Server senden
if (passwordForm) {
    passwordForm.addEventListener("submit", async (e) => {
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
                passwordForm.reset(); // Formular-Felder leeren
                passwordForm.style.display = "none"; // Formular wieder einklappen

                // Bringt den "Passwort ändern"-Button nach erfolgreichem Absenden zurück
                if (btnTogglePasswordForm) {
                    btnTogglePasswordForm.style.display = "block";
                }
            } else {
                alert("Fehler: " + result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Verbindung zum Server fehlgeschlagen.");
        }
    });
}

// Globaler Speicher für die geladenen Userdaten, damit wir sie beim Monsterspeichern parat haben
let currentCachedUser = null;

// =========================================================================
// 6. DATEN BEIM LADEN ANZEIGEN (PROFIL & MONSTER)
// =========================================================================
async function loadUserProfileData() {
    try {
        const response = await fetch("api/get_user_info.php");
        const result = await response.json();

        if (result.status === "success" && result.data) {
            const user = result.data;
            currentCachedUser = user; // Im Cache merken

            // Profil-Texte füllen
            document.getElementById("displayUserName").textContent = user.name || "Kein Name";
            document.getElementById("displayChildName").textContent = user.childname || "Kein Name";
            document.getElementById("userEmail").textContent = user.email || "Keine E-Mail";

            // Profil-Inputs vorbefüllen
            document.getElementById("editUserName").value = user.name || "";
            document.getElementById("editChildName").value = user.childname || "";

            // --- MONSTER-ANZEIGE ---
            const aktuellesMonster = user.monster_icon || "monster_wasabi_02";

            // Einzel-Bild im Lese-Modus setzen
            const previewImg = document.getElementById("currentMonsterImg");
            if (previewImg) {
                previewImg.src = `resources/img/${aktuellesMonster}.svg`;
                previewImg.alt = aktuellesMonster;
            }

            // Radio-Button in der Galerie vor-auswählen
            const passenderRadio = document.querySelector(`input[name="monster_choice"][value="${aktuellesMonster}"]`);
            if (passenderRadio) {
                passenderRadio.checked = true;
            }
        }
    } catch (error) {
        console.error("Fehler beim Laden der Profildaten:", error);
    }
}

// =========================================================================
// 7. MODUS-UMSCHALTER (PROFIL-KACHEL & MONSTER-KACHEL SEPARAT)
// =========================================================================

// Profil-Kachel Umschalter
const btnEditProfile = document.getElementById("btnEditProfile");
const btnCancelEdit = document.getElementById("btnCancelEdit");
const profileViewMode = document.getElementById("profileViewMode");
const profileEditMode = document.getElementById("profileEditMode");

if (btnEditProfile && btnCancelEdit) {
    btnEditProfile.addEventListener("click", () => {
        profileViewMode.style.display = "none";
        profileEditMode.style.display = "block";
    });
    btnCancelEdit.addEventListener("click", () => {
        profileEditMode.style.display = "none";
        profileViewMode.style.display = "block";
    });
}

// Monster-Kachel Umschalter (NEU & SEPARAT)
const btnEditMonster = document.getElementById("btnEditMonster");
const btnCancelMonsterEdit = document.getElementById("btnCancelMonsterEdit");
const monsterViewMode = document.getElementById("monsterViewMode");
const monsterEditMode = document.getElementById("monsterEditMode");

if (btnEditMonster && btnCancelMonsterEdit) {
    btnEditMonster.addEventListener("click", () => {
        monsterViewMode.style.display = "none";
        monsterEditMode.style.display = "block"; // Galerie klappt auf
    });
    btnCancelMonsterEdit.addEventListener("click", () => {
        monsterEditMode.style.display = "none";
        monsterViewMode.style.display = "block"; // Galerie schließt sich wieder
    });
}

// =========================================================================
// 8. SPEICHER-FUNKTIONEN (BEIDE NUTZEN DIE Kombi-API UPDATE_PROFILE.PHP)
// =========================================================================

// Hilfsfunktion zum Senden der Daten an die API
async function sendUpdate(name, childname, monsterIcon) {
    try {
        const response = await fetch("api/update_profile.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                childname: childname,
                monster_icon: monsterIcon
            })
        });
        const result = await response.json();
        if (result.status === "success") {
            alert("Erfolgreich aktualisiert!");
            window.location.reload();
        } else {
            alert("Fehler: " + result.message);
        }
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        alert("Verbindung zum Server fehlgeschlagen.");
    }
}

// A: Speichern aus der Profil-Kachel
const btnSaveProfile = document.getElementById("btnSaveProfile");
if (btnSaveProfile) {
    btnSaveProfile.addEventListener("click", () => {
        const updatedName = document.getElementById("editUserName").value.trim();
        const updatedChildName = document.getElementById("editChildName").value.trim();

        // Wir nehmen das aktuell gespeicherte Monster aus dem Cache mit
        const aktuellesMonster = currentCachedUser ? currentCachedUser.monster_icon : "monster_wasabi_02";

        if (!updatedName) { alert("Der Name darf nicht leer sein!"); return; }
        sendUpdate(updatedName, updatedChildName, aktuellesMonster);
    });
}

// B: Speichern aus der Monster-Kachel (NEU)
const btnSaveMonster = document.getElementById("btnSaveMonster");
if (btnSaveMonster) {
    btnSaveMonster.addEventListener("click", () => {
        // Welches Monster-Bild wurde in der Galerie ausgewählt?
        const ausgewählterRadio = document.querySelector('input[name="monster_choice"]:checked');
        const gewähltesIcon = ausgewählterRadio ? ausgewählterRadio.value : "monster_wasabi_02";

        // Wir nehmen die aktuellen Profilnamen aus dem Cache mit, damit sie nicht überschrieben werden
        const aktuellerName = currentCachedUser ? currentCachedUser.name : "User";
        const aktuellerChildName = currentCachedUser ? currentCachedUser.childname : "";

        sendUpdate(aktuellerName, aktuellerChildName, gewähltesIcon);
    });
}

// Skript starten, wenn das HTML geladen ist
document.addEventListener("DOMContentLoaded", loadUserProfileData);