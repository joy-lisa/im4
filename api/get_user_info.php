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
                haushalt.monster_icon, 
                buzzer.ID AS buzzer_id
            FROM users
            LEFT JOIN haushalt ON users.haushalt_ID = haushalt.ID
            LEFT JOIN buzzer ON haushalt.ID = buzzer.haushalt_ID
            WHERE users.ID = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userData) {
        // Fetch household members
        $members = [];
        if (!empty($userData['haushalt_ID'])) {
            $sqlMembers = "SELECT name, email FROM users WHERE haushalt_ID = ? ORDER BY name ASC";
            $stmtMembers = $pdo->prepare($sqlMembers);
            $stmtMembers->execute([$userData['haushalt_ID']]);
            $members = $stmtMembers->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode(["status" => "success", "data" => $userData, "members" => $members]);
    } else {
        echo json_encode(["status" => "error", "message" => "Benutzer nicht gefunden"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Datenbankfehler: " . $e->getMessage()]);
}