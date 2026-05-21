<?php
// api/get_user_info.php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    $sql = "SELECT
                users.ID,
                users.name,
                users.childname,
                users.email,
                users.haushalt_ID,
                haushalt.name AS haushalt_name,
                haushalt.join_code,
                buzzer.ID AS buzzer_id
            FROM users
            LEFT JOIN haushalt ON users.haushalt_ID = haushalt.ID
            LEFT JOIN buzzer ON haushalt.ID = buzzer.haushalt_ID
            WHERE users.ID = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userData) {
        echo json_encode(["status" => "success", "data" => $userData]);
    } else {
        echo json_encode(["status" => "error", "message" => "Benutzer nicht gefunden"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Datenbankfehler: " . $e->getMessage()]);
}