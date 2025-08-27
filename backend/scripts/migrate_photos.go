//go:build ignore
// +build ignore

package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// Database connection
	db, err := sql.Open("mysql", "arshaka_user:arshaka_pass@tcp(localhost:3306)/arshaka_db?charset=utf8mb4&parseTime=True&loc=Local")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Test connection
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	fmt.Println("Connected to database successfully")

	// Create kegiatan_photos table
	createTableSQL := `
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
	)`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatal("Error creating kegiatan_photos table:", err)
	}

	fmt.Println("kegiatan_photos table created successfully")

	// Insert sample photos
	photos := []struct {
		kegiatanID int
		photoURL   string
		caption    string
		sortOrder  int
	}{
		{1, "/uploads/kegiatan1_1.jpg", "Suasana gathering yang meriah", 1},
		{1, "/uploads/kegiatan1_2.jpg", "Para peserta sedang berdiskusi", 2},
		{1, "/uploads/kegiatan1_3.jpg", "Foto bersama seluruh peserta", 3},
		{2, "/uploads/kegiatan2_1.jpg", "Pembukaan workshop programming", 1},
		{2, "/uploads/kegiatan2_2.jpg", "Peserta sedang coding", 2},
		{2, "/uploads/kegiatan2_3.jpg", "Presentasi hasil workshop", 3},
		{2, "/uploads/kegiatan2_4.jpg", "Sesi tanya jawab", 4},
		{3, "/uploads/kegiatan3_1.jpg", "Pembicara seminar teknologi", 1},
		{3, "/uploads/kegiatan3_2.jpg", "Audiens yang antusias", 2},
	}

	for _, photo := range photos {
		_, err := db.Exec("INSERT IGNORE INTO kegiatan_photos (kegiatan_id, photo_url, caption, sort_order) VALUES (?, ?, ?, ?)",
			photo.kegiatanID, photo.photoURL, photo.caption, photo.sortOrder)
		if err != nil {
			log.Printf("Error inserting photo: %v", err)
		} else {
			fmt.Printf("Added photo: %s for kegiatan %d\n", photo.photoURL, photo.kegiatanID)
		}
	}

	fmt.Println("Sample photos added successfully")

	// Check results
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM kegiatan_photos").Scan(&count)
	if err != nil {
		log.Fatal("Error counting photos:", err)
	}

	fmt.Printf("Total photos in database: %d\n", count)
}
