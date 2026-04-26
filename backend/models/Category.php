<?php

require_once __DIR__ . '/../config/Database.php';

class Category
{
    private PDO $conn;
    private string $table = 'categories';

    public ?string $id = null;
    public string $name = '';
    public string $description = '';
    public string $icon = '';
    public string $color = '';
    public ?string $parent_id = null;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    // ── Read All ──
    public function readAll(): array
    {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} ORDER BY name ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ── Read By ID ──
    public function readById(string $id): ?array
    {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    // ── Create ──
    public function create(): bool
    {
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} (id, name, description, icon, color, parent_id, created_at)
            VALUES (:id, :name, :description, :icon, :color, :parent_id, NOW())
        ");
        $this->id = $this->id ?? uniqid('c_');
        return $stmt->execute([
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'icon' => $this->icon,
            'color' => $this->color,
            'parent_id' => $this->parent_id,
        ]);
    }

    // ── Update ──
    public function update(string $id): bool
    {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET
                name = :name, description = :description, icon = :icon, 
                color = :color, parent_id = :parent_id
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'name' => $this->name,
            'description' => $this->description,
            'icon' => $this->icon,
            'color' => $this->color,
            'parent_id' => $this->parent_id,
        ]);
    }

    // ── Delete ──
    public function delete(string $id): bool
    {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
