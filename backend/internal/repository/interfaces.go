package repository

import (
	"arshaka-backend/internal/entity"
	"context"
	"errors"
)

var (
	ErrMaxPembinaReached = errors.New("maksimal 2 pembina sudah tercapai")
)

type AdminRepository interface {
	GetByUsername(ctx context.Context, username string) (*entity.AdminUser, error)
}

type BannerRepository interface {
	GetAll(ctx context.Context) ([]entity.Banner, error)
	GetByID(ctx context.Context, id int) (*entity.Banner, error)
	Create(ctx context.Context, banner *entity.Banner) error
	Update(ctx context.Context, banner *entity.Banner) error
	Delete(ctx context.Context, id int) error
}

type KegiatanRepository interface {
	GetAll(ctx context.Context) ([]entity.Kegiatan, error)
	GetByID(ctx context.Context, id int) (*entity.Kegiatan, error)
	Create(ctx context.Context, kegiatan *entity.Kegiatan) error
	Update(ctx context.Context, kegiatan *entity.Kegiatan) error
	Delete(ctx context.Context, id int) error
	GetFotosByKegiatanID(ctx context.Context, kegiatanID int) ([]entity.KegiatanFoto, error)
	CreateFoto(ctx context.Context, foto *entity.KegiatanFoto) error
	DeleteFotosByKegiatanID(ctx context.Context, kegiatanID int) error
}

type StrukturRepository interface {
	GetAll(ctx context.Context) ([]entity.Struktur, error)
	GetByID(ctx context.Context, id int) (*entity.Struktur, error)
	Create(ctx context.Context, struktur *entity.Struktur) error
	Update(ctx context.Context, struktur *entity.Struktur) error
	Delete(ctx context.Context, id int) error
}

type QRCodeRepository interface {
	GetAll(ctx context.Context) ([]entity.QRCode, error)
	GetEnabled(ctx context.Context) ([]entity.QRCode, error)
	GetByID(ctx context.Context, id int) (*entity.QRCode, error)
	Create(ctx context.Context, qrcode *entity.QRCode) error
	Update(ctx context.Context, qrcode *entity.QRCode) error
	Delete(ctx context.Context, id int) error
	ToggleEnable(ctx context.Context, id int) error
}

type PembinaRepository interface {
	GetAll(ctx context.Context) ([]entity.Pembina, error)
	GetByID(ctx context.Context, id int) (*entity.Pembina, error)
	Create(ctx context.Context, pembina *entity.Pembina) error
	Update(ctx context.Context, pembina *entity.Pembina) error
	Delete(ctx context.Context, id int) error
	Count(ctx context.Context) (int, error)
}
