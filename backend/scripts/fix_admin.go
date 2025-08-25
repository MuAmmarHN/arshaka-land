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

	// Delete existing admin user
	_, err = db.Exec("DELETE FROM admin_user WHERE username = ?", "admin")
	if err != nil {
		log.Fatal("Error deleting admin user:", err)
	}
	fmt.Println("Deleted existing admin user")

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Error hashing password:", err)
	}

	// Insert new admin user
	_, err = db.Exec("INSERT INTO admin_user (username, password_hash) VALUES (?, ?)", "admin", string(hashedPassword))
	if err != nil {
		log.Fatal("Error inserting admin user:", err)
	}

	fmt.Println("Created new admin user successfully")

	// Verify the new user
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
		fmt.Println("Password verification SUCCESS!")
	}
}
