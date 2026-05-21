<?php

require_once("../system/config.php");
// echo "This script receives HTTP POST messages and pushes their content into the database.";

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true); 

###################################### Empfangen der JSON-Daten

$scan1 = $input["scan1"];
$scan2 = $input["scan2"];
$monster_da = $input["bewegung"];
$buzzer_ID = $input ["buzzer_ID"];

// Hol den Wert an der Stelle "wert" aus dem JS-Objekt (ehemals JSON-String)
# insert new user into db
$sql = "INSERT INTO buzzer_event (scan_1, scan_2, monster_da, buzzer_ID)
VALUES (?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->execute([$scan1, $scan2, $monster_da, $buzzer_ID]);

echo "OK gespeichert: Scan1=$scan1, Scan2=$scan2, monster_da=$monster_da";

?>