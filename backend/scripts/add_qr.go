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

	// Add more QR codes
	qrcodes := []struct {
		imageURL string
		enable   bool
	}{
		{"/uploads/qr2.jpg", true},
		{"/uploads/qr3.jpg", false},
	}

	for _, qr := range qrcodes {
		_, err := db.Exec("INSERT INTO qr_code (image_url, enable) VALUES (?, ?)",
			qr.imageURL, qr.enable)
		if err != nil {
			log.Printf("Error inserting QR code: %v", err)
		} else {
			fmt.Printf("Added QR code: %s (enabled: %t)\n", qr.imageURL, qr.enable)
		}
	}

	// Check current status
	var total, enabled int
	err = db.QueryRow("SELECT COUNT(*) FROM qr_code").Scan(&total)
	if err != nil {
		log.Fatal("Error checking total QR codes:", err)
	}

	err = db.QueryRow("SELECT COUNT(*) FROM qr_code WHERE enable = true").Scan(&enabled)
	if err != nil {
		log.Fatal("Error checking enabled QR codes:", err)
	}

	fmt.Printf("Total QR codes: %d, Enabled: %d\n", total, enabled)
}
