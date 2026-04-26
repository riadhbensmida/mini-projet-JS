<?php

require_once __DIR__ . '/../models/User.php';

class UserController
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    // GET /api/users
    public function index(): void
    {
        $users = $this->userModel->readAll();
        // Remove passwords from response
        $users = array_map(function ($u) {
            unset($u['password']);
            return $u;
        }, $users);
        echo json_encode($users);
    }

    // GET /api/users/{id}
    public function show(string $id): void
    {
        $user = $this->userModel->readById($id);
        if ($user) {
            unset($user['password']);
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Utilisateur non trouvé']);
        }
    }

    // POST /api/users
    public function store(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $this->userModel->name = $data['name'] ?? '';
        $this->userModel->email = $data['email'] ?? '';
        $this->userModel->password = $data['password'] ?? '';
        $this->userModel->phone = $data['phone'] ?? '';
        $this->userModel->role = $data['role'] ?? 'member';
        $this->userModel->status = $data['status'] ?? 'active';

        if ($this->userModel->create()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $this->userModel->id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de la création']);
        }
    }

    // PATCH /api/users/{id}/status
    public function updateStatus(string $id): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $status = $data['status'] ?? '';

        if (!in_array($status, ['active', 'inactive'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Statut invalide']);
            return;
        }

        if ($this->userModel->updateStatus($id, $status)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de mise à jour']);
        }
    }

    // DELETE /api/users/{id}
    public function destroy(string $id): void
    {
        if ($this->userModel->delete($id)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de suppression']);
        }
    }
}
