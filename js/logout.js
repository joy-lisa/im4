/* =========================================================================
   BESCHREIBUNG: Frontend-Steuerung für den Abmeldevorgang (Logout-Button).
   FUNKTION: 
   - Hängt einen Event-Listener an das UI-Element '#logoutBtn' und blockiert Standard-Link-Aktionen.
   - Sendet einen asynchronen HTTP-GET-Request an die Schnittstelle 'logout.php'.
   - Nutzt 'credentials: "include"', um die zu löschenden Session-Cookies sicher an den Server zu übermitteln.
   - Leitet den Benutzer nach erfolgreicher serverseitiger Session-Zerstörung automatisch 
     auf die Einstiegsseite ('index.html') um.
   ========================================================================= */


document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  // Prevent the default button behavior
  e.preventDefault();

  try {
    const response = await fetch("api/logout.php", {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (result.status === "success") {
      // Redirect to start page after successful logout
      window.location.href = "index.html";
    } else {
      console.error("Logout failed");
      alert("Logout failed. Please try again.");
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("Something went wrong during logout!");
  }
});
