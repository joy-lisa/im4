<?php
// join_household.php
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