package entity

import "time"

type Struktur struct {
	ID        int       `json:"id" db:"id"`
	Nama      string    `json:"nama" db:"nama"`
	Jabatan   string    `json:"jabatan" db:"jabatan"`
	Prodi     string    `json:"prodi" db:"prodi"`
	Angkatan  string    `json:"angkatan" db:"angkatan"`
	NRA       string    `json:"nra" db:"nra"`
	FotoURL   string    `json:"foto_url" db:"foto_url"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
