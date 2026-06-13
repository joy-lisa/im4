/* =========================================================================
   BESCHREIBUNG: Frontend-Steuerung für das Anmeldeformular (login.html).
   FUNKTION: 
   - Überwacht das 'submit'-Ereignis des Login-Formulars und verhindert das standardmässige Neuladen der Seite.
   - Liest die eingegebenen Daten (E-Mail, Passwort) aus den Input-Feldern aus und bereinigt sie via 'trim'.
   - Übermittelt die Login-Daten als JSON-String via HTTP-POST an die serverseitige Schnittstelle 'login.php'.
   - Verarbeitet die Server-Antwort: Leitet den User bei Erfolg auf das Dashboard ('home.html') weiter 
     oder gibt im Fehlerfall die entsprechende Fehlermeldung via Alert aus.
   ========================================================================= */


document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("api/login.php", {
      method: "POST",
      // credentials: 'include', // uncomment if front-end & back-end are on different domains
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (result.status === "success") {
      // alert("Login successful!");  // später löschen, nur zum debuggen
      window.location.href = "home.html";
    } else {
      alert(result.message || "Login failed.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
});
