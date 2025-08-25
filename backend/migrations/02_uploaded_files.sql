-- Migration untuk tabel uploaded_files
-- Tabel ini akan menyimpan semua file yang diupload secara otomatis

USE arshaka_db;

-- Tabel untuk tracking semua uploaded files
CREATE TABLE IF NOT EXISTS uploaded_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by VARCHAR(100) DEFAULT 'admin',
    upload_context VARCHAR(100) DEFAULT 'general', -- banner, struktur, kegiatan, qrcode, etc
    is_used BOOLEAN DEFAULT FALSE, -- apakah file sudah digunakan di entitas lain
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_filename (filename),
    INDEX idx_upload_context (upload_context),
    INDEX idx_is_used (is_used),
    INDEX idx_created_at (created_at)
);

-- Tabel untuk relasi file dengan entitas (opsional, untuk tracking penggunaan)
CREATE TABLE IF NOT EXISTS file_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uploaded_file_id INT NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- banner, struktur, kegiatan, qrcode
    entity_id INT NOT NULL,
    field_name VARCHAR(50) NOT NULL, -- foto_url, image_url, cover, etc
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploaded_file_id) REFERENCES uploaded_files(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usage (uploaded_file_id, entity_type, entity_id, field_name),
    INDEX idx_entity (entity_type, entity_id)
);
