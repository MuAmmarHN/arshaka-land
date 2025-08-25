package usecase

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
)

type QRCodeUsecase interface {
	GetAll(ctx context.Context) ([]entity.QRCode, error)
	GetEnabled(ctx context.Context) ([]entity.QRCode, error)
	GetByID(ctx context.Context, id int) (*entity.QRCode, error)
	Create(ctx context.Context, qrcode *entity.QRCode) error
	Update(ctx context.Context, qrcode *entity.QRCode) error
	Delete(ctx context.Context, id int) error
	ToggleEnable(ctx context.Context, id int) error
}

type qrcodeUsecase struct {
	qrcodeRepo repository.QRCodeRepository
}

func NewQRCodeUsecase(qrcodeRepo repository.QRCodeRepository) QRCodeUsecase {
	return &qrcodeUsecase{
		qrcodeRepo: qrcodeRepo,
	}
}

func (u *qrcodeUsecase) GetAll(ctx context.Context) ([]entity.QRCode, error) {
	return u.qrcodeRepo.GetAll(ctx)
}

func (u *qrcodeUsecase) GetEnabled(ctx context.Context) ([]entity.QRCode, error) {
	return u.qrcodeRepo.GetEnabled(ctx)
}

func (u *qrcodeUsecase) GetByID(ctx context.Context, id int) (*entity.QRCode, error) {
	return u.qrcodeRepo.GetByID(ctx, id)
}

func (u *qrcodeUsecase) Create(ctx context.Context, qrcode *entity.QRCode) error {
	return u.qrcodeRepo.Create(ctx, qrcode)
}

func (u *qrcodeUsecase) Update(ctx context.Context, qrcode *entity.QRCode) error {
	return u.qrcodeRepo.Update(ctx, qrcode)
}

func (u *qrcodeUsecase) Delete(ctx context.Context, id int) error {
	return u.qrcodeRepo.Delete(ctx, id)
}

func (u *qrcodeUsecase) ToggleEnable(ctx context.Context, id int) error {
	return u.qrcodeRepo.ToggleEnable(ctx, id)
}
