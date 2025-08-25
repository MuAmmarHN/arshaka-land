package usecase

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
)

type KegiatanUsecase interface {
	GetAll(ctx context.Context) ([]entity.Kegiatan, error)
	GetByID(ctx context.Context, id int) (*entity.Kegiatan, error)
	Create(ctx context.Context, kegiatan *entity.Kegiatan) error
	Update(ctx context.Context, kegiatan *entity.Kegiatan) error
	Delete(ctx context.Context, id int) error
	AddFoto(ctx context.Context, kegiatanID int, imageURL string) error
}

type kegiatanUsecase struct {
	kegiatanRepo repository.KegiatanRepository
}

func NewKegiatanUsecase(kegiatanRepo repository.KegiatanRepository) KegiatanUsecase {
	return &kegiatanUsecase{
		kegiatanRepo: kegiatanRepo,
	}
}

func (u *kegiatanUsecase) GetAll(ctx context.Context) ([]entity.Kegiatan, error) {
	return u.kegiatanRepo.GetAll(ctx)
}

func (u *kegiatanUsecase) GetByID(ctx context.Context, id int) (*entity.Kegiatan, error) {
	return u.kegiatanRepo.GetByID(ctx, id)
}

func (u *kegiatanUsecase) Create(ctx context.Context, kegiatan *entity.Kegiatan) error {
	return u.kegiatanRepo.Create(ctx, kegiatan)
}

func (u *kegiatanUsecase) Update(ctx context.Context, kegiatan *entity.Kegiatan) error {
	return u.kegiatanRepo.Update(ctx, kegiatan)
}

func (u *kegiatanUsecase) Delete(ctx context.Context, id int) error {
	return u.kegiatanRepo.Delete(ctx, id)
}

func (u *kegiatanUsecase) AddFoto(ctx context.Context, kegiatanID int, imageURL string) error {
	foto := &entity.KegiatanFoto{
		KegiatanID: kegiatanID,
		ImageURL:   imageURL,
	}
	return u.kegiatanRepo.CreateFoto(ctx, foto)
}
