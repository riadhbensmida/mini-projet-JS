<?php

/**
 * API Route Definitions
 * All routes are prefixed with /api
 */

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/BookController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../controllers/LoanController.php';
require_once __DIR__ . '/../controllers/ReservationController.php';

// ── Auth Routes ──
$auth = new AuthController();
Router::post('/api/auth/login', [$auth, 'login']);
Router::post('/api/auth/register', [$auth, 'register']);
Router::post('/api/auth/logout', [$auth, 'logout']);
Router::get('/api/auth/me', [$auth, 'me']);

// ── User Routes ──
$users = new UserController();
Router::get('/api/users', [$users, 'index']);
Router::get('/api/users/{id}', [$users, 'show']);
Router::post('/api/users', [$users, 'store']);
Router::patch('/api/users/{id}/status', [$users, 'updateStatus']);
Router::delete('/api/users/{id}', [$users, 'destroy']);

// ── Book Routes ──
$books = new BookController();
Router::get('/api/books', [$books, 'index']);
Router::get('/api/books/search', [$books, 'search']);
Router::get('/api/books/{id}', [$books, 'show']);
Router::post('/api/books', [$books, 'store']);
Router::put('/api/books/{id}', [$books, 'update']);
Router::delete('/api/books/{id}', [$books, 'destroy']);

// ── Category Routes ──
$categories = new CategoryController();
Router::get('/api/categories', [$categories, 'index']);
Router::get('/api/categories/{id}', [$categories, 'show']);
Router::post('/api/categories', [$categories, 'store']);
Router::put('/api/categories/{id}', [$categories, 'update']);
Router::delete('/api/categories/{id}', [$categories, 'destroy']);

// ── Loan Routes ──
$loans = new LoanController();
Router::get('/api/loans', [$loans, 'index']);
Router::get('/api/loans/user/{userId}', [$loans, 'byUser']);
Router::post('/api/loans', [$loans, 'store']);
Router::patch('/api/loans/{id}/return', [$loans, 'returnBook']);
Router::patch('/api/loans/{id}/extend', [$loans, 'extend']);
Router::patch('/api/loans/{id}/pay-penalty', [$loans, 'payPenalty']);

// ── Reservation Routes ──
$reservations = new ReservationController();
Router::get('/api/reservations', [$reservations, 'index']);
Router::get('/api/reservations/user/{userId}', [$reservations, 'byUser']);
Router::post('/api/reservations', [$reservations, 'store']);
Router::patch('/api/reservations/{id}/cancel', [$reservations, 'cancel']);
Router::patch('/api/reservations/{id}/convert', [$reservations, 'convert']);
