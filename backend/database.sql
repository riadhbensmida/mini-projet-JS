-- BiblioNet Database Schema
CREATE DATABASE IF NOT EXISTS biblionet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE biblionet;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'member') DEFAULT 'member',
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login DATETIME,
    employee_id VARCHAR(50),      -- For admins
    department VARCHAR(100),      -- For admins
    permissions TEXT,             -- JSON string for admins
    access_level INT DEFAULT 1,   -- For admins
    member_number VARCHAR(50),    -- For members
    max_loans INT DEFAULT 3,      -- For members
    birth_date DATE,              -- For members
    address TEXT,                 -- For members
    city VARCHAR(100),            -- For members
    postal_code VARCHAR(20),      -- For members
    membership_expiry DATETIME,   -- For members
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    parent_id VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    publisher VARCHAR(100),
    publication_year INT,
    category_id VARCHAR(50),
    cover VARCHAR(255),
    description TEXT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    location VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Loans Table
CREATE TABLE IF NOT EXISTS loans (
    id VARCHAR(50) PRIMARY KEY,
    book_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    return_date DATETIME,
    penalty_amount DECIMAL(10, 2) DEFAULT 0,
    penalty_paid BOOLEAN DEFAULT 1,
    payment_date DATETIME,
    status ENUM('active', 'returned', 'overdue') DEFAULT 'active',
    notes TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(50) PRIMARY KEY,
    book_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATETIME NOT NULL,
    status ENUM('pending', 'notified', 'converted', 'cancelled', 'expired') DEFAULT 'pending',
    notified BOOLEAN DEFAULT 0,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Categories
INSERT INTO categories (id, name, description, icon, color) VALUES
('c1', 'Roman', 'Œuvres de fiction en prose', 'book', '#3b82f6'),
('c3', 'Histoire', 'Ouvrages historiques', 'landmark', '#d97706'),
('c4', 'Philosophie', 'Réflexions et essais', 'brain', '#10b981'),
('c5', 'Sciences', 'Mathématiques, physique, biologie', 'flask-conical', '#06b6d4'),
('c6', 'Jeunesse', 'Livres pour enfants et adolescents', 'baby', '#ec4899'),
('c7', 'Bande Dessinée', 'Romans graphiques et BD', 'image', '#f59e0b'),
('c8', 'Poésie', 'Recueils de poèmes', 'feather', '#6366f1');

INSERT INTO categories (id, name, description, icon, color, parent_id) VALUES
('c2', 'Science-Fiction', 'Anticipation et mondes futurs', 'rocket', '#8b5cf6', 'c1');

-- Seed Users (Password is 'admin' or 'membre' or 'password' hashed)
-- Use: password_hash('admin', PASSWORD_DEFAULT) => '$2y$10$7zRkQ4q9f.o4T9C0vF7mue.n.j5hXzB.z9fR.X0uP.X0uP.X0uP' (example)
-- For simplicity in the seed, I'll use a known hash for 'password' or just provide the admin/member one
INSERT INTO users (id, name, email, password, role, status, employee_id, department, access_level) VALUES
('a1', 'Sophie Martin', 'admin@biblinet.fr', '$2y$10$AMCPuZqZkjhzJMyDP5KJMO9mYxfFinIFYPb9.SV7f89O299zMxWTom', 'admin', 'active', 'EMP001', 'Direction', 5);

INSERT INTO users (id, name, email, password, role, status, member_number, max_loans, city) VALUES
('m1', 'Jean Dupont', 'membre@biblinet.fr', '$2y$10$rXdBl0pQoBg2iYNlGXqLVeEaAQYpG0GWiTW4XGb3ONM20APEC1hoya', 'member', 'active', 'MEM001', 3, 'Paris');

-- Seed Books
INSERT INTO books (id, title, author, isbn, publisher, publication_year, category_id, cover, description, total_copies, available_copies, location) VALUES
('b1', 'Les Misérables', 'Victor Hugo', '978-2070409228', 'Gallimard', 1862, 'c1', 'https://picsum.photos/seed/miserables/300/450', 'L\'histoire de Jean Valjean...', 5, 3, 'A1-E2'),
('b2', 'L\'Étranger', 'Albert Camus', '978-2070360024', 'Gallimard', 1942, 'c4', 'https://picsum.photos/seed/etranger/300/450', 'Meursault, un employé de bureau...', 4, 0, 'B3-E1'),
('b4', 'Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2070612758', 'Gallimard', 1943, 'c6', 'https://picsum.photos/seed/prince/300/450', 'Un aviateur tombé dans le désert...', 8, 5, 'J1-E1'),
('b5', 'Dune', 'Frank Herbert', '978-2266320481', 'Pocket', 1965, 'c2', 'https://picsum.photos/seed/dune/300/450', 'Sur la planète désertique Arrakis...', 3, 1, 'SF-E4');
