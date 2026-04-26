<?php

require_once __DIR__ . '/../models/Category.php';

class CategoryController
{
    private Category $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new Category();
    }

    // GET /api/categories
    public function index(): void
    {
        $categories = $this->categoryModel->readAll();
        echo json_encode($categories);
    }

    // GET /api/categories/{id}
    public function show(string $id): void
    {
        $category = $this->categoryModel->readById($id);
        if ($category) {
            echo json_encode($category);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Catégorie non trouvée']);
        }
    }

    // POST /api/categories
    public function store(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $this->categoryModel->name = $data['name'] ?? '';
        $this->categoryModel->description = $data['description'] ?? '';
        $this->categoryModel->icon = $data['icon'] ?? '';
        $this->categoryModel->color = $data['color'] ?? '';
        $this->categoryModel->parent_id = $data['parent_id'] ?? null;

        if ($this->categoryModel->create()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $this->categoryModel->id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de la création']);
        }
    }

    // PUT /api/categories/{id}
    public function update(string $id): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $this->categoryModel->name = $data['name'] ?? '';
        $this->categoryModel->description = $data['description'] ?? '';
        $this->categoryModel->icon = $data['icon'] ?? '';
        $this->categoryModel->color = $data['color'] ?? '';
        $this->categoryModel->parent_id = $data['parent_id'] ?? null;

        if ($this->categoryModel->update($id)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de mise à jour']);
        }
    }

    // DELETE /api/categories/{id}
    public function destroy(string $id): void
    {
        if ($this->categoryModel->delete($id)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de suppression']);
        }
    }
}
