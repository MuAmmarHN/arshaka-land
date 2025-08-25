package mysql

import (
	"context"
	"database/sql"

	"arshaka-backend/internal/entity"
)

type KegiatanPhotoRepository struct {
	db *sql.DB
}

func NewKegiatanPhotoRepository(db *sql.DB) *KegiatanPhotoRepository {
	return &KegiatanPhotoRepository{db: db}
}

func (r *KegiatanPhotoRepository) GetByKegiatanID(ctx context.Context, kegiatanID int) ([]entity.KegiatanFoto, error) {
	query := `
		SELECT id, kegiatan_id, photo_url as image_url, caption, sort_order, created_at, updated_at
		FROM kegiatan_photos
		WHERE kegiatan_id = ?
		ORDER BY sort_order ASC, created_at ASC
	`

	rows, err := r.db.QueryContext(ctx, query, kegiatanID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var photos []entity.KegiatanFoto
	for rows.Next() {
		var photo entity.KegiatanFoto
		err := rows.Scan(
			&photo.ID,
			&photo.KegiatanID,
			&photo.ImageURL,
			&photo.Caption,
			&photo.SortOrder,
			&photo.CreatedAt,
			&photo.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		photos = append(photos, photo)
	}

	return photos, nil
}

func (r *KegiatanPhotoRepository) Create(ctx context.Context, photo *entity.KegiatanFoto) error {
	query := `
		INSERT INTO kegiatan_photos (kegiatan_id, photo_url, caption, sort_order)
		VALUES (?, ?, ?, ?)
	`

	result, err := r.db.ExecContext(ctx, query, photo.KegiatanID, photo.ImageURL, photo.Caption, photo.SortOrder)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	photo.ID = int(id)
	return nil
}

func (r *KegiatanPhotoRepository) Update(ctx context.Context, photo *entity.KegiatanFoto) error {
	query := `
		UPDATE kegiatan_photos
		SET photo_url = ?, caption = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`

	_, err := r.db.ExecContext(ctx, query, photo.ImageURL, photo.Caption, photo.SortOrder, photo.ID)
	return err
}

func (r *KegiatanPhotoRepository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM kegiatan_photos WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}

func (r *KegiatanPhotoRepository) UpdateSortOrder(ctx context.Context, photoID int, sortOrder int) error {
	query := `
		UPDATE kegiatan_photos 
		SET sort_order = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`

	_, err := r.db.ExecContext(ctx, query, sortOrder, photoID)
	return err
}

func (r *KegiatanPhotoRepository) GetByID(ctx context.Context, id int) (*entity.KegiatanFoto, error) {
	query := `
		SELECT id, kegiatan_id, photo_url as image_url, caption, sort_order, created_at, updated_at
		FROM kegiatan_photos
		WHERE id = ?
	`

	var photo entity.KegiatanFoto
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&photo.ID,
		&photo.KegiatanID,
		&photo.ImageURL,
		&photo.Caption,
		&photo.SortOrder,
		&photo.CreatedAt,
		&photo.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &photo, nil
}
