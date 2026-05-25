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
                        li.style.padding = "8px 0";
                        li.style.borderBottom = "1px solid #ddd";
                        li.innerHTML = `
                            <strong>👤 ${member.name}</strong> <br>
                            <span style="font-size: 0.85em; color: #555;"> 📧 ${member.email}</span>
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

