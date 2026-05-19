<?php

require_once __DIR__ . '/../models/Reservation.php';
require_once __DIR__ . '/../models/Loan.php';
require_once __DIR__ . '/../models/Book.php';

class ReservationController
{
    private Reservation $reservationModel;
    private Loan $loanModel;
    private Book $bookModel;

    public function __construct()
    {
        $this->reservationModel = new Reservation();
        $this->loanModel = new Loan();
        $this->bookModel = new Book();
    }

    // GET /api/reservations
    public function index(): void
    {
        // Auto-expire old reservations first
        $this->reservationModel->expireOldReservations();
        $reservations = $this->reservationModel->readAll();
        echo json_encode($reservations);
    }

    // GET /api/reservations/user/{userId}
    public function byUser(string $userId): void
    {
        $this->reservationModel->expireOldReservations();
        $reservations = $this->reservationModel->readByUserId($userId);
        echo json_encode($reservations);
    }

    // POST /api/reservations
    public function store(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $bookId = $data['book_id'] ?? '';
        $userId = $data['user_id'] ?? '';

        // 1. Validate book existence and availability
        $book = $this->bookModel->readById($bookId);
        if (!$book) {
            http_response_code(404);
            echo json_encode(['error' => 'Livre non trouvé']);
            return;
        }

        // Rule: Only reserve if NO copies are available
        if ($book['available_copies'] > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Ce livre est disponible, vous pouvez l\'emprunter directement.']);
            return;
        }

        // 2. Check if user already has an active reservation for this book
        if ($this->reservationModel->hasActiveReservation($userId, $bookId)) {
            http_response_code(400);
            echo json_encode(['error' => 'Vous avez déjà une réservation active pour ce livre.']);
            return;
        }

        // 3. Check limit: max 5 active reservations per member
        $activeCount = $this->reservationModel->countActiveByUserId($userId);
        if ($activeCount >= 5) {
            http_response_code(400);
            echo json_encode(['error' => 'Limite de 5 réservations actives atteinte.']);
            return;
        }

        $this->reservationModel->book_id = $bookId;
        $this->reservationModel->user_id = $userId;

        if ($this->reservationModel->create()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $this->reservationModel->id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de la réservation']);
        }
    }

    // PATCH /api/reservations/{id}/cancel
    public function cancel(string $reservationId): void
    {
        if ($this->reservationModel->cancel($reservationId)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de l\'annulation']);
        }
    }

    // PATCH /api/reservations/{id}/convert
    public function convert(string $reservationId): void
    {
        $reservation = $this->reservationModel->readById($reservationId);
        if (!$reservation) {
            http_response_code(404);
            echo json_encode(['error' => 'Réservation non trouvée']);
            return;
        }

        // Create loan from reservation
        $this->loanModel->book_id = $reservation['book_id'];
        $this->loanModel->user_id = $reservation['user_id'];

        if ($this->loanModel->create()) {
            $this->bookModel->updateAvailableCopies($reservation['book_id'], -1);
            $this->reservationModel->convertToLoan($reservationId);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de la conversion']);
        }
    }
}
