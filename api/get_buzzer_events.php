<?php

/* =========================================================================
   BESCHREIBUNG: Schnittstelle (API) zum Abrufen der aufgezeichneten Alarme (Knopfdrücke).
   FUNKTION: 
   - Überprüft den Login-Status des Users via Session.
   - Nimmt die 'buzzer_ID' und optional ein spezifisches 'datum' via HTTP-GET entgegen.
   - Formatiert den Zeitstempel der Events direkt in der SQL-Abfrage zu lesbaren Uhrzeiten ('%H:%i Uhr').
   - Sortiert die Ereignisse so, dass die neuesten Alarme immer zuerst erscheinen (DESC).
   - Liefert die Event-Liste als JSON-Array an das Dashboard (home.js) zurück.
   ========================================================================= */

// api/get_buzzer_events.php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$buzzerId = isset($_GET['buzzer_ID']) ? $_GET['buzzer_ID'] : null;
// NEU: Das Datum aus der URL holen (z.B. ?datum=2026-05-25)
$selectedDate = isset($_GET['datum']) ? $_GET['datum'] : null;

if (!$buzzerId || $buzzerId === 0 || $buzzerId === "") {
    echo json_encode(["status" => "success", "events" => []]);
    exit;
}

try {
    // Basis-Query (Uhrzeit formatiert)
    $sql = "SELECT 
                ID, 
                monster_da, 
                DATE_FORMAT(timestamp, '%H:%i Uhr') AS formatiert_zeit 
            FROM buzzer_event 
            WHERE buzzer_ID = ?";
    
    $params = [$buzzerId];

    // Wenn ein Datum mitgeschickt wurde, hängen wir den Filter an
    if (!empty($selectedDate)) {
        $sql .= " AND DATE(timestamp) = ?";
        $params[] = $selectedDate;
    }

    // Sortierung: Die neuesten Alarme zuerst
    $sql .= " ORDER BY timestamp DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "events" => $events
    ]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Datenbankfehler: " . $e->getMessage()]);
}