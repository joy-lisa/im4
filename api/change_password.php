<?php

session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

//1. Prüfen, od der User eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$userId = $_SESSION['user_id'];

// JSON-Daten aus dem JavaScript-Fetch empfangen
$data = json_decode(file_get_contents('php://input'), true);
$oldPassword = $data['old_password'] ?? '';
$newPassword = $data['new_password'] ?? '';

//Validierung: Sind die Felder ausgefüllt?
if (empty($oldPassword) || empty($newPassword)) {
    echo json_encode(["status" => "error", "message" => "Alle Felder müssen ausgefüllt sein."]);
    exit;
}

try {
    //2. Altes Passwort aus DB holen
    $stmt = $pdo->prepare("SELECT password FROM users WHERE ID = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "Benutzer nicht gefunden"]);
        exit;
    }

    //3. Altes Passwort überprüfen
    if (!password_verify($oldPassword, $user['password'])) {
        echo json_encode(["status" => "error", "message" => "Altes Passwort ist falsch"]);
        exit;
    }

    //4. Neues Passwort hashen und in DB speichern
    $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    //5. Passwort in der DB aktualisieren
    $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE ID = ?");
    $updateStmt->execute([$newHashedPassword, $userId]);

    echo json_encode(["status" => "success", "message" => "Passwort erfolgreich geändert"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Datenbankfehler: " . $e->getMessage()]);
}