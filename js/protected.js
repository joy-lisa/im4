/* =========================================================================
   BESCHREIBUNG: Frontend-Initialisierung für geschützte Ansichten.
   FUNKTION: 
   - Wartet, bis das gesamte Fenster ('load'-Event) vollständig geladen ist.
   - Ruft die globale Sicherheitsfunktion 'requireAuth()' (aus auth.js) auf, um den Login-Status zu prüfen.
   - Bricht die Ausführung ab, falls kein gültiger User zurückgegeben wird (da bereits eine Weiterleitung läuft).
   - Liest bei erfolgreicher Validierung die Session-Daten (E-Mail, User-ID) aus und 
     schreibt diese dynamisch in die entsprechenden HTML-Textelemente ('#userEmail', '#userId').
   ========================================================================= */

window.addEventListener("load", async function () {
  const user = await requireAuth();
  if (!user) return; // requireAuth already redirected

  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("userId").textContent = user.user_id;
});
