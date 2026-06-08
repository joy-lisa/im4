<?php

/* =========================================================================
   BESCHREIBUNG: Schnittstelle (API) zur Aufbereitung der Statistik- und Trenddaten.
   FUNKTION: 
   - Startet die Session und bindet die zentrale Datenbankkonfiguration ein.
   - Empfängt eine 'buzzer_ID' via HTTP-GET-Parameter.
   - Aggregiert Sensor-Ereignisse pro Tag (Anzahl und kommagetrennte Uhrzeiten via 'GROUP_CONCAT').
   - Berechnet einen prozentualen Wochenvergleich (Trend) der Alarme (aktuelle 7 Tage vs. Vorwoche).
   - Formatiert die Ergebnisse als X/Y-Koordinaten für die JavaScript-Diagramme (chart.js).
   - Gibt die Daten strukturiert als JSON-Objekt aus.
   ========================================================================= */

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

    // =========================================================================
    // TREND FÜR DIE AKTULLE BUZZER_ID BERECHNEN
    // =========================================================================
    
    // 1. Auslösungen dieser Woche zählen für diese buzzer_id (letzte 7 Tage)
    $stmt1 = $pdo->prepare("SELECT COUNT(*) FROM buzzer_event WHERE buzzer_ID = :id AND timestamp >= NOW() - INTERVAL 7 DAY");
    $stmt1->execute(['id' => $buzzer_id]);
    $dieseWoche = $stmt1->fetchColumn();

    // 2. Auslösungen letzte Woche zählen für diese buzzer_id (Tag 8 bis 14 in der Vergangenheit)
    $stmt2 = $pdo->prepare("SELECT COUNT(*) FROM buzzer_event WHERE buzzer_ID = :id AND timestamp >= NOW() - INTERVAL 14 DAY AND timestamp < NOW() - INTERVAL 7 DAY");
    $stmt2->execute(['id' => $buzzer_id]);
    $letzteWoche = $stmt2->fetchColumn();

    $prozent = 0;
    $trendText = "";

    if ($letzteWoche == 0 && $dieseWoche > 0) {
        $prozent = 100;
        $trendText = "+100% häufiger";
    } elseif ($letzteWoche == 0 && $dieseWoche == 0) {
        $prozent = 0;
        $trendText = "0% (Alles ruhig)";
    } else {
        $differenz = $dieseWoche - $letzteWoche;
        $prozent = round(($differenz / $letzteWoche) * 100);
        
        if ($prozent > 0) {
            $trendText = "+" . $prozent . "% häufiger";
        } elseif ($prozent < 0) {
            $trendText = $prozent . "% seltener";
        } else {
            $trendText = "Gleichbleibend";
        }
    }


    echo json_encode([
        "chartData" => $chartData, 
        "trend" => [
        "prozent" => $prozent,
        "text" => $trendText
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}