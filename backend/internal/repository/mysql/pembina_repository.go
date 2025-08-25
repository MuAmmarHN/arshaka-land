package mysql

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
	"database/sql"
)

type pembinaRepository struct {
	db *sql.DB
}

func NewPembinaRepository(db *sql.DB) repository.PembinaRepository {
	return &pembinaRepository{db: db}
}

func (r *pembinaRepository) GetAll(ctx context.Context) ([]entity.Pembina, error) {
	query := "SELECT id, nama, jabatan, nip, foto_url, created_at, updated_at FROM pembina ORDER BY created_at"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var pembina []entity.Pembina
	for rows.Next() {
		var p entity.Pembina
		err := rows.Scan(&p.ID, &p.Nama, &p.Jabatan, &p.NIP, &p.FotoURL, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			return nil, err
		}
		pembina = append(pembina, p)
	}

	return pembina, nil
}

func (r *pembinaRepository) GetByID(ctx context.Context, id int) (*entity.Pembina, error) {
	query := "SELECT id, nama, jabatan, nip, foto_url, created_at, updated_at FROM pembina WHERE id = ?"
	row := r.db.QueryRowContext(ctx, query, id)

	var p entity.Pembina
	err := row.Scan(&p.ID, &p.Nama, &p.Jabatan, &p.NIP, &p.FotoURL, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &p, nil
}

func (r *pembinaRepository) Count(ctx context.Context) (int, error) {
	query := "SELECT COUNT(*) FROM pembina"
	var count int
	err := r.db.QueryRowContext(ctx, query).Scan(&count)
	return count, err
}

func (r *pembinaRepository) Create(ctx context.Context, pembina *entity.Pembina) error {
	// Check if already have 2 pembina
	count, err := r.Count(ctx)
	if err != nil {
		return err
	}
	if count >= 2 {
		return repository.ErrMaxPembinaReached
	}

	query := "INSERT INTO pembina (nama, jabatan, nip, foto_url) VALUES (?, ?, ?, ?)"
	result, err := r.db.ExecContext(ctx, query, pembina.Nama, pembina.Jabatan, pembina.NIP, pembina.FotoURL)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	pembina.ID = int(id)
	return nil
}

func (r *pembinaRepository) Update(ctx context.Context, pembina *entity.Pembina) error {
	query := "UPDATE pembina SET nama = ?, jabatan = ?, nip = ?, foto_url = ? WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, pembina.Nama, pembina.Jabatan, pembina.NIP, pembina.FotoURL, pembina.ID)
	return err
}

func (r *pembinaRepository) Delete(ctx context.Context, id int) error {
	query := "DELETE FROM pembina WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
