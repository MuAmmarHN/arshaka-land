package main

import (
	httpHandler "arshaka-backend/internal/delivery/http"
	"arshaka-backend/internal/repository/mysql"
	"arshaka-backend/internal/usecase"
	"arshaka-backend/pkg/database"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Database connection
	dbConfig := database.GetConfigFromEnv()
	db, err := database.NewMySQLConnection(dbConfig)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Initialize repositories
	adminRepo := mysql.NewAdminRepository(db)
	bannerRepo := mysql.NewBannerRepository(db)
	kegiatanRepo := mysql.NewKegiatanRepository(db)
	kegiatanPhotoRepo := mysql.NewKegiatanPhotoRepository(db)
	strukturRepo := mysql.NewStrukturRepository(db)
	pembinaRepo := mysql.NewPembinaRepository(db)
	qrcodeRepo := mysql.NewQRCodeRepository(db)

	// Initialize usecases
	authUsecase := usecase.NewAuthUsecase(adminRepo)
	bannerUsecase := usecase.NewBannerUsecase(bannerRepo)
	kegiatanUsecase := usecase.NewKegiatanUsecase(kegiatanRepo)
	kegiatanPhotoUsecase := usecase.NewKegiatanPhotoUsecase(kegiatanPhotoRepo)
	strukturUsecase := usecase.NewStrukturUsecase(strukturRepo)
	pembinaUsecase := usecase.NewPembinaUsecase(pembinaRepo)
	qrcodeUsecase := usecase.NewQRCodeUsecase(qrcodeRepo)

	// Initialize handlers
	authHandler := httpHandler.NewAuthHandler(authUsecase)
	bannerHandler := httpHandler.NewBannerHandler(bannerUsecase)
	kegiatanHandler := httpHandler.NewKegiatanHandler(kegiatanUsecase)
	kegiatanPhotoHandler := httpHandler.NewKegiatanPhotoHandler(kegiatanPhotoUsecase)
	strukturHandler := httpHandler.NewStrukturHandler(strukturUsecase)
	pembinaHandler := httpHandler.NewPembinaHandler(pembinaUsecase)
	qrcodeHandler := httpHandler.NewQRCodeHandler(qrcodeUsecase)
	uploadHandler := httpHandler.NewUploadHandler()

	// Setup routes
	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()

	// Auth routes (public)
	api.HandleFunc("/admin/login", authHandler.Login).Methods("POST")

	// Public routes
	api.HandleFunc("/banners", bannerHandler.GetAll).Methods("GET")
	api.HandleFunc("/kegiatan", kegiatanHandler.GetAll).Methods("GET")
	api.HandleFunc("/kegiatan/{id}", kegiatanHandler.GetByID).Methods("GET")
	api.HandleFunc("/kegiatan/{kegiatan_id}/photos", kegiatanPhotoHandler.GetByKegiatanID).Methods("GET")
	api.HandleFunc("/struktur", strukturHandler.GetAll).Methods("GET")
	api.HandleFunc("/pembina", pembinaHandler.GetAll).Methods("GET")
	api.HandleFunc("/qrcode/enabled", qrcodeHandler.GetEnabled).Methods("GET")

	// Protected admin routes
	adminAPI := api.PathPrefix("/admin").Subrouter()
	adminAPI.Use(httpHandler.JWTMiddleware)

	// Banner admin routes
	adminAPI.HandleFunc("/banners", bannerHandler.GetAll).Methods("GET")
	adminAPI.HandleFunc("/banners/{id}", bannerHandler.GetByID).Methods("GET")
	adminAPI.HandleFunc("/banners", bannerHandler.Create).Methods("POST")
	adminAPI.HandleFunc("/banners/{id}", bannerHandler.Update).Methods("PUT")
	adminAPI.HandleFunc("/banners/{id}", bannerHandler.Delete).Methods("DELETE")

	// Kegiatan admin routes
	adminAPI.HandleFunc("/kegiatan", kegiatanHandler.GetAll).Methods("GET")
	adminAPI.HandleFunc("/kegiatan/{id}", kegiatanHandler.GetByID).Methods("GET")
	adminAPI.HandleFunc("/kegiatan", kegiatanHandler.Create).Methods("POST")
	adminAPI.HandleFunc("/kegiatan/{id}", kegiatanHandler.Update).Methods("PUT")
	adminAPI.HandleFunc("/kegiatan/{id}", kegiatanHandler.Delete).Methods("DELETE")

	// Struktur admin routes
	adminAPI.HandleFunc("/struktur", strukturHandler.GetAll).Methods("GET")
	adminAPI.HandleFunc("/struktur/{id}", strukturHandler.GetByID).Methods("GET")
	adminAPI.HandleFunc("/struktur", strukturHandler.Create).Methods("POST")
	adminAPI.HandleFunc("/struktur/{id}", strukturHandler.Update).Methods("PUT")
	adminAPI.HandleFunc("/struktur/{id}", strukturHandler.Delete).Methods("DELETE")

	// Pembina admin routes
	adminAPI.HandleFunc("/pembina", pembinaHandler.GetAll).Methods("GET")
	adminAPI.HandleFunc("/pembina/{id}", pembinaHandler.GetByID).Methods("GET")
	adminAPI.HandleFunc("/pembina", pembinaHandler.Create).Methods("POST")
	adminAPI.HandleFunc("/pembina/{id}", pembinaHandler.Update).Methods("PUT")
	adminAPI.HandleFunc("/pembina/{id}", pembinaHandler.Delete).Methods("DELETE")

	// QR Code admin routes
	adminAPI.HandleFunc("/qrcode", qrcodeHandler.GetAll).Methods("GET")
	adminAPI.HandleFunc("/qrcode/{id}", qrcodeHandler.GetByID).Methods("GET")
	adminAPI.HandleFunc("/qrcode", qrcodeHandler.Create).Methods("POST")
	adminAPI.HandleFunc("/qrcode/{id}", qrcodeHandler.Update).Methods("PUT")
	adminAPI.HandleFunc("/qrcode/{id}", qrcodeHandler.Delete).Methods("DELETE")
	adminAPI.HandleFunc("/qrcode/{id}/toggle", qrcodeHandler.ToggleEnable).Methods("PUT")

	// Kegiatan Photos admin routes
	adminAPI.HandleFunc("/kegiatan/{kegiatan_id}/photos", kegiatanPhotoHandler.Create).Methods("POST")
	adminAPI.HandleFunc("/photos/{photo_id}", kegiatanPhotoHandler.Update).Methods("PUT")
	adminAPI.HandleFunc("/photos/{photo_id}", kegiatanPhotoHandler.Delete).Methods("DELETE")
	adminAPI.HandleFunc("/photos/sort-order", kegiatanPhotoHandler.UpdateSortOrder).Methods("PUT")

	// Upload routes (protected)
	adminAPI.HandleFunc("/upload/image", uploadHandler.UploadImage).Methods("POST")
	adminAPI.HandleFunc("/upload/images", uploadHandler.UploadMultipleImages).Methods("POST")

	// Static file serving for uploads
	router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads/"))))

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
