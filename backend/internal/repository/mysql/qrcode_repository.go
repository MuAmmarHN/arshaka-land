package mysql

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
	"database/sql"
)

type qrcodeRepository struct {
	db *sql.DB
}

func NewQRCodeRepository(db *sql.DB) repository.QRCodeRepository {
	return &qrcodeRepository{db: db}
}

func (r *qrcodeRepository) GetAll(ctx context.Context) ([]entity.QRCode, error) {
	query := "SELECT id, image_url, keterangan, enable, created_at, updated_at FROM qr_code ORDER BY created_at DESC"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var qrcodes []entity.QRCode
	for rows.Next() {
		var qr entity.QRCode
		err := rows.Scan(&qr.ID, &qr.ImageURL, &qr.Keterangan, &qr.Enable, &qr.CreatedAt, &qr.UpdatedAt)
		if err != nil {
			return nil, err
		}
		qrcodes = append(qrcodes, qr)
	}

	return qrcodes, nil
}

func (r *qrcodeRepository) GetEnabled(ctx context.Context) ([]entity.QRCode, error) {
	query := "SELECT id, image_url, keterangan, enable, created_at, updated_at FROM qr_code WHERE enable = true ORDER BY created_at DESC"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var qrcodes []entity.QRCode
	for rows.Next() {
		var qr entity.QRCode
		err := rows.Scan(&qr.ID, &qr.ImageURL, &qr.Keterangan, &qr.Enable, &qr.CreatedAt, &qr.UpdatedAt)
		if err != nil {
			return nil, err
		}
		qrcodes = append(qrcodes, qr)
	}

	return qrcodes, nil
}

func (r *qrcodeRepository) GetByID(ctx context.Context, id int) (*entity.QRCode, error) {
	query := "SELECT id, image_url, keterangan, enable, created_at, updated_at FROM qr_code WHERE id = ?"
	row := r.db.QueryRowContext(ctx, query, id)

	var qr entity.QRCode
	err := row.Scan(&qr.ID, &qr.ImageURL, &qr.Keterangan, &qr.Enable, &qr.CreatedAt, &qr.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &qr, nil
}

func (r *qrcodeRepository) Create(ctx context.Context, qrcode *entity.QRCode) error {
	query := "INSERT INTO qr_code (image_url, keterangan, enable) VALUES (?, ?, ?)"
	result, err := r.db.ExecContext(ctx, query, qrcode.ImageURL, qrcode.Keterangan, qrcode.Enable)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	qrcode.ID = int(id)
	return nil
}

func (r *qrcodeRepository) Update(ctx context.Context, qrcode *entity.QRCode) error {
	query := "UPDATE qr_code SET image_url = ?, keterangan = ?, enable = ? WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, qrcode.ImageURL, qrcode.Keterangan, qrcode.Enable, qrcode.ID)
	return err
}

func (r *qrcodeRepository) Delete(ctx context.Context, id int) error {
	query := "DELETE FROM qr_code WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}

func (r *qrcodeRepository) ToggleEnable(ctx context.Context, id int) error {
	query := "UPDATE qr_code SET enable = NOT enable WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
