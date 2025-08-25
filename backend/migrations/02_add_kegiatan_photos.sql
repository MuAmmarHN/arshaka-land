-- Add kegiatan_photos table for multiple photos per kegiatan
CREATE TABLE IF NOT EXISTS kegiatan_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kegiatan_id INT NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    caption TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kegiatan_id) REFERENCES kegiatan(id) ON DELETE CASCADE,
    INDEX idx_kegiatan_id (kegiatan_id),
    INDEX idx_sort_order (sort_order)
);

-- Insert some sample photos for existing kegiatan
INSERT INTO kegiatan_photos (kegiatan_id, photo_url, caption, sort_order) VALUES
(1, '/uploads/kegiatan1_1.jpg', 'Suasana gathering yang meriah', 1),
(1, '/uploads/kegiatan1_2.jpg', 'Para peserta sedang berdiskusi', 2),
(1, '/uploads/kegiatan1_3.jpg', 'Foto bersama seluruh peserta', 3),
(2, '/uploads/kegiatan2_1.jpg', 'Pembukaan workshop programming', 1),
(2, '/uploads/kegiatan2_2.jpg', 'Peserta sedang coding', 2),
(2, '/uploads/kegiatan2_3.jpg', 'Presentasi hasil workshop', 3),
(2, '/uploads/kegiatan2_4.jpg', 'Sesi tanya jawab', 4),
(3, '/uploads/kegiatan3_1.jpg', 'Pembicara seminar teknologi', 1),
(3, '/uploads/kegiatan3_2.jpg', 'Audiens yang antusias', 2);
