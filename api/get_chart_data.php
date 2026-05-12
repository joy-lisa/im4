<?php

session_start(); // Session starten, um auf $_SESSION zugreifen zu können

ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
// Hier DB-Verbindung herstellen
require_once("../system/config.php");

//Pfad prüfen
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    
    // 1. Sicherheit: Prüfen ob buzzer_ID da ist
    if (!isset($_GET['buzzer_ID'])) {
        echo json_encode(["error" => "Keine buzzer_ID übergeben"]);
        exit;
    }

    $buzzer_id = $_GET['buzzer_ID'];

    // 2. SQL: Zähle Ereignisse pro Tag und sammle Uhrzeiten
    // DATE(timestamp) extrahiert nur das Datum (z.B. 2026-05-12)
    // TIME(timestamp) extrahiert die Uhrzeit
    $sql = "SELECT 
                DATE(timestamp) as datum, 
                COUNT(*) as anzahl,
                GROUP_CONCAT(TIME(timestamp) SEPARATOR ', ') as uhrzeiten
            FROM buzzer_event 
            WHERE buzzer_ID = :id 
            GROUP BY DATE(timestamp)
            ORDER BY DATE(timestamp) ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $buzzer_id]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Daten für JS formatieren
    $chartData = [];
    foreach ($results as $row) {
        $chartData[] = [
            'x' => $row['datum'],     // Das Datum für die X-Achse
            'y' => $row['anzahl'],    // Die Anzahl für die Balkenhöhe
            'times' => $row['uhrzeiten'] // Die Liste der Uhrzeiten für den Tooltip
        ];
    }

    echo json_encode($chartData);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}