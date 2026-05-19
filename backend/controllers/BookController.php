<?php

require_once __DIR__ . '/../models/Book.php';

class BookController
{
    private Book $bookModel;

    public function __construct()
    {
        $this->bookModel = new Book();
    }

    // GET /api/books
    public function index(): void
    {
        $books = $this->bookModel->readAll();
        echo json_encode($books);
    }

    // GET /api/books/{id}
    public function show(string $id): void
    {
        $book = $this->bookModel->readById($id);
        if ($book) {
            echo json_encode($book);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Livre non trouvé']);
        }
    }

    // GET /api/books/search?q=...
    public function search(): void
    {
        $query = $_GET['q'] ?? '';
        if (empty($query)) {
            $this->index();
            return;
        }
        $books = $this->bookModel->search($query);
        echo json_encode($books);
    }

    // POST /api/books
    public function store(): void
    {
        // Handle both JSON and FormData
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            $data = $_POST;
        }

        $this->bookModel->title = $data['title'] ?? '';
        $this->bookModel->author = $data['author'] ?? '';
        $this->bookModel->isbn = $data['isbn'] ?? '';
        $this->bookModel->publisher = $data['publisher'] ?? '';
        $this->bookModel->publication_year = (int) ($data['publication_year'] ?? 0);
        $this->bookModel->category_id = $data['category_id'] ?? '';
        $this->bookModel->description = $data['description'] ?? '';
        $this->bookModel->total_copies = (int) ($data['total_copies'] ?? 0);
        $this->bookModel->available_copies = (int) ($data['available_copies'] ?? 0);
        $this->bookModel->location = $data['location'] ?? '';

        // Handle File Upload
        $this->bookModel->cover = $this->handleFileUpload() ?? ($data['cover'] ?? '');

        if ($this->bookModel->create()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $this->bookModel->id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de la création']);
        }
    }

    // PUT /api/books/{id}
    public function update(string $id): void
    {
        // Handle both JSON and FormData (Note: PUT with FormData is tricky in PHP, 
        // usually people use POST with _method=PUT or just stick to POST for uploads)
        // For simplicity, we'll allow updating via POST if it's an update.
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            $data = $_POST;
        }

        $this->bookModel->title = $data['title'] ?? '';
        $this->bookModel->author = $data['author'] ?? '';
        $this->bookModel->isbn = $data['isbn'] ?? '';
        $this->bookModel->publisher = $data['publisher'] ?? '';
        $this->bookModel->publication_year = (int) ($data['publication_year'] ?? 0);
        $this->bookModel->category_id = $data['category_id'] ?? '';
        $this->bookModel->description = $data['description'] ?? '';
        $this->bookModel->total_copies = (int) ($data['total_copies'] ?? 0);
        $this->bookModel->available_copies = (int) ($data['available_copies'] ?? 0);
        $this->bookModel->location = $data['location'] ?? '';

        $newCover = $this->handleFileUpload();
        if ($newCover) {
            $this->bookModel->cover = $newCover;
        } else {
            $this->bookModel->cover = $data['cover'] ?? '';
        }

        if ($this->bookModel->update($id)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de mise à jour']);
        }
    }

    private function handleFileUpload(): ?string
    {
        if (isset($_FILES['cover_file']) && $_FILES['cover_file']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/books/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileExtension = pathinfo($_FILES['cover_file']['name'], PATHINFO_EXTENSION);
            $fileName = uniqid('book_', true) . '.' . $fileExtension;
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['cover_file']['tmp_name'], $targetPath)) {
                return 'http://127.0.0.1:8000/uploads/books/' . $fileName;
            }
        }
        return null;
    }

    // DELETE /api/books/{id}
    public function destroy(string $id): void
    {
        if ($this->bookModel->delete($id)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de suppression']);
        }
    }
}
