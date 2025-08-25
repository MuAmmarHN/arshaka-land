package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Database connection
	db, err := sql.Open("mysql", "root:password@tcp(localhost:3306)/arshaka_db?charset=utf8mb4&parseTime=True&loc=Local")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Test connection
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	log.Println("Connected to database successfully")

	// Seed admin user
	seedAdminUser(db)
	
	// Seed sample data
	seedBanners(db)
	seedKegiatan(db)
	seedStruktur(db)
	seedQRCodes(db)

	log.Println("Database seeding completed successfully!")
}

func seedAdminUser(db *sql.DB) {
	// Check if admin user already exists
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM admin_user WHERE username = ?", "admin").Scan(&count)
	if err != nil {
		log.Printf("Error checking admin user: %v", err)
		return
	}

	if count > 0 {
		log.Println("Admin user already exists, skipping...")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return
	}

	// Insert admin user
	_, err = db.Exec("INSERT INTO admin_user (username, password_hash) VALUES (?, ?)", "admin", string(hashedPassword))
	if err != nil {
		log.Printf("Error inserting admin user: %v", err)
		return
	}

	log.Println("Admin user created successfully")
}

func seedBanners(db *sql.DB) {
	banners := []string{
		"/uploads/banner1.jpg",
		"/uploads/banner2.jpg",
		"/uploads/banner3.jpg",
	}

	for _, banner := range banners {
		_, err := db.Exec("INSERT IGNORE INTO banners (image_url) VALUES (?)", banner)
		if err != nil {
			log.Printf("Error inserting banner: %v", err)
		}
	}

	log.Println("Banners seeded successfully")
}

func seedKegiatan(db *sql.DB) {
	kegiatan := []struct {
		judul     string
		deskripsi string
		cover     string
		tanggal   string
	}{
		{
			"Gathering Mahasiswa",
			"Acara gathering untuk mempererat tali silaturahmi antar mahasiswa Arshaka Bimantara.",
			"/uploads/kegiatan1.jpg",
			"2024-01-15",
		},
		{
			"Workshop Programming",
			"Workshop programming untuk meningkatkan skill coding mahasiswa.",
			"/uploads/kegiatan2.jpg",
			"2024-02-20",
		},
		{
			"Seminar Teknologi",
			"Seminar tentang perkembangan teknologi terkini di industri.",
			"/uploads/kegiatan3.jpg",
			"2024-03-10",
		},
	}

	for _, k := range kegiatan {
		_, err := db.Exec("INSERT IGNORE INTO kegiatan (judul, deskripsi, cover, tanggal) VALUES (?, ?, ?, ?)",
			k.judul, k.deskripsi, k.cover, k.tanggal)
		if err != nil {
			log.Printf("Error inserting kegiatan: %v", err)
		}
	}

	log.Println("Kegiatan seeded successfully")
}

func seedStruktur(db *sql.DB) {
	struktur := []struct {
		nama     string
		jabatan  string
		prodi    string
		angkatan string
		fotoURL  string
	}{
		{"Ahmad Rizki", "Ketua", "Teknik Informatika", "2021", "/uploads/struktur1.jpg"},
		{"Siti Nurhaliza", "Wakil Ketua", "Sistem Informasi", "2021", "/uploads/struktur2.jpg"},
		{"Budi Santoso", "Sekretaris", "Teknik Informatika", "2022", "/uploads/struktur3.jpg"},
		{"Dewi Sartika", "Bendahara", "Sistem Informasi", "2022", "/uploads/struktur4.jpg"},
	}

	for _, s := range struktur {
		_, err := db.Exec("INSERT IGNORE INTO struktur (nama, jabatan, prodi, angkatan, foto_url) VALUES (?, ?, ?, ?, ?)",
			s.nama, s.jabatan, s.prodi, s.angkatan, s.fotoURL)
		if err != nil {
			log.Printf("Error inserting struktur: %v", err)
		}
	}

	log.Println("Struktur seeded successfully")
}

func seedQRCodes(db *sql.DB) {
	qrcodes := []struct {
		imageURL string
		enable   bool
	}{
		{"/uploads/qr1.jpg", true},
		{"/uploads/qr2.jpg", false},
	}

	for _, qr := range qrcodes {
		_, err := db.Exec("INSERT IGNORE INTO qr_code (image_url, enable) VALUES (?, ?)",
			qr.imageURL, qr.enable)
		if err != nil {
			log.Printf("Error inserting QR code: %v", err)
		}
	}

	log.Println("QR codes seeded successfully")
}
