<?php

/* =========================================================================
   BESCHREIBUNG: Serverseitige Schutzbarriere (API) zur Überprüfung des Login-Status.
   FUNKTION: 
   - Überprüft, ob eine gültige 'user_id' in der aktuellen PHP-Session existiert.
   - Falls nicht eingeloggt: Setzt den HTTP-Statuscode auf '401 Unauthorized' 
     und sendet eine entsprechende Fehlermeldung im JSON-Format zurück.
   - Falls eingeloggt: Bestätigt den Erfolg und liefert die ID sowie die E-Mail-Adresse 
     des angemeldeten Users als JSON an das Frontend (protected.js) zurück.
   ========================================================================= */

session_start();

if (!isset($_SESSION['user_id'])) {
    // Instead of redirect, return a 401 JSON response
    http_response_code(401); //falls user nicht eingeloggt ist, dann 401 zurückgeben
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// If they are logged in, return user data
echo json_encode([
    "status" => "success",
    "user_id" => $_SESSION['user_id'],
    "email" => $_SESSION['email']
]);
