<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'mon_site');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Erreur de connexion: " . $conn->connect_error);
}

$conn->set_charset('utf8mb4');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

$nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

$errors = [];

if (empty($nom)) {
    $errors[] = "Le nom est obligatoire";
} elseif (strlen($nom) < 2) {
    $errors[] = "Le nom doit contenir au moins 2 caractères";
}

if (empty($email)) {
    $errors[] = "L'email est obligatoire";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Email invalide";
}

if (empty($message)) {
    $errors[] = "Le message est obligatoire";
} elseif (strlen($message) < 5) {
    $errors[] = "Le message doit contenir au moins 5 caractères";
}

if (!empty($errors)) {
    // Afficher les erreurs
    $errorMsg = implode("\\n", $errors);
    echo "<script>alert('Erreurs:\\n" . $errorMsg . "'); window.location.href='contact.html';</script>";
    $conn->close();
    exit;
}

// Insertion dans la base de données
$dateEnvoi = date('Y-m-d H:i:s');
$stmt = $conn->prepare("INSERT INTO contacts (nom, email, message, date_envoi) VALUES (?, ?, ?, ?)");
$stmt->bind_param('ssss', $nom, $email, $message, $dateEnvoi);

if ($stmt->execute()) {
    echo "<script>alert('✓ Message envoyé avec succès !\\nMerci " . addslashes($nom) . ", nous vous répondrons à " . addslashes($email) . "'); window.location.href='contact.html';</script>";
} else {
    echo "<script>alert('✗ Erreur: " . addslashes($stmt->error) . "'); window.location.href='contact.html';</script>";
}

$stmt->close();
$conn->close();
?>