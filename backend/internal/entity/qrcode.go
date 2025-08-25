package entity

import "time"

type QRCode struct {
	ID         int       `json:"id" db:"id"`
	ImageURL   string    `json:"image_url" db:"image_url"`
	Keterangan string    `json:"keterangan" db:"keterangan"`
	Enable     bool      `json:"enable" db:"enable"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
}
