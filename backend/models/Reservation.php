<?php

require_once __DIR__ . '/../config/Database.php';

class Reservation
{
    private PDO $conn;
    private string $table = 'reservations';

    public ?string $id = null;
    public string $book_id = '';
    public string $user_id = '';
    public ?string $reservation_date = null;
    public ?string $expiry_date = null;
    public string $status = 'pending'; // 'pending' | 'notified' | 'converted' | 'cancelled' | 'expired'
    public bool $notified = false;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    // ── Read All (with book & user info) ──
    public function readAll(): array
    {
        $stmt = $this->conn->prepare("
            SELECT r.*, b.title as book_title, u.name as user_name
            FROM {$this->table} r
            LEFT JOIN books b ON r.book_id = b.id
            LEFT JOIN users u ON r.user_id = u.id
            ORDER BY r.reservation_date DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ── Read By User ──
    public function readByUserId(string $userId): array
    {
        $stmt = $this->conn->prepare("
            SELECT r.*, b.title as book_title, b.author as book_author
            FROM {$this->table} r
            LEFT JOIN books b ON r.book_id = b.id
            WHERE r.user_id = :user_id
            ORDER BY r.reservation_date DESC
        ");
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    // ── Count Active Reservations by User ──
    public function countActiveByUserId(string $userId): int
    {
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) FROM {$this->table} 
            WHERE user_id = :user_id AND status IN ('pending', 'notified')
        ");
        $stmt->execute(['user_id' => $userId]);
        return (int) $stmt->fetchColumn();
    }

    // ── Check if user already reserved this book ──
    public function hasActiveReservation(string $userId, string $bookId): bool
    {
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) FROM {$this->table} 
            WHERE user_id = :user_id AND book_id = :book_id AND status IN ('pending', 'notified')
        ");
        $stmt->execute(['user_id' => $userId, 'book_id' => $bookId]);
        return (int) $stmt->fetchColumn() > 0;
    }

    // ── Create ──
    public function create(): bool
    {
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} (id, book_id, user_id, reservation_date, expiry_date, status, notified)
            VALUES (:id, :book_id, :user_id, :reservation_date, :expiry_date, :status, :notified)
        ");
        $this->id = $this->id ?? uniqid('r_');
        $now = date('Y-m-d H:i:s');
        $expiry = date('Y-m-d H:i:s', strtotime('+7 days'));

        return $stmt->execute([
            'id' => $this->id,
            'book_id' => $this->book_id,
            'user_id' => $this->user_id,
            'reservation_date' => $this->reservation_date ?? $now,
            'expiry_date' => $this->expiry_date ?? $expiry,
            'status' => $this->status,
            'notified' => $this->notified ? 1 : 0,
        ]);
    }

    // ── Cancel ──
    public function cancel(string $reservationId): bool
    {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET status = 'cancelled' WHERE id = :id");
        return $stmt->execute(['id' => $reservationId]);
    }

    // ── Convert to Loan ──
    public function convertToLoan(string $reservationId): bool
    {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET status = 'converted' WHERE id = :id");
        return $stmt->execute(['id' => $reservationId]);
    }

    // ── Get Oldest Pending for a Book ──
    public function getOldestPendingByBook(string $bookId): ?array
    {
        $stmt = $this->conn->prepare("
            SELECT * FROM {$this->table} 
            WHERE book_id = :book_id AND status = 'pending' 
            ORDER BY reservation_date ASC 
            LIMIT 1
        ");
        $stmt->execute(['book_id' => $bookId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    // ── Notify Member (and set 48h limit) ──
    public function notify(string $reservationId): bool
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} 
            SET status = 'notified', notified = 1, expiry_date = DATE_ADD(NOW(), INTERVAL 2 DAY) 
            WHERE id = :id
        ");
        return $stmt->execute(['id' => $reservationId]);
    }

    // ── Expire old reservations ──
    public function expireOldReservations(): int
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET status = 'expired' 
            WHERE status IN ('pending', 'notified') AND expiry_date < NOW()
        ");
        $stmt->execute();
        return $stmt->rowCount();
    }

    // ── Read by ID ──
    public function readById(string $id): ?array
    {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
