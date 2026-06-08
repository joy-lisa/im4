<?php

/* =========================================================================
   BESCHREIBUNG: Schnittstelle (API) zur Aktualisierung von Profil- und Haushaltsdaten.
   FUNKTION: 
   - Überprüft den Login-Status des Users über die PHP-Session.
   - Empfängt geänderte Profildaten (Name, Kindname, Monster-Icon) als JSON via HTTP-POST.
   - Fall 1: Aktualisiert den Namen des Elternteils und des Kindes in der Tabelle 'users'.
   - Fall 2: Ermittelt die 'haushalt_ID' des Users und aktualisiert das 'monster_icon' 
     in der Tabelle 'haushalt'.
   - Gibt eine entsprechende Erfolgs- oder Fehlermeldung im JSON-Format zurück.
   ========================================================================= */

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

$newName = isset($input['name']) ? trim($input['name']) : null;
$newChildName = isset($input['childname']) ? trim($input['childname']) : null;
$monsterIcon = isset($input['monster_icon']) ? trim($input['monster_icon']) : null;

if (empty($newName)) {
    echo json_encode(["status" => "error", "message" => "Name darf nicht leer sein."]);
    exit;
}

try {
    // FALL 1: Profil-Daten wurden geändert (nur ausführen, wenn Name gesendet wurde)
    if ($newName !== null) {
        if (empty($newName)) {
            echo json_encode(["status" => "error", "message" => "Name darf nicht leer sein."]);
            exit;
        }

        $sql = "UPDATE users SET name = ?, childname = ? WHERE ID = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$newName, $newChildName, $userId]);
    }

    // FALL 2: Das Monster-Ziel wurde geändert (NEU HINZUGEFÜGT)
    if ($monsterIcon !== null && !empty($monsterIcon)) {
        // Haushalt_ID des Users holen
        $sqlGetHome = "SELECT haushalt_ID FROM users WHERE ID = ?";
        $stmtHome = $pdo->prepare($sqlGetHome);
        $stmtHome->execute([$userId]);
        $userRow = $stmtHome->fetch(PDO::FETCH_ASSOC);

        if ($userRow && !empty($userRow['haushalt_ID'])) {
            $haushaltId = $userRow['haushalt_ID'];

            // Monster in der Tabelle 'haushalt' updaten
            $sqlMonster = "UPDATE haushalt SET monster_icon = ? WHERE ID = ?";
            $stmtMonster = $pdo->prepare($sqlMonster);
            $stmtMonster->execute([$monsterIcon, $haushaltId]);
        } else {
            echo json_encode(["status" => "error", "message" => "Du bist in keinem Haushalt eingetragen."]);
            exit;
        }
    }

    echo json_encode(["status" => "success", "message" => "Daten erfolgreich gespeichert!"]);
    
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Datenbankfehler: " . $e->getMessage()]);
}