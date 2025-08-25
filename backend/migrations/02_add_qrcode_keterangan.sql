-- Migration: Add keterangan field to qr_code table
-- Date: 2024-12-19

ALTER TABLE qr_code ADD COLUMN keterangan TEXT AFTER image_url;

-- Update existing QR codes with sample descriptions
UPDATE qr_code SET keterangan = 'QR Code untuk akses website utama' WHERE id = 1;
UPDATE qr_code SET keterangan = 'QR Code untuk kontak dan informasi' WHERE id = 2;
