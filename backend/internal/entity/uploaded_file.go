package entity

import "time"

type UploadedFile struct {
	ID               int       `json:"id" db:"id"`
	Filename         string    `json:"filename" db:"filename"`
	OriginalFilename string    `json:"original_filename" db:"original_filename"`
	FilePath         string    `json:"file_path" db:"file_path"`
	FileURL          string    `json:"file_url" db:"file_url"`
	FileSize         int64     `json:"file_size" db:"file_size"`
	MimeType         string    `json:"mime_type" db:"mime_type"`
	UploadedBy       string    `json:"uploaded_by" db:"uploaded_by"`
	UploadContext    string    `json:"upload_context" db:"upload_context"`
	IsUsed           bool      `json:"is_used" db:"is_used"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`
}

type FileUsage struct {
	ID             int       `json:"id" db:"id"`
	UploadedFileID int       `json:"uploaded_file_id" db:"uploaded_file_id"`
	EntityType     string    `json:"entity_type" db:"entity_type"`
	EntityID       int       `json:"entity_id" db:"entity_id"`
	FieldName      string    `json:"field_name" db:"field_name"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
}

// Upload response dengan metadata lengkap
type UploadResponse struct {
	URL      string `json:"url"`
	Filename string `json:"filename"`
	FileID   int    `json:"file_id"`
	Size     int64  `json:"size"`
	MimeType string `json:"mime_type"`
}
