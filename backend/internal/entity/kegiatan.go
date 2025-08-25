package entity

import "time"

type Kegiatan struct {
	ID        int            `json:"id" db:"id"`
	Judul     string         `json:"judul" db:"judul"`
	Deskripsi string         `json:"deskripsi" db:"deskripsi"`
	Cover     string         `json:"cover" db:"cover"`
	Tanggal   time.Time      `json:"tanggal" db:"tanggal"`
	CreatedAt time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt time.Time      `json:"updated_at" db:"updated_at"`
	Fotos     []KegiatanFoto `json:"fotos,omitempty"`
}

type KegiatanFoto struct {
	ID         int       `json:"id" db:"id"`
	KegiatanID int       `json:"kegiatan_id" db:"kegiatan_id"`
	ImageURL   string    `json:"image_url" db:"image_url"`
	Caption    string    `json:"caption" db:"caption"`
	SortOrder  int       `json:"sort_order" db:"sort_order"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
}
