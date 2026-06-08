<?php

/* =========================================================================
   BESCHREIBUNG: Schnittstelle (API) zum Beitritt in eine bestehende Haushaltsgruppe.
   FUNKTION: 
   - Überprüft den Login-Status des Users via Session.
   - Empfängt den eingegebenen 'join_code' als JSON-Daten über das Frontend.
   - Sucht in der Tabelle 'haushalt' nach einem passenden und gültigen Code.
   - Verknüpft bei Erfolg den User über das Attribut 'haushalt_ID' mit der gefundenen Gruppe.
   - Sendet eine entsprechende Erfolgs- oder Fehlermeldung (z. B. bei ungültigem Code) zurück.
   ========================================================================= */

session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$userId = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"), true);
$joinCode = trim($data['join_code'] ?? '');

if (empty($joinCode)) {
    echo json_encode(["status" => "error", "message" => "Bitte Code eingeben"]);
    exit;
}

try {
    // Haushalt suchen
    $stmt = $pdo->prepare("SELECT id, name FROM haushalt WHERE join_code = ?");
    $stmt->execute([$joinCode]);
    $household = $stmt->fetch();

    if ($household) {
        $householdId = $household['id'];


        $update = $pdo->prepare("UPDATE users SET haushalt_ID = ? WHERE id = ?");
        $update->execute([$household['id'], $userId]);

        echo json_encode(["status" => "success", "message" => "Haushalt '" .$household['name'] . "' beigetreten"]);
        
    } else {
        echo json_encode(["status" => "error", "message" => "Code ungültig!"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}