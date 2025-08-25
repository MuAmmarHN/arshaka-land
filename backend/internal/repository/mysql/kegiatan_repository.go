package mysql

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
	"database/sql"
)

type kegiatanRepository struct {
	db *sql.DB
}

func NewKegiatanRepository(db *sql.DB) repository.KegiatanRepository {
	return &kegiatanRepository{db: db}
}

func (r *kegiatanRepository) GetAll(ctx context.Context) ([]entity.Kegiatan, error) {
	query := "SELECT id, judul, deskripsi, cover, tanggal, created_at, updated_at FROM kegiatan ORDER BY tanggal DESC"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var kegiatan []entity.Kegiatan
	for rows.Next() {
		var k entity.Kegiatan
		err := rows.Scan(&k.ID, &k.Judul, &k.Deskripsi, &k.Cover, &k.Tanggal, &k.CreatedAt, &k.UpdatedAt)
		if err != nil {
			return nil, err
		}

		// Get photos for each kegiatan
		fotos, err := r.GetFotosByKegiatanID(ctx, k.ID)
		if err != nil {
			return nil, err
		}
		k.Fotos = fotos

		kegiatan = append(kegiatan, k)
	}

	return kegiatan, nil
}

func (r *kegiatanRepository) GetByID(ctx context.Context, id int) (*entity.Kegiatan, error) {
	query := "SELECT id, judul, deskripsi, cover, tanggal, created_at, updated_at FROM kegiatan WHERE id = ?"
	row := r.db.QueryRowContext(ctx, query, id)

	var k entity.Kegiatan
	err := row.Scan(&k.ID, &k.Judul, &k.Deskripsi, &k.Cover, &k.Tanggal, &k.CreatedAt, &k.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	// Get photos
	fotos, err := r.GetFotosByKegiatanID(ctx, id)
	if err != nil {
		return nil, err
	}
	k.Fotos = fotos

	return &k, nil
}

func (r *kegiatanRepository) Create(ctx context.Context, kegiatan *entity.Kegiatan) error {
	query := "INSERT INTO kegiatan (judul, deskripsi, cover, tanggal) VALUES (?, ?, ?, ?)"
	result, err := r.db.ExecContext(ctx, query, kegiatan.Judul, kegiatan.Deskripsi, kegiatan.Cover, kegiatan.Tanggal)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	kegiatan.ID = int(id)
	return nil
}

func (r *kegiatanRepository) Update(ctx context.Context, kegiatan *entity.Kegiatan) error {
	query := "UPDATE kegiatan SET judul = ?, deskripsi = ?, cover = ?, tanggal = ? WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, kegiatan.Judul, kegiatan.Deskripsi, kegiatan.Cover, kegiatan.Tanggal, kegiatan.ID)
	return err
}

func (r *kegiatanRepository) Delete(ctx context.Context, id int) error {
	// Delete photos first (cascade should handle this, but let's be explicit)
	err := r.DeleteFotosByKegiatanID(ctx, id)
	if err != nil {
		return err
	}

	query := "DELETE FROM kegiatan WHERE id = ?"
	_, err = r.db.ExecContext(ctx, query, id)
	return err
}

func (r *kegiatanRepository) GetFotosByKegiatanID(ctx context.Context, kegiatanID int) ([]entity.KegiatanFoto, error) {
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

	var fotos []entity.KegiatanFoto
	for rows.Next() {
		var foto entity.KegiatanFoto
		err := rows.Scan(&foto.ID, &foto.KegiatanID, &foto.ImageURL, &foto.Caption, &foto.SortOrder, &foto.CreatedAt, &foto.UpdatedAt)
		if err != nil {
			return nil, err
		}
		fotos = append(fotos, foto)
	}

	return fotos, nil
}

func (r *kegiatanRepository) CreateFoto(ctx context.Context, foto *entity.KegiatanFoto) error {
	query := "INSERT INTO kegiatan_foto (kegiatan_id, image_url) VALUES (?, ?)"
	result, err := r.db.ExecContext(ctx, query, foto.KegiatanID, foto.ImageURL)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	foto.ID = int(id)
	return nil
}

func (r *kegiatanRepository) DeleteFotosByKegiatanID(ctx context.Context, kegiatanID int) error {
	query := "DELETE FROM kegiatan_foto WHERE kegiatan_id = ?"
	_, err := r.db.ExecContext(ctx, query, kegiatanID)
	return err
}
