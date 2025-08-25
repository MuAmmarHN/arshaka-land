package usecase

import (
	"context"

	"arshaka-backend/internal/entity"
)

type KegiatanPhotoUsecase interface {
	GetByKegiatanID(ctx context.Context, kegiatanID int) ([]entity.KegiatanFoto, error)
	Create(ctx context.Context, photo *entity.KegiatanFoto) error
	Update(ctx context.Context, photo *entity.KegiatanFoto) error
	Delete(ctx context.Context, id int) error
	UpdateSortOrder(ctx context.Context, photos []struct {
		ID        int `json:"id"`
		SortOrder int `json:"sort_order"`
	}) error
}

type KegiatanPhotoRepository interface {
	GetByKegiatanID(ctx context.Context, kegiatanID int) ([]entity.KegiatanFoto, error)
	Create(ctx context.Context, photo *entity.KegiatanFoto) error
	Update(ctx context.Context, photo *entity.KegiatanFoto) error
	Delete(ctx context.Context, id int) error
	UpdateSortOrder(ctx context.Context, photoID int, sortOrder int) error
	GetByID(ctx context.Context, id int) (*entity.KegiatanFoto, error)
}

type kegiatanPhotoUsecase struct {
	kegiatanPhotoRepo KegiatanPhotoRepository
}

func NewKegiatanPhotoUsecase(kegiatanPhotoRepo KegiatanPhotoRepository) KegiatanPhotoUsecase {
	return &kegiatanPhotoUsecase{
		kegiatanPhotoRepo: kegiatanPhotoRepo,
	}
}

func (u *kegiatanPhotoUsecase) GetByKegiatanID(ctx context.Context, kegiatanID int) ([]entity.KegiatanFoto, error) {
	return u.kegiatanPhotoRepo.GetByKegiatanID(ctx, kegiatanID)
}

func (u *kegiatanPhotoUsecase) Create(ctx context.Context, photo *entity.KegiatanFoto) error {
	return u.kegiatanPhotoRepo.Create(ctx, photo)
}

func (u *kegiatanPhotoUsecase) Update(ctx context.Context, photo *entity.KegiatanFoto) error {
	return u.kegiatanPhotoRepo.Update(ctx, photo)
}

func (u *kegiatanPhotoUsecase) Delete(ctx context.Context, id int) error {
	return u.kegiatanPhotoRepo.Delete(ctx, id)
}

func (u *kegiatanPhotoUsecase) UpdateSortOrder(ctx context.Context, photos []struct {
	ID        int `json:"id"`
	SortOrder int `json:"sort_order"`
}) error {
	for _, photo := range photos {
		err := u.kegiatanPhotoRepo.UpdateSortOrder(ctx, photo.ID, photo.SortOrder)
		if err != nil {
			return err
		}
	}
	return nil
}
