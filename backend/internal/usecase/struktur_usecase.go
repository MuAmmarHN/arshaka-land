package usecase

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
)

type StrukturUsecase interface {
	GetAll(ctx context.Context) ([]entity.Struktur, error)
	GetByID(ctx context.Context, id int) (*entity.Struktur, error)
	Create(ctx context.Context, struktur *entity.Struktur) error
	Update(ctx context.Context, struktur *entity.Struktur) error
	Delete(ctx context.Context, id int) error
}

type strukturUsecase struct {
	strukturRepo repository.StrukturRepository
}

func NewStrukturUsecase(strukturRepo repository.StrukturRepository) StrukturUsecase {
	return &strukturUsecase{
		strukturRepo: strukturRepo,
	}
}

func (u *strukturUsecase) GetAll(ctx context.Context) ([]entity.Struktur, error) {
	return u.strukturRepo.GetAll(ctx)
}

func (u *strukturUsecase) GetByID(ctx context.Context, id int) (*entity.Struktur, error) {
	return u.strukturRepo.GetByID(ctx, id)
}

func (u *strukturUsecase) Create(ctx context.Context, struktur *entity.Struktur) error {
	return u.strukturRepo.Create(ctx, struktur)
}

func (u *strukturUsecase) Update(ctx context.Context, struktur *entity.Struktur) error {
	return u.strukturRepo.Update(ctx, struktur)
}

func (u *strukturUsecase) Delete(ctx context.Context, id int) error {
	return u.strukturRepo.Delete(ctx, id)
}
