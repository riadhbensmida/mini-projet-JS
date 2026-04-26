<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=biblionet', 'root', '');
    $stmt = $db->prepare('SELECT name, email, password, role FROM users');
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "--- DATABASE USERS ---\n";
    foreach ($users as $u) {
        $is_admin_pass = password_verify('admin', $u['password']) ? 'YES' : 'NO';
        echo "Email: {$u['email']} | Role: {$u['role']} | Pass is 'admin': $is_admin_pass\n";
        echo "Hash: " . $u['password'] . "\n\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
