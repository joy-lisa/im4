<?php

/* =========================================================================
   BESCHREIBUNG: Schnittstelle (API) zur sicheren Abmeldung des Benutzers.
   FUNKTION: 
   - Initialisiert Zugriff auf die bestehende PHP-Session.
   - Leert das globale '$_SESSION'-Array im Arbeitsspeicher des Servers komplett.
   - Zerstört die serverseitigen Session-Daten mittels 'session_destroy'.
   - Gibt eine Erfolgsmeldung im JSON-Format an das Frontend zurück, damit JavaScript 
     die Weiterleitung zur Startseite (login.html) einleiten kann.
   ========================================================================= */

session_start();
$_SESSION = [];
session_destroy();

// Return a success response instead of redirecting
header('Content-Type: application/json');
echo json_encode(["status" => "success"]);
exit;
?>