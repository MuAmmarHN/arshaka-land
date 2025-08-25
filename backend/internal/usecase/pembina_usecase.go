package usecase

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
)

type PembinaUsecase interface {
	GetAll(ctx context.Context) ([]entity.Pembina, error)
	GetByID(ctx context.Context, id int) (*entity.Pembina, error)
	Create(ctx context.Context, pembina *entity.Pembina) error
	Update(ctx context.Context, pembina *entity.Pembina) error
	Delete(ctx context.Context, id int) error
	Count(ctx context.Context) (int, error)
}

type pembinaUsecase struct {
	pembinaRepo repository.PembinaRepository
}

func NewPembinaUsecase(pembinaRepo repository.PembinaRepository) PembinaUsecase {
	return &pembinaUsecase{
		pembinaRepo: pembinaRepo,
	}
}

func (u *pembinaUsecase) GetAll(ctx context.Context) ([]entity.Pembina, error) {
	return u.pembinaRepo.GetAll(ctx)
}

func (u *pembinaUsecase) GetByID(ctx context.Context, id int) (*entity.Pembina, error) {
	return u.pembinaRepo.GetByID(ctx, id)
}

func (u *pembinaUsecase) Create(ctx context.Context, pembina *entity.Pembina) error {
	return u.pembinaRepo.Create(ctx, pembina)
}

func (u *pembinaUsecase) Update(ctx context.Context, pembina *entity.Pembina) error {
	return u.pembinaRepo.Update(ctx, pembina)
}

func (u *pembinaUsecase) Delete(ctx context.Context, id int) error {
	return u.pembinaRepo.Delete(ctx, id)
}

func (u *pembinaUsecase) Count(ctx context.Context) (int, error) {
	return u.pembinaRepo.Count(ctx)
}
