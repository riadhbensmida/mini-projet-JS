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
        $data = json_decode(file_get_contents('php://input'), true);

        $this->bookModel->title = $data['title'] ?? '';
        $this->bookModel->author = $data['author'] ?? '';
        $this->bookModel->isbn = $data['isbn'] ?? '';
        $this->bookModel->publisher = $data['publisher'] ?? '';
        $this->bookModel->publication_year = (int) ($data['publication_year'] ?? 0);
        $this->bookModel->category_id = $data['category_id'] ?? '';
        $this->bookModel->cover = $data['cover'] ?? '';
        $this->bookModel->description = $data['description'] ?? '';
        $this->bookModel->total_copies = (int) ($data['total_copies'] ?? 0);
        $this->bookModel->available_copies = (int) ($data['available_copies'] ?? 0);
        $this->bookModel->location = $data['location'] ?? '';

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
        $data = json_decode(file_get_contents('php://input'), true);

        $this->bookModel->title = $data['title'] ?? '';
        $this->bookModel->author = $data['author'] ?? '';
        $this->bookModel->isbn = $data['isbn'] ?? '';
        $this->bookModel->publisher = $data['publisher'] ?? '';
        $this->bookModel->publication_year = (int) ($data['publication_year'] ?? 0);
        $this->bookModel->category_id = $data['category_id'] ?? '';
        $this->bookModel->cover = $data['cover'] ?? '';
        $this->bookModel->description = $data['description'] ?? '';
        $this->bookModel->total_copies = (int) ($data['total_copies'] ?? 0);
        $this->bookModel->available_copies = (int) ($data['available_copies'] ?? 0);
        $this->bookModel->location = $data['location'] ?? '';

        if ($this->bookModel->update($id)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de mise à jour']);
        }
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
