package entity

import "time"

type KegiatanPhoto struct {
	ID         int       `json:"id" db:"id"`
	KegiatanID int       `json:"kegiatan_id" db:"kegiatan_id"`
	PhotoURL   string    `json:"photo_url" db:"photo_url"`
	Caption    string    `json:"caption" db:"caption"`
	SortOrder  int       `json:"sort_order" db:"sort_order"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
}
