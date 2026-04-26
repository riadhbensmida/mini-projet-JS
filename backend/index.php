<?php

/**
 * Main Entry Point for PHP API
 */

// Headers for JSON response and CORS
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173"); // Allow Vite dev server
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

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
