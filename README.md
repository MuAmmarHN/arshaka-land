# Arshaka Bimantara Website

Website resmi Arshaka Bimantara dengan teknologi modern.

## Tech Stack

### Backend
- **Golang** dengan Clean Architecture
- **MySQL** database via Docker
- **JWT** authentication
- **REST API** endpoints

### Frontend
- **React v18** (Create React App)
- **TailwindCSS** untuk styling
- **React Router DOM** untuk routing
- **Swiper.js** untuk carousel
- **Axios** untuk HTTP client

## Project Structure

```
Arshaka-land/
├── backend/                 # Golang backend
│   ├── cmd/
│   ├── internal/
│   │   ├── entity/         # Domain entities
│   │   ├── repository/     # Data access layer
│   │   ├── usecase/        # Business logic
│   │   └── delivery/       # HTTP handlers
│   ├── pkg/
│   ├── migrations/
│   └── docker/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── docker-compose.yml
└── README.md
```

## Features

### Landing Page
- Header dengan logo dan judul
- Banner carousel auto-slide
- Section sejarah
- Section kegiatan dengan cards
- Section struktur organisasi
- Section QR code (conditional)

### Admin Panel
- Login authentication
- Dashboard dengan sidebar
- CRUD Banner management
- CRUD Kegiatan management
- CRUD Struktur management
- CRUD QR Code management

## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Go 1.19+

### Development Setup

1. Clone repository
```bash
git clone <repository-url>
cd Arshaka-land
```

2. Start database
```bash
docker-compose up -d mysql
```

3. Run backend
```bash
cd backend
go mod tidy
go run cmd/main.go
```

4. Run frontend
```bash
cd frontend
npm install
npm start
```

### Production Setup
```bash
docker-compose up -d
```

## Current Implementation Status

### ✅ Completed Features

#### Backend (Golang Clean Architecture)
- ✅ Project structure with Clean Architecture
- ✅ MySQL database schema with Docker
- ✅ Entity models (Banner, Kegiatan, Struktur, QRCode, Admin)
- ✅ Repository interfaces and MySQL implementations
- ✅ Usecase layer for business logic
- ✅ HTTP delivery layer with REST API
- ✅ JWT authentication system
- ✅ CORS configuration
- ✅ Docker configuration

#### Frontend (React + TailwindCSS)
- ✅ React 18 with TypeScript setup
- ✅ TailwindCSS configuration with maroon theme
- ✅ React Router DOM routing
- ✅ Landing page with responsive design
- ✅ Admin login page
- ✅ Admin dashboard layout
- ✅ Component structure for all pages

#### API Endpoints Implemented
- ✅ `POST /api/admin/login` - Admin authentication
- ✅ `GET /api/banners` - Get all banners
- ✅ `GET /api/banners/:id` - Get banner by ID
- ✅ `POST /api/banners` - Create banner
- ✅ `PUT /api/banners/:id` - Update banner
- ✅ `DELETE /api/banners/:id` - Delete banner
- ✅ `GET /api/kegiatan` - Get all kegiatan
- ✅ `GET /api/kegiatan/:id` - Get kegiatan detail
- ✅ `POST /api/kegiatan` - Create kegiatan
- ✅ `PUT /api/kegiatan/:id` - Update kegiatan
- ✅ `DELETE /api/kegiatan/:id` - Delete kegiatan

### 🚧 Remaining Tasks

#### Backend
- [ ] Struktur CRUD API implementation
- [ ] QR Code CRUD API implementation
- [ ] File upload handling for images
- [ ] JWT middleware for protected routes
- [ ] Input validation and error handling
- [ ] Database seeding with sample data

#### Frontend
- [ ] Complete admin CRUD interfaces
- [ ] File upload components
- [ ] Toast notifications
- [ ] Loading states and error handling
- [ ] Swiper.js carousel implementation
- [ ] API integration for all endpoints
- [ ] Form validation
- [ ] Image preview and management

#### Integration
- [ ] Connect frontend with backend APIs
- [ ] Test all CRUD operations
- [ ] Error handling and user feedback
- [ ] Authentication flow testing

## API Endpoints

### Public Endpoints
- `GET /api/banners` - Get all banners
- `GET /api/kegiatan` - Get all kegiatan
- `GET /api/kegiatan/:id` - Get kegiatan detail
- `GET /api/struktur` - Get struktur organisasi
- `GET /api/qrcode` - Get QR codes

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/banners` - Create banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner
- `POST /api/kegiatan` - Create kegiatan
- `PUT /api/kegiatan/:id` - Update kegiatan
- `DELETE /api/kegiatan/:id` - Delete kegiatan
- `POST /api/struktur` - Create struktur
- `PUT /api/struktur/:id` - Update struktur
- `DELETE /api/struktur/:id` - Delete struktur
- `POST /api/qrcode` - Create QR code
- `PUT /api/qrcode/:id` - Update QR code
- `DELETE /api/qrcode/:id` - Delete QR code
- `PUT /api/qrcode/:id/toggle` - Toggle QR code status

## Database Schema

### Tables
- `banners` - Banner images
- `kegiatan` - Activities/events
- `kegiatan_foto` - Activity photos
- `struktur` - Organization structure
- `qr_code` - QR codes
- `admin_user` - Admin users

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`


