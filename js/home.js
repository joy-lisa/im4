//create household
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

//join household
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

//load user data

async function loadUserData() {
    try {
        const response = await fetch("api/get_user_info.php");
        const result = await response.json();

        if (result.status === "success") {
            const user = result.data;

        // Namen im Lese-Modus anzeigen
        document.getElementById("displayUserName").textContent = user.name;
        document.getElementById("displayChildName").textContent = user.childname;

        //Namen bereits in die Input-Felder des Bearbeitungs-Modus setzen
        document.getElementById("editUserName").value = user.name;
        document.getElementById("editChildName").value = user.childname;

        // Email anzeigen
            if (document.getElementById("userEmail")) {
                document.getElementById("userEmail").textContent = user.email;
            }


        // 2. Haushalts-Logik prüfen
        const haushaltID = user.haushalt_ID || user.haushalt_id;
        
        if (user.haushalt_ID !== null && user.haushalt_ID !== undefined) {
            //User hat einen Haushalt, Code und Name anzeigen
            document.getElementById("hName").textContent = user.haushalt_name;
            document.getElementById("hCode").textContent = user.join_code;

                document.getElementById("householdInfo").style.display = "block";
                document.getElementById("noHousehold").style.display = "none";
            } else {
                //User hat keinen Haushalt, Erstellen und Beitreten anzeigen
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

        // Wenn Seite fertig gelade ist, Daten holen
document.addEventListener("DOMContentLoaded", loadUserData);

// Profil bearbeiten

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
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: updatedName,
                childname: updatedChildName
            }),
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

