-- Create pembina table
CREATE TABLE IF NOT EXISTS pembina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    nip VARCHAR(50),
    foto_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add constraint to limit maximum 2 pembina
-- This will be enforced in application logic since MySQL doesn't support this directly
