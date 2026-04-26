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

        $this->reservationModel->book_id = $data['book_id'] ?? '';
        $this->reservationModel->user_id = $data['user_id'] ?? '';

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
