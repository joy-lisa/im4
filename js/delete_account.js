document.addEventListener("DOMContentLoaded", () => {
    const deleteBtnLink = document.getElementById("deleteAccountBtn");
    const deletePopupOverlay = document.getElementById("deleteAccountPopup");
    const btnCancelDelete = document.getElementById("btnCancelDelete");
    const btnConfirmDelete = document.getElementById("btnConfirmDelete");

    // Popup öffnen
    if (deleteBtnLink && deletePopupOverlay) {
        deleteBtnLink.addEventListener("click", (e) => {
            e.preventDefault();
            deletePopupOverlay.style.display = "flex";
        });
    }

    // Popup schliessen
    if (btnCancelDelete && deletePopupOverlay) {
        btnCancelDelete.addEventListener("click", () => {
            deletePopupOverlay.style.display = "none";
        });
    }

    // Löschung an PHP senden
    if (btnConfirmDelete) {
        btnConfirmDelete.addEventListener("click", async () => {
            try {
                const response = await fetch("api/delete_account.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                const result = await response.json();

                if (result.status === "success") {
                    alert("Dein Konto wurde erfolgreich gelöscht. Auf Wiedersehen!");
                    window.location.href = "index.html";
                } else {
                    alert("Fehler beim Löschen: " + result.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Verbindung zum Server fehlgeschlagen.");
            }
        });
    }
});