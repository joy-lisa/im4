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
          
        // 1. Allgemeine User-Daten anzeigen
            if(document.getElementById("userName")) {
                document.getElementById("userName").textContent = user.name;
            }
            if(document.getElementById("userEmail")) {
                document.getElementById("userEmail").textContent = user.email;
            }

            // 2. Haushalts-Logik prüfen
            // WICHTIG: Prüfe im PHP-Skript, ob du 'haushalt_ID' oder 'haushalt_id' zurückgibst!
            if (user.haushalt_ID !== null && user.haushalt_ID !== undefined) {
                document.getElementById("hName").textContent = user.haushalt_name;
                document.getElementById("hCode").textContent = user.join_code;

                document.getElementById("householdInfo").style.display = "block";
                document.getElementById("noHousehold").style.display = "none";
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

// Jetzt mit dem richtigen Namen aufrufen!
document.addEventListener("DOMContentLoaded", loadUserData);