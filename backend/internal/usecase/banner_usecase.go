package usecase

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
)

type BannerUsecase interface {
	GetAll(ctx context.Context) ([]entity.Banner, error)
	GetByID(ctx context.Context, id int) (*entity.Banner, error)
	Create(ctx context.Context, banner *entity.Banner) error
	Update(ctx context.Context, banner *entity.Banner) error
	Delete(ctx context.Context, id int) error
}

type bannerUsecase struct {
	bannerRepo repository.BannerRepository
}

func NewBannerUsecase(bannerRepo repository.BannerRepository) BannerUsecase {
	return &bannerUsecase{
		bannerRepo: bannerRepo,
	}
}

func (u *bannerUsecase) GetAll(ctx context.Context) ([]entity.Banner, error) {
	return u.bannerRepo.GetAll(ctx)
}

func (u *bannerUsecase) GetByID(ctx context.Context, id int) (*entity.Banner, error) {
	return u.bannerRepo.GetByID(ctx, id)
}

func (u *bannerUsecase) Create(ctx context.Context, banner *entity.Banner) error {
	return u.bannerRepo.Create(ctx, banner)
}

func (u *bannerUsecase) Update(ctx context.Context, banner *entity.Banner) error {
	return u.bannerRepo.Update(ctx, banner)
}

func (u *bannerUsecase) Delete(ctx context.Context, id int) error {
	return u.bannerRepo.Delete(ctx, id)
}
