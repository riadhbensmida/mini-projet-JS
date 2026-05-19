<?php
/**
 * BIBLI'NET UNIFIED ROUTER
 * This script allows running the entire project (Frontend + Backend) on ONE port.
 * 
 * HOW TO RUN:
 * 1. Stop all other PHP servers.
 * 2. In your terminal, go to the root folder: c:\Users\riadh\Downloads\mini-projet-JS
 * 3. Run: php -S 127.0.0.1:8000 router.php
 */

// 1. SESSION CONFIG (Permissive for local development)
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '', // Empty for localhost
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 2. ROUTE TO API
if (str_starts_with($uri, '/api')) {
    // Basic CORS (though not strictly needed on same port)
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    require_once __DIR__ . '/backend/routes/api.php';
    try {
        Router::dispatch();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// 3. SERVE STATIC FILES
// Handle /uploads path for book images
if (str_starts_with($uri, '/uploads')) {
    $file = __DIR__ . '/backend' . $uri;
} else {
    // Default to frontend folder
    $file = __DIR__ . '/frontend' . $uri;
}

// Default to index.html if path is empty or /
if ($uri == '/' || $uri == '') {
    $file = __DIR__ . '/frontend/index.html';
}

if (is_file($file)) {
    // Set correct MIME types for the dev server
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $mimes = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        'html' => 'text/html'
    ];
    if (isset($mimes[$ext])) {
        header("Content-Type: {$mimes[$ext]}");
    }
    readfile($file);
    exit;
}

// 4. FALLBACK: If file not found but ends in .html, it might be in a subfolder
// The PHP server usually handles this, but let's be safe.
http_response_code(404);
echo "404 - Fichier introuvable: " . htmlspecialchars($uri);
