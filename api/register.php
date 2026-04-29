<?php

session_start();
header("Content-Type: application/json");

require_once '../system/config.php'; //wir verbinden das register.php mit der config.php und sie werden zu einem dokument

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

//hier wollen wir die variablen entpacken

//entpacke die daten
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['password'];

// checken, ob die email schon existiert
$stmt = $pdo->prepare("SELECT email FROM users WHERE email = :email");
$stmt->execute([':email' => $email]);

if($stmt->fetch()){
    echo json_encode([
    "status" => "error",
    "message" => "Email already exists"
]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// neuen user in die DB einfügen
$insert = $pdo->prepare("INSERT into users (email, password) VALUES (:email, :pass)");
$insert->execute([
    ':email' => $email,
    ':pass' => $hashedPassword
]);

//an JS zurücksenden
echo json_encode([
    "status" => "success",
    "email" => $email
]);

}
?>