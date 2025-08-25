# 📚 Tutorial Arshaka Bimantara Website

Panduan lengkap untuk setup, development, dan penggunaan website Arshaka Bimantara.

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (Recommended)
- **Git**
- **Node.js 18+** (untuk development)
- **Go 1.21+** (untuk development)

### 1. Clone Repository
```bash
git clone https://github.com/MuAmmarHN/arshaka-land.git
cd arshaka-land
```

### 2. Jalankan dengan Docker
```bash
# Build dan jalankan semua services
docker-compose up -d

# Cek status containers
docker-compose ps
```

### 3. Setup Database
```bash
# Buat tabel pembina
docker exec -i arshaka_mysql mysql -u root -prootpassword arshaka_db -e "CREATE TABLE IF NOT EXISTS pembina (id INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(100) NOT NULL, jabatan VARCHAR(100) NOT NULL, nip VARCHAR(50), foto_url VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);"

# Verifikasi tabel
docker exec -i arshaka_mysql mysql -u root -prootpassword arshaka_db -e "SHOW TABLES;"
```

### 4. Akses Aplikasi
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:8080

## 🔐 Login Admin
- **Username**: `admin`
- **Password**: `admin123`

## 📖 Fitur Utama

### 🏠 Homepage
- **Banner Carousel** - Slideshow gambar utama
- **Sejarah Organisasi** - Informasi tentang Arshaka Bimantara
- **Kegiatan** - Galeri kegiatan dengan detail foto
- **Pembina Arshaka Bimantara** - Maksimal 2 pembina
- **Struktur Arshaka Bimantara** - Anggota organisasi
- **QR Code** - Untuk akses cepat

### 👨‍💼 Admin Panel

#### **Dashboard** (`/admin`)
- Overview statistik semua data
- Quick access ke semua management pages

#### **Banner Management** (`/admin/banner`)
- Upload/hapus banner untuk homepage
- Support multiple images

#### **Kegiatan Management** (`/admin/kegiatan`)
- CRUD kegiatan organisasi
- Upload multiple photos per kegiatan
- Rich text description

#### **Struktur & Pembina** (`/admin/struktur`)
- **Tab Struktur**: Manage anggota organisasi (unlimited)
  - Fields: Nama, Jabatan, Prodi, Angkatan, NRA, Foto
- **Tab Pembina**: Manage pembina organisasi (maksimal 2)
  - Fields: Nama, Jabatan, NIP, Foto

#### **QR Code Management** (`/admin/qrcode`)
- Upload QR codes
- Enable/disable QR codes
- Add descriptions

## 🛠️ Development

### Backend Development
```bash
cd backend

# Install dependencies
go mod download

# Run development server
go run cmd/main.go

# Build binary
go build -o main cmd/main.go
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

## 🗄️ Database

### Connection Details
- **Host**: localhost:3306 (Docker)
- **Database**: arshaka_db
- **User**: arshaka_user
- **Password**: arshaka_pass
- **Root Password**: rootpassword

### Tables
- `admin_user` - Admin authentication
- `banners` - Homepage banners
- `kegiatan` - Organization activities
- `kegiatan_photos` - Activity photos
- `struktur` - Organization structure
- `pembina` - Organization advisors (max 2)
- `qr_code` - QR codes

### Migrations
```bash
# Manual migration (jika diperlukan)
docker exec -i arshaka_mysql mysql -u root -prootpassword arshaka_db < backend/migrations/01_init.sql
```

## 🔧 Configuration

### Environment Variables
Copy dan edit file environment:
```bash
cp backend/.env.example backend/.env
```

### Docker Services
- **Frontend**: Port 3000 (React)
- **Backend**: Port 8080 (Go)
- **Database**: Port 3306 (MySQL)

## 📝 Usage Guide

### Menambah Pembina
1. Login ke admin panel
2. Pergi ke **Struktur & Pembina** (`/admin/struktur`)
3. Klik tab **"Pembina Organisasi"**
4. Klik **"Add Pembina"** (maksimal 2)
5. Isi form:
   - **Nama**: Nama lengkap pembina
   - **Jabatan**: e.g., "Pembina", "Pembina Utama"
   - **NIP**: Nomor Induk Pegawai (opsional)
   - **Foto**: Upload atau URL foto
6. Klik **"Simpan"**

### Menambah Struktur
1. Di halaman yang sama, klik tab **"Struktur Organisasi"**
2. Klik **"Add Struktur"**
3. Isi form lengkap (6 fields)
4. Simpan

### Upload Foto
- **Drag & drop** file ke area upload
- **Atau klik** untuk browse file
- **Format**: JPG, PNG, GIF
- **Size**: Maksimal 5MB
- **Auto resize** untuk optimasi

## 🚨 Troubleshooting

### Container Issues
```bash
# Restart semua services
docker-compose restart

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d

# Lihat logs
docker-compose logs backend
docker-compose logs frontend
```

### Database Issues
```bash
# Connect ke MySQL
docker exec -it arshaka_mysql mysql -u root -prootpassword arshaka_db

# Reset database (HATI-HATI!)
docker-compose down
docker volume rm arshaka-land_mysql_data
docker-compose up -d
```

### Permission Issues
```bash
# Fix permissions (Linux/Mac)
sudo chown -R $USER:$USER .
chmod -R 755 .
```

## 🔄 Updates

### Pull Latest Changes
```bash
git pull origin main
docker-compose build
docker-compose up -d
```

### Push Changes
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 📞 Support

Jika mengalami masalah:
1. Cek logs container: `docker-compose logs`
2. Pastikan semua ports tidak bentrok
3. Restart containers jika perlu
4. Cek database connection

## 🎯 Production Deployment

### Environment Setup
1. Update environment variables untuk production
2. Setup SSL certificates
3. Configure reverse proxy (nginx)
4. Setup backup database

### Security
- Ganti password admin default
- Setup firewall rules
- Enable HTTPS
- Regular security updates

---

**Happy Coding! 🚀**
