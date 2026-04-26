<?php

require_once __DIR__ . '/../config/Database.php';

class Book
{
    private PDO $conn;
    private string $table = 'books';

    public ?string $id = null;
    public string $title = '';
    public string $author = '';
    public string $isbn = '';
    public string $publisher = '';
    public int $publication_year = 0;
    public string $category_id = '';
    public string $cover = '';
    public string $description = '';
    public int $total_copies = 0;
    public int $available_copies = 0;
    public string $location = '';

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    // ── Read All ──
    public function readAll(): array
    {
        $stmt = $this->conn->prepare("
            SELECT b.*, c.name as category_name 
            FROM {$this->table} b
            LEFT JOIN categories c ON b.category_id = c.id
            ORDER BY b.created_at DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ── Read By ID ──
    public function readById(string $id): ?array
    {
        $stmt = $this->conn->prepare("
            SELECT b.*, c.name as category_name 
            FROM {$this->table} b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.id = :id
        ");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    // ── Search ──
    public function search(string $query): array
    {
        $stmt = $this->conn->prepare("
            SELECT b.*, c.name as category_name 
            FROM {$this->table} b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.title LIKE :query OR b.author LIKE :query2 OR b.isbn LIKE :query3
            ORDER BY b.title ASC
        ");
        $like = "%{$query}%";
        $stmt->execute(['query' => $like, 'query2' => $like, 'query3' => $like]);
        return $stmt->fetchAll();
    }

    // ── Create ──
    public function create(): bool
    {
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} 
            (id, title, author, isbn, publisher, publication_year, category_id, cover, description, total_copies, available_copies, location, created_at, updated_at)
            VALUES (:id, :title, :author, :isbn, :publisher, :publication_year, :category_id, :cover, :description, :total_copies, :available_copies, :location, NOW(), NOW())
        ");
        $this->id = $this->id ?? uniqid('b_');
        return $stmt->execute([
            'id' => $this->id,
            'title' => $this->title,
            'author' => $this->author,
            'isbn' => $this->isbn,
            'publisher' => $this->publisher,
            'publication_year' => $this->publication_year,
            'category_id' => $this->category_id,
            'cover' => $this->cover,
            'description' => $this->description,
            'total_copies' => $this->total_copies,
            'available_copies' => $this->available_copies,
            'location' => $this->location,
        ]);
    }

    // ── Update ──
    public function update(string $id): bool
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET
                title = :title, author = :author, isbn = :isbn, publisher = :publisher,
                publication_year = :publication_year, category_id = :category_id, cover = :cover,
                description = :description, total_copies = :total_copies, available_copies = :available_copies,
                location = :location, updated_at = NOW()
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'title' => $this->title,
            'author' => $this->author,
            'isbn' => $this->isbn,
            'publisher' => $this->publisher,
            'publication_year' => $this->publication_year,
            'category_id' => $this->category_id,
            'cover' => $this->cover,
            'description' => $this->description,
            'total_copies' => $this->total_copies,
            'available_copies' => $this->available_copies,
            'location' => $this->location,
        ]);
    }

    // ── Delete ──
    public function delete(string $id): bool
    {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // ── Update Available Copies ──
    public function updateAvailableCopies(string $id, int $delta): bool
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET available_copies = available_copies + :delta, updated_at = NOW() WHERE id = :id
        ");
        return $stmt->execute(['id' => $id, 'delta' => $delta]);
    }
}
