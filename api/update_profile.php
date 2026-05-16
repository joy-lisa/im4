<?php
// api/update_profile.php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$userId = $_SESSION['user_id'];

// JSON-Daten aus dem JavaScript-Fetch empfangen
$input = json_decode(file_get_contents('php://input'), true);

$newName = isset($input['name']) ? trim($input['name']) : '';
$newChildName = isset($input['childname']) ? trim($input['childname']) : '';

if (empty($newName)) {
    echo json_encode(["status" => "error", "message" => "Name darf nicht leer sein."]);
    exit;
}

try {
    // Spaltennamen in der SQL-Abfrage ("name" und "childname") ggf. an deine DB anpassen!
    $sql = "UPDATE users SET name = ?, childname = ? WHERE ID = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$newName, $newChildName, $userId]);

    echo json_encode(["status" => "success", "message" => "Profil aktualisiert"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Datenbankfehler: " . $e->getMessage()]);
}