<?php

/* =========================================================================
   BESCHREIBUNG: Registrierungs-Schnittstelle (API) zur Erstellung neuer Benutzerkonten.
   FUNKTION: 
   - Verarbeitet Registrierungsdaten via HTTP-POST und decodiert den JSON-Inhalt.
   - Bereinigt die Eingaben (E-Mail, Passwort, Name der Eltern und Name des Kindes).
   - Prüft in der Tabelle 'users', ob die angegebene E-Mail-Adresse bereits existiert.
   - Hasht das gewählte Passwort mittels 'password_hash' (PASSWORD_DEFAULT) nach aktuellen Sicherheitsstandards.
   - Speichert den neuen Benutzerdatensatz sicher via PDO-Prepared-Statement in der MySQL-Datenbank ab.
   ========================================================================= */

session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $email    = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');
    $name     = trim($data['name'] ?? '');
    $childname = trim($data['childname'] ?? '');
    // $emoji    = trim($data['emoji'] ?? ''); --- IGNORE --

    if (!$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Email and password are required"]);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "Email is already in use"]);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert the new user
    $insert = $pdo->prepare("INSERT INTO users (email, password, name, childname) VALUES (:email, :pass, :name, :childname)");
    $insert->execute([
        ':email' => $email,
        ':pass'  => $hashedPassword,
        ':name' => $name,
        ':childname' => $childname,
        // ':emoji' => $data['emoji'] ?? ''
    ]);

    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
