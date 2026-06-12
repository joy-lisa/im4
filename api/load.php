<?php

/* =========================================================================
   BESCHREIBUNG: Datenschnittstelle (Web-Hook) für das physische IoT-Artefakt.
   FUNKTION: 
   - Wird vom Mikrokontroller (ESP32-C6) via HTTP-POST-Request aufgerufen.
   - Empfängt die Sensordaten (Scan-Werte, Bewegung/Knopfdruck, Geräte-ID) als JSON-Stream.
   - Decodiert die JSON-Daten in ein verarbeitbares PHP-Array.
   - Speichert die empfangenen Messwerte sicher via PDO-Prepared-Statement in die Tabelle 'buzzer_event'.
   - Sendet eine Plain-Text-Bestätigung ('OK gespeichert') an den Mikrokontroller zurück.
   ========================================================================= */

require_once("../system/config.php");
// echo "This script receives HTTP POST messages and pushes their content into the database.";

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true); 

###################################### Empfangen der JSON-Daten

$scan1 = $input["scan1"];
$scan2 = $input["scan2"];
$monster_da = $input["bewegung"];
$buzzer_ID = $input ["buzzer_ID"];

# insert new user into db
$sql = "INSERT INTO buzzer_event (scan_1, scan_2, monster_da, buzzer_ID)
VALUES (?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->execute([$scan1, $scan2, $monster_da, $buzzer_ID]);

echo "OK gespeichert: Scan1=$scan1, Scan2=$scan2, monster_da=$monster_da";

?>
