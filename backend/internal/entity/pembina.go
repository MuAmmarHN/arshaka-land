package entity

import "time"

type Pembina struct {
	ID        int       `json:"id" db:"id"`
	Nama      string    `json:"nama" db:"nama"`
	Jabatan   string    `json:"jabatan" db:"jabatan"`
	NIP       string    `json:"nip" db:"nip"`
	FotoURL   string    `json:"foto_url" db:"foto_url"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
