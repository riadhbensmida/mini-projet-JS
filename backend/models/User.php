<?php

require_once __DIR__ . '/../config/Database.php';

class User
{
    protected PDO $conn;
    protected string $table = 'users';

    public ?string $id = null;
    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $phone = '';
    public string $role = 'member'; // 'admin' | 'member'
    public string $status = 'active'; // 'active' | 'inactive'
    public ?string $last_login = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    // ── Read All ──
    public function readAll(): array
    {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} ORDER BY created_at DESC");
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

    // ── Login ──
    public function login(string $email, string $password): ?array
    {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Update last login
            $updateStmt = $this->conn->prepare("UPDATE {$this->table} SET last_login = NOW() WHERE id = :id");
            $updateStmt->execute(['id' => $user['id']]);
            unset($user['password']); // Don't send password back
            return $user;
        }
        return null;
    }

    // ── Create ──
    public function create(): bool
    {
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} (id, name, email, password, phone, role, status, created_at, updated_at)
            VALUES (:id, :name, :email, :password, :phone, :role, :status, NOW(), NOW())
        ");
        $this->id = $this->id ?? uniqid('u_');
        return $stmt->execute([
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'password' => password_hash($this->password, PASSWORD_DEFAULT),
            'phone' => $this->phone,
            'role' => $this->role,
            'status' => $this->status,
        ]);
    }

    // ── Update Status ──
    public function updateStatus(string $id, string $status): bool
    {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET status = :status, updated_at = NOW() WHERE id = :id");
        return $stmt->execute(['id' => $id, 'status' => $status]);
    }

    // ── Delete ──
    public function delete(string $id): bool
    {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
