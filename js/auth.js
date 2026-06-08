/* =========================================================================
   BESCHREIBUNG: Frontend-Schutzbarriere zur Überprüfung der Authentifizierung.
   FUNKTION: 
   - Führt beim Laden der Seite eine asynchrone Abfrage (Fetch-API) an die API 'protected.php' aus.
   - Übermittelt die Session-Cookies via 'credentials: "include"'.
   - Abfangen unbefugter Zugriffe: Falls die API den Status '401 Unauthorized' zurückgibt, 
     wird der User sofort automatisch auf die Login-Seite ('login.html') weitergeleitet.
   - Gibt bei erfolgreichem Login die Benutzerdaten (E-Mail, User-ID) für andere Skripte frei.
   ========================================================================= */

async function requireAuth() {
  const response = await fetch("/api/protected.php", {
    credentials: "include",
  });

  if (response.status === 401) {
    window.location.href = "/login.html";
    return null;
  }

  return response.json(); // { email, user_id }
}

requireAuth(); // Redirects if not authenticated
console.log("User is authenticated");