package mysql

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
	"database/sql"
)

type adminRepository struct {
	db *sql.DB
}

func NewAdminRepository(db *sql.DB) repository.AdminRepository {
	return &adminRepository{db: db}
}

func (r *adminRepository) GetByUsername(ctx context.Context, username string) (*entity.AdminUser, error) {
	query := "SELECT id, username, password_hash, created_at, updated_at FROM admin_user WHERE username = ?"
	row := r.db.QueryRowContext(ctx, query, username)

	var admin entity.AdminUser
	err := row.Scan(&admin.ID, &admin.Username, &admin.PasswordHash, &admin.CreatedAt, &admin.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &admin, nil
}
