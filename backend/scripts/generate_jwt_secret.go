//go:build ignore
// +build ignore

package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
)

func main() {
	// Generate 64 bytes (512 bits) of random data
	bytes := make([]byte, 64)
	_, err := rand.Read(bytes)
	if err != nil {
		log.Fatal("Error generating random bytes:", err)
	}

	// Encode to base64 for use as JWT secret
	secret := base64.URLEncoding.EncodeToString(bytes)

	fmt.Println("=== GENERATED JWT SECRET ===")
	fmt.Println("Copy this secret to your .env file:")
	fmt.Println()
	fmt.Printf("JWT_SECRET=%s\n", secret)
	fmt.Println()
	fmt.Println("⚠️  IMPORTANT: Keep this secret safe and never commit it to version control!")
	fmt.Println("⚠️  Use different secrets for development, staging, and production!")
}
