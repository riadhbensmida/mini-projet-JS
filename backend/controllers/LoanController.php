<?php

require_once __DIR__ . '/../models/Loan.php';
require_once __DIR__ . '/../models/Book.php';
require_once __DIR__ . '/../models/User.php';

class LoanController
{
    private Loan $loanModel;
    private Book $bookModel;
    private User $userModel;

    public function __construct()
    {
        $this->loanModel = new Loan();
        $this->bookModel = new Book();
        $this->userModel = new User();
    }

    // GET /api/loans
    public function index(): void
    {
        // First, update any overdue loans
        $this->loanModel->updateOverdueLoans();
        $loans = $this->loanModel->readAll();
        echo json_encode($loans);
    }

    // GET /api/loans/user/{userId}
    public function byUser(string $userId): void
    {
        $this->loanModel->updateOverdueLoans();
        $loans = $this->loanModel->readByUserId($userId);
        echo json_encode($loans);
    }

    // POST /api/loans (borrow a book)
    public function store(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $bookId = $data['book_id'] ?? '';
        $userId = $data['user_id'] ?? '';

        // Validate book availability
        $book = $this->bookModel->readById($bookId);
        if (!$book || $book['available_copies'] <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Livre non disponible']);
            return;
        }

        // Validate user
        $user = $this->userModel->readById($userId);
        if (!$user || $user['status'] !== 'active') {
            http_response_code(400);
            echo json_encode(['error' => 'Utilisateur inactif ou introuvable']);
            return;
        }

        // Check max loans (default 3)
        $activeLoans = $this->loanModel->countActiveByUser($userId);
        $maxLoans = $user['max_loans'] ?? 3;
        if ($activeLoans >= $maxLoans) {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre maximum d\'emprunts atteint']);
            return;
        }

        // Check unpaid penalties
        if ($this->loanModel->hasUnpaidPenalties($userId)) {
            http_response_code(400);
            echo json_encode(['error' => 'Pénalités impayées']);
            return;
        }

        // Create the loan
        $this->loanModel->book_id = $bookId;
        $this->loanModel->user_id = $userId;

        if ($this->loanModel->create()) {
            // Decrease available copies
            $this->bookModel->updateAvailableCopies($bookId, -1);
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $this->loanModel->id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de la création de l\'emprunt']);
        }
    }

    // PATCH /api/loans/{id}/return
    public function returnBook(string $loanId): void
    {
        // Get the loan to find the book_id
        $loans = $this->loanModel->readAll();
        $loan = null;
        foreach ($loans as $l) {
            if ($l['id'] === $loanId) {
                $loan = $l;
                break;
            }
        }

        if (!$loan) {
            http_response_code(404);
            echo json_encode(['error' => 'Emprunt non trouvé']);
            return;
        }

        if ($this->loanModel->returnBook($loanId)) {
            // Increase available copies
            $this->bookModel->updateAvailableCopies($loan['book_id'], 1);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors du retour']);
        }
    }

    // PATCH /api/loans/{id}/extend
    public function extend(string $loanId): void
    {
        if ($this->loanModel->extendLoan($loanId)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de la prolongation']);
        }
    }

    // PATCH /api/loans/{id}/pay-penalty
    public function payPenalty(string $loanId): void
    {
        if ($this->loanModel->payPenalty($loanId)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors du paiement']);
        }
    }
}
