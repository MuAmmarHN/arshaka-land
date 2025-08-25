package mysql

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
	"database/sql"
)

type bannerRepository struct {
	db *sql.DB
}

func NewBannerRepository(db *sql.DB) repository.BannerRepository {
	return &bannerRepository{db: db}
}

func (r *bannerRepository) GetAll(ctx context.Context) ([]entity.Banner, error) {
	query := "SELECT id, image_url, created_at, updated_at FROM banners ORDER BY created_at DESC"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var banners []entity.Banner
	for rows.Next() {
		var banner entity.Banner
		err := rows.Scan(&banner.ID, &banner.ImageURL, &banner.CreatedAt, &banner.UpdatedAt)
		if err != nil {
			return nil, err
		}
		banners = append(banners, banner)
	}

	return banners, nil
}

func (r *bannerRepository) GetByID(ctx context.Context, id int) (*entity.Banner, error) {
	query := "SELECT id, image_url, created_at, updated_at FROM banners WHERE id = ?"
	row := r.db.QueryRowContext(ctx, query, id)

	var banner entity.Banner
	err := row.Scan(&banner.ID, &banner.ImageURL, &banner.CreatedAt, &banner.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &banner, nil
}

func (r *bannerRepository) Create(ctx context.Context, banner *entity.Banner) error {
	query := "INSERT INTO banners (image_url) VALUES (?)"
	result, err := r.db.ExecContext(ctx, query, banner.ImageURL)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	banner.ID = int(id)
	return nil
}

func (r *bannerRepository) Update(ctx context.Context, banner *entity.Banner) error {
	query := "UPDATE banners SET image_url = ? WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, banner.ImageURL, banner.ID)
	return err
}

func (r *bannerRepository) Delete(ctx context.Context, id int) error {
	query := "DELETE FROM banners WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
