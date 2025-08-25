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

	// Enable first QR code
	result, err := db.Exec("UPDATE qr_code SET enable = true WHERE id = (SELECT id FROM (SELECT id FROM qr_code ORDER BY id LIMIT 1) AS temp)")
	if err != nil {
		log.Fatal("Error enabling QR code:", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Fatal("Error getting rows affected:", err)
	}

	fmt.Printf("Successfully enabled %d QR code\n", rowsAffected)

	// Check current status
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM qr_code WHERE enable = true").Scan(&count)
	if err != nil {
		log.Fatal("Error checking enabled QR codes:", err)
	}

	fmt.Printf("Enabled QR codes: %d\n", count)
}
