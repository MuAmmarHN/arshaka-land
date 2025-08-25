package main

import (
	"arshaka-backend/pkg/database"
	"bufio"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"
	"syscall"

	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/term"
)

func main() {
	fmt.Println("=== CHANGE ADMIN PASSWORD ===")
	fmt.Println()

	// Database connection
	dbConfig := database.GetConfigFromEnv()
	db, err := database.NewMySQLConnection(dbConfig)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Get current admin username
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Enter admin username (default: admin): ")
	username, _ := reader.ReadString('\n')
	username = strings.TrimSpace(username)
	if username == "" {
		username = "admin"
	}

	// Check if admin exists
	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM admin_user WHERE username = ?)", username).Scan(&exists)
	if err != nil {
		log.Fatal("Error checking admin user:", err)
	}

	if !exists {
		log.Fatalf("Admin user '%s' not found!", username)
	}

	// Get new password
	fmt.Print("Enter new password: ")
	passwordBytes, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		log.Fatal("Error reading password:", err)
	}
	password := string(passwordBytes)
	fmt.Println()

	if len(password) < 8 {
		log.Fatal("Password must be at least 8 characters long!")
	}

	// Confirm password
	fmt.Print("Confirm new password: ")
	confirmBytes, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		log.Fatal("Error reading password confirmation:", err)
	}
	confirm := string(confirmBytes)
	fmt.Println()

	if password != confirm {
		log.Fatal("Passwords do not match!")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Error hashing password:", err)
	}

	// Update password
	_, err = db.Exec("UPDATE admin_user SET password_hash = ? WHERE username = ?", string(hashedPassword), username)
	if err != nil {
		log.Fatal("Error updating password:", err)
	}

	fmt.Printf("✅ Password for admin user '%s' has been updated successfully!\n", username)
	fmt.Println("⚠️  Make sure to update your login credentials.")
}
