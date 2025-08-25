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

	// Disable all QR codes
	result, err := db.Exec("UPDATE qr_code SET enable = false")
	if err != nil {
		log.Fatal("Error disabling QR codes:", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Fatal("Error getting rows affected:", err)
	}

	fmt.Printf("Successfully disabled %d QR codes\n", rowsAffected)

	// Check current status
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM qr_code WHERE enable = true").Scan(&count)
	if err != nil {
		log.Fatal("Error checking enabled QR codes:", err)
	}

	fmt.Printf("Enabled QR codes remaining: %d\n", count)
}
