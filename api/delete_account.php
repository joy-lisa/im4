<?php
session_start();
header('Content-Type: application/json');

// 1. SCHUTZBARRIERE: Prüfen, ob der Nutzer überhaupt eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht autorisiert. Bitte logge dich neu ein."]);
    exit();
}

require_once("../system/config.php");

try {
    $userId = $_SESSION['user_id'];

    // 2. DATENBANK-LÖSCHUNG: Löscht den User anhand seiner eindeutigen ID
    // Falls deine Tabelle in der Datenbank anders heisst (z.B. 'benutzer'), passe das Wort 'users' an.
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
    $stmt->execute(['id' => $userId]);


    // 3. SESSION ZERSTÖREN: Loggt den User im Browser komplett aus
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();

    // Alles hat geklappt! Rückmeldung an dein JavaScript senden
    echo json_encode(["status" => "success", "message" => "Konto erfolgreich gelöscht."]);

} catch (PDOException $e) {
    // Falls die Datenbank streikt, Fehlermeldung zurückgeben
    echo json_encode(["status" => "error", "message" => "Datenbankfehler: " . $e->getMessage()]);
}
?>