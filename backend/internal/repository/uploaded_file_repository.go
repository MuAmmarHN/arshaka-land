package repository

import (
	"arshaka-backend/internal/entity"
	"context"
)

type UploadedFileRepository interface {
	Create(ctx context.Context, file *entity.UploadedFile) error
	GetByID(ctx context.Context, id int) (*entity.UploadedFile, error)
	GetByFilename(ctx context.Context, filename string) (*entity.UploadedFile, error)
	GetAll(ctx context.Context) ([]entity.UploadedFile, error)
	GetByContext(ctx context.Context, uploadContext string) ([]entity.UploadedFile, error)
	GetUnused(ctx context.Context) ([]entity.UploadedFile, error)
	MarkAsUsed(ctx context.Context, id int) error
	MarkAsUnused(ctx context.Context, id int) error
	Delete(ctx context.Context, id int) error
	
	// File usage tracking
	CreateFileUsage(ctx context.Context, usage *entity.FileUsage) error
	DeleteFileUsage(ctx context.Context, uploadedFileID int, entityType string, entityID int) error
	GetFileUsage(ctx context.Context, uploadedFileID int) ([]entity.FileUsage, error)
}
