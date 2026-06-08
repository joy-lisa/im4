/* =========================================================================
   BESCHREIBUNG: Frontend-Steuerung für das Registrierungsformular (register.html).
   FUNKTION: 
   - Überwacht das 'submit'-Ereignis des Registrierungsformulars und stoppt das Neuladen der Seite.
   - Liest die Eingabefelder (Name, Kindname, E-Mail, Passwort und Passwortbestätigung) aus und bereinigt sie via 'trim'.
   - Validiert im Frontend, ob das eingegebene Passwort mit der Bestätigung übereinstimmt, um Fehleingaben zu verhindern.
   - Sendet bei erfolgreicher Validierung die Formulardaten als JSON-String via HTTP-POST an 'register.php'.
   - Verarbeitet die Server-Rückmeldung: Zeigt bei Erfolg eine Bestätigung an und leitet auf die 'home.html' weiter.
   ========================================================================= */

document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const childname = document.getElementById("childname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    // 1. Das Bestätigungsfeld auslesen (ID muss mit deinem HTML übereinstimmen)
    const passwordConfirm = document.getElementById("passwordConfirm").value.trim();
    // const emoji = document.getElementById("emoji").value.trim();

    // 2. Überprüfung: Stimmen die Passwörter überein?
    if (password !== passwordConfirm) {
      alert("Die Passwörter stimmen nicht überein!");
      return; // Bricht die Funktion hier ab, fetch wird nicht ausgeführt
    }

    try {
      const response = await fetch("./api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, childname /*, emoji */ }),
      });
      const result = await response.json();

      if (result.status === "success") {
        alert("Registration successful! You can now log in.");
        window.location.href = "home.html";
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  });