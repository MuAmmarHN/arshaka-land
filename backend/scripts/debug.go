//go:build ignore
// +build ignore

package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
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

	// Check admin user
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM admin_user WHERE username = ?", "admin").Scan(&count)
	if err != nil {
		log.Fatal("Error checking admin user:", err)
	}

	fmt.Printf("Admin users found: %d\n", count)

	if count > 0 {
		var username, passwordHash string
		err = db.QueryRow("SELECT username, password_hash FROM admin_user WHERE username = ?", "admin").Scan(&username, &passwordHash)
		if err != nil {
			log.Fatal("Error getting admin user:", err)
		}

		fmt.Printf("Username: %s\n", username)
		fmt.Printf("Password hash: %s\n", passwordHash)

		// Test password verification
		err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte("admin123"))
		if err != nil {
			fmt.Printf("Password verification FAILED: %v\n", err)
		} else {
			fmt.Println("Password verification SUCCESS")
		}
	} else {
		fmt.Println("No admin user found!")
	}
}
