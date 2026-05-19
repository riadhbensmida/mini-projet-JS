<?php

require_once __DIR__ . '/../models/User.php';

class AuthController
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    // POST /api/auth/login
    public function login(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email et mot de passe requis']);
            return;
        }

        $user = $this->userModel->login($data['email'], $data['password']);

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Email ou mot de passe incorrect']);
            return;
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];

        unset($user['password']);

        echo json_encode($user);
    }

    // POST /api/auth/logout
    public function logout(): void
    {
        $_SESSION = [];
        session_destroy();

        echo json_encode(['success' => true]);
    }

    // GET /api/auth/me
    public function me(): void
    {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Non authentifié']);
            return;
        }

        $user = $this->userModel->readById($_SESSION['user_id']);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'Utilisateur introuvable']);
            return;
        }

        unset($user['password']);

        echo json_encode($user);
    }

    // POST /api/auth/register
    public function register(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nom, email et mot de passe requis']);
            return;
        }

        $this->userModel->name = $data['name'];
        $this->userModel->email = $data['email'];
        $this->userModel->password = $data['password'];
        $this->userModel->role = 'member';
        $this->userModel->status = 'active';

        if (!$this->userModel->create()) {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de l\'inscription']);
            return;
        }

        $user = $this->userModel->readById($this->userModel->id);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];

        unset($user['password']);

        echo json_encode($user);
    }
}