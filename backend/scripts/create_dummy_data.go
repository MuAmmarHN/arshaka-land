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

	// Create dummy kegiatan
	kegiatanData := struct {
		judul     string
		deskripsi string
		cover     string
		tanggal   string
	}{
		judul: "Workshop Web Development 2024",
		deskripsi: `Workshop Web Development 2024 adalah acara pelatihan intensif yang dirancang khusus untuk mahasiswa dan profesional muda yang ingin menguasai teknologi web terkini.

Dalam workshop ini, peserta akan belajar:
• Frontend Development dengan React.js dan TypeScript
• Backend Development dengan Go dan MySQL
• UI/UX Design dengan Figma dan TailwindCSS
• Deployment dan DevOps dengan Docker

Workshop berlangsung selama 3 hari dengan kombinasi teori dan praktik langsung. Setiap peserta akan mendapatkan:
- Materi pembelajaran lengkap
- Source code project
- Sertifikat keikutsertaan
- Networking session dengan industry experts

Pembicara workshop adalah praktisi berpengalaman dari berbagai perusahaan teknologi terkemuka. Acara ini juga dilengkapi dengan sesi tanya jawab, networking lunch, dan demo project dari peserta.

Target peserta adalah mahasiswa tingkat akhir, fresh graduate, dan profesional yang ingin meningkatkan skill web development mereka.`,
		cover:   "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=500&fit=crop",
		tanggal: "2024-03-15",
	}

	// Insert kegiatan
	result, err := db.Exec("INSERT INTO kegiatan (judul, deskripsi, cover, tanggal) VALUES (?, ?, ?, ?)",
		kegiatanData.judul, kegiatanData.deskripsi, kegiatanData.cover, kegiatanData.tanggal)
	if err != nil {
		log.Fatal("Error inserting kegiatan:", err)
	}

	kegiatanID, err := result.LastInsertId()
	if err != nil {
		log.Fatal("Error getting kegiatan ID:", err)
	}

	fmt.Printf("Created kegiatan with ID: %d\n", kegiatanID)

	// Create multiple photos for this kegiatan
	photos := []struct {
		photoURL  string
		caption   string
		sortOrder int
	}{
		{
			photoURL:  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop",
			caption:   "Pembukaan workshop dengan sambutan dari ketua panitia",
			sortOrder: 1,
		},
		{
			photoURL:  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
			caption:   "Peserta workshop sedang fokus mengikuti materi frontend development",
			sortOrder: 2,
		},
		{
			photoURL:  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
			caption:   "Sesi hands-on coding dengan mentor yang berpengalaman",
			sortOrder: 3,
		},
		{
			photoURL:  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
			caption:   "Diskusi kelompok tentang best practices dalam web development",
			sortOrder: 4,
		},
		{
			photoURL:  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
			caption:   "Presentasi project akhir dari salah satu kelompok peserta",
			sortOrder: 5,
		},
		{
			photoURL:  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
			caption:   "Networking session dan sharing pengalaman dengan industry experts",
			sortOrder: 6,
		},
		{
			photoURL:  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
			caption:   "Demo aplikasi web yang dibuat peserta selama workshop",
			sortOrder: 7,
		},
		{
			photoURL:  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
			caption:   "Foto bersama seluruh peserta dan mentor di akhir acara",
			sortOrder: 8,
		},
	}

	// Insert photos
	for _, photo := range photos {
		_, err := db.Exec("INSERT INTO kegiatan_photos (kegiatan_id, photo_url, caption, sort_order) VALUES (?, ?, ?, ?)",
			kegiatanID, photo.photoURL, photo.caption, photo.sortOrder)
		if err != nil {
			log.Printf("Error inserting photo: %v", err)
		} else {
			fmt.Printf("Added photo: %s\n", photo.caption)
		}
	}

	fmt.Printf("Successfully created dummy kegiatan with %d photos\n", len(photos))

	// Show summary
	var totalKegiatan, totalPhotos int
	db.QueryRow("SELECT COUNT(*) FROM kegiatan").Scan(&totalKegiatan)
	db.QueryRow("SELECT COUNT(*) FROM kegiatan_photos").Scan(&totalPhotos)

	fmt.Printf("\nDatabase Summary:\n")
	fmt.Printf("Total Kegiatan: %d\n", totalKegiatan)
	fmt.Printf("Total Photos: %d\n", totalPhotos)
}
