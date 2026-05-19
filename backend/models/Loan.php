<?php

require_once __DIR__ . '/../config/Database.php';

class Loan
{
    private PDO $conn;
    private string $table = 'loans';

    public ?string $id = null;
    public string $book_id = '';
    public string $user_id = '';
    public ?string $borrow_date = null;
    public ?string $due_date = null;
    public ?string $return_date = null;
    public float $penalty_amount = 0;
    public bool $penalty_paid = true;
    public ?string $payment_date = null;
    public string $status = 'active'; // 'active' | 'returned' | 'overdue'
    public string $notes = '';

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    // ── Read All (with book & user info) ──
    public function readAll(): array
    {
        $stmt = $this->conn->prepare("
            SELECT l.*, b.title as book_title, u.name as user_name
            FROM {$this->table} l
            LEFT JOIN books b ON l.book_id = b.id
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.borrow_date DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ── Read By ID ──
    public function readById(string $id): ?array
    {
        $stmt = $this->conn->prepare("
            SELECT l.*, b.title as book_title, u.name as user_name
            FROM {$this->table} l
            LEFT JOIN books b ON l.book_id = b.id
            LEFT JOIN users u ON l.user_id = u.id
            WHERE l.id = :id
        ");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    // ── Read By User ──
    public function readByUserId(string $userId): array
    {
        $stmt = $this->conn->prepare("
            SELECT l.*, b.title as book_title, b.author as book_author, b.cover as book_cover
            FROM {$this->table} l
            LEFT JOIN books b ON l.book_id = b.id
            WHERE l.user_id = :user_id
            ORDER BY l.borrow_date DESC
        ");
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    // ── Count Active Loans for User ──
    public function countActiveByUser(string $userId): int
    {
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) FROM {$this->table} WHERE user_id = :user_id AND status != 'returned'
        ");
        $stmt->execute(['user_id' => $userId]);
        return (int) $stmt->fetchColumn();
    }

    // ── Check Unpaid Penalties ──
    public function hasUnpaidPenalties(string $userId): bool
    {
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) FROM {$this->table} 
            WHERE user_id = :user_id AND penalty_amount > 0 AND penalty_paid = 0
        ");
        $stmt->execute(['user_id' => $userId]);
        return (int) $stmt->fetchColumn() > 0;
    }

    // ── Create (Borrow) ──
    public function create(): bool
    {
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table}
            (id, book_id, user_id, borrow_date, due_date, return_date, penalty_amount, penalty_paid, payment_date, status, notes)
            VALUES (:id, :book_id, :user_id, :borrow_date, :due_date, :return_date, :penalty_amount, :penalty_paid, :payment_date, :status, :notes)
        ");
        $this->id = $this->id ?? uniqid('l_');
        $now = date('Y-m-d H:i:s');
        $dueDate = date('Y-m-d H:i:s', strtotime('+21 days'));

        return $stmt->execute([
            'id' => $this->id,
            'book_id' => $this->book_id,
            'user_id' => $this->user_id,
            'borrow_date' => $this->borrow_date ?? $now,
            'due_date' => $this->due_date ?? $dueDate,
            'return_date' => $this->return_date,
            'penalty_amount' => $this->penalty_amount,
            'penalty_paid' => $this->penalty_paid ? 1 : 0,
            'payment_date' => $this->payment_date,
            'status' => $this->status,
            'notes' => $this->notes,
        ]);
    }

    // ── Return Book ──
    public function returnBook(string $loanId): bool
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET status = 'returned', return_date = NOW() WHERE id = :id
        ");
        return $stmt->execute(['id' => $loanId]);
    }

    // ── Extend Loan ──
    public function extendLoan(string $loanId): bool
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET due_date = DATE_ADD(due_date, INTERVAL 14 DAY) 
            WHERE id = :id AND status = 'active'
        ");
        return $stmt->execute(['id' => $loanId]);
    }

    // ── Pay Penalty ──
    public function payPenalty(string $loanId): bool
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET penalty_paid = 1, payment_date = NOW() WHERE id = :id
        ");
        return $stmt->execute(['id' => $loanId]);
    }

    // ── Update Overdue Loans ──
    public function updateOverdueLoans(): int
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET 
                status = 'overdue',
                penalty_amount = DATEDIFF(NOW(), due_date) * 1,
                penalty_paid = 0
            WHERE status = 'active' AND due_date < NOW()
        ");
        $stmt->execute();
        return $stmt->rowCount();
    }
}
