<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '127.0.0.1',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

/**
 * Main Entry Point for PHP API
 */

// Allow built-in PHP server to serve static files directly
if (PHP_SAPI === 'cli-server') {
    $url = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file) && !str_ends_with($file, '.php')) {
        return false;
    }
}

// Headers for JSON response and CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Set JSON content type only for non-static requests
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Error reporting (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Load the router and routes
require_once __DIR__ . '/routes/api.php';

// Dispatch the request
try {
    Router::dispatch();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Une erreur interne est survenue',
        'message' => $e->getMessage()
    ]);
}
