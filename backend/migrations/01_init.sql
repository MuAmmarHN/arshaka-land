-- Create database if not exists
CREATE DATABASE IF NOT EXISTS arshaka_db;
USE arshaka_db;

-- Table: admin_user
CREATE TABLE admin_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: banners
CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: kegiatan
CREATE TABLE kegiatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    cover VARCHAR(255),
    tanggal DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: kegiatan_foto
CREATE TABLE kegiatan_foto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kegiatan_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kegiatan_id) REFERENCES kegiatan(id) ON DELETE CASCADE
);

-- Table: struktur
CREATE TABLE struktur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    prodi VARCHAR(100),
    angkatan VARCHAR(10),
    foto_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: qr_code
CREATE TABLE qr_code (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    enable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admin_user (username, password_hash) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample data for testing
INSERT INTO banners (image_url) VALUES
('/uploads/banner1.jpg'),
('/uploads/banner2.jpg'),
('/uploads/banner3.jpg');

INSERT INTO kegiatan (judul, deskripsi, cover, tanggal) VALUES
('Seminar Teknologi 2024', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '/uploads/kegiatan1.jpg', '2024-03-15'),
('Workshop Programming', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', '/uploads/kegiatan2.jpg', '2024-03-20'),
('Gathering Mahasiswa', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', '/uploads/kegiatan3.jpg', '2024-03-25');

INSERT INTO kegiatan_foto (kegiatan_id, image_url) VALUES
(1, '/uploads/kegiatan1_1.jpg'),
(1, '/uploads/kegiatan1_2.jpg'),
(2, '/uploads/kegiatan2_1.jpg'),
(2, '/uploads/kegiatan2_2.jpg'),
(3, '/uploads/kegiatan3_1.jpg');

INSERT INTO struktur (nama, jabatan, prodi, angkatan, foto_url) VALUES
('Ahmad Budi', 'Ketua', 'Teknik Informatika', '2021', '/uploads/struktur1.jpg'),
('Siti Nurhaliza', 'Wakil Ketua', 'Sistem Informasi', '2021', '/uploads/struktur2.jpg'),
('Rizky Pratama', 'Sekretaris', 'Teknik Informatika', '2022', '/uploads/struktur3.jpg'),
('Maya Sari', 'Bendahara', 'Sistem Informasi', '2022', '/uploads/struktur4.jpg');

INSERT INTO qr_code (image_url, enable) VALUES
('/uploads/qr1.png', TRUE),
('/uploads/qr2.png', FALSE);
