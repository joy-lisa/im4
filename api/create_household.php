<?php
// create_household.php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

// Prüfen, ob User eingeloggt
$userId = $_SESSION['user_id'];

//ID aus der Session nehmen
$data = json_decode(file_get_contents("php://input"), true);
$householdName = trim($data['name'] ?? '');

// 6-stelligen Zufallscode generieren (z.B. A7B2X9)
$joinCode = $data['join_code'] ?? strtoupper(substr(md5(uniqid()), 0, 6));

if (empty($householdName)) {
    echo json_encode(["status" => "error", "message" => "Haushaltsname ist erforderlich"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Haushalt anlegen
    $stmt = $pdo->prepare("INSERT INTO haushalt (name, join_code) VALUES (?, ?)");
    $stmt->execute([$householdName, $joinCode]);
    $householdId = $pdo->lastInsertId();

    // 2. User dem Haushalt zuweisen
    $update = $pdo->prepare("UPDATE users SET haushalt_ID = ? WHERE id = ?");
    $update->execute([$householdId, $userId]);

    $pdo->commit();

    echo json_encode(["status" => "success", "join_code" => $joinCode, "debug_user" => $userId]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

