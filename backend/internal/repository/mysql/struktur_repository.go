package mysql

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
	"database/sql"
)

type strukturRepository struct {
	db *sql.DB
}

func NewStrukturRepository(db *sql.DB) repository.StrukturRepository {
	return &strukturRepository{db: db}
}

func (r *strukturRepository) GetAll(ctx context.Context) ([]entity.Struktur, error) {
	query := "SELECT id, nama, jabatan, prodi, angkatan, nra, foto_url, created_at, updated_at FROM struktur ORDER BY created_at"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var struktur []entity.Struktur
	for rows.Next() {
		var s entity.Struktur
		err := rows.Scan(&s.ID, &s.Nama, &s.Jabatan, &s.Prodi, &s.Angkatan, &s.NRA, &s.FotoURL, &s.CreatedAt, &s.UpdatedAt)
		if err != nil {
			return nil, err
		}
		struktur = append(struktur, s)
	}

	return struktur, nil
}

func (r *strukturRepository) GetByID(ctx context.Context, id int) (*entity.Struktur, error) {
	query := "SELECT id, nama, jabatan, prodi, angkatan, nra, foto_url, created_at, updated_at FROM struktur WHERE id = ?"
	row := r.db.QueryRowContext(ctx, query, id)

	var s entity.Struktur
	err := row.Scan(&s.ID, &s.Nama, &s.Jabatan, &s.Prodi, &s.Angkatan, &s.NRA, &s.FotoURL, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &s, nil
}

func (r *strukturRepository) Create(ctx context.Context, struktur *entity.Struktur) error {
	query := "INSERT INTO struktur (nama, jabatan, prodi, angkatan, nra, foto_url) VALUES (?, ?, ?, ?, ?, ?)"
	result, err := r.db.ExecContext(ctx, query, struktur.Nama, struktur.Jabatan, struktur.Prodi, struktur.Angkatan, struktur.NRA, struktur.FotoURL)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	struktur.ID = int(id)
	return nil
}

func (r *strukturRepository) Update(ctx context.Context, struktur *entity.Struktur) error {
	query := "UPDATE struktur SET nama = ?, jabatan = ?, prodi = ?, angkatan = ?, nra = ?, foto_url = ? WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, struktur.Nama, struktur.Jabatan, struktur.Prodi, struktur.Angkatan, struktur.NRA, struktur.FotoURL, struktur.ID)
	return err
}

func (r *strukturRepository) Delete(ctx context.Context, id int) error {
	query := "DELETE FROM struktur WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
