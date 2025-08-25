package usecase

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"context"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase interface {
	Login(ctx context.Context, req *entity.LoginRequest) (*entity.LoginResponse, error)
}

type authUsecase struct {
	adminRepo repository.AdminRepository
}

func NewAuthUsecase(adminRepo repository.AdminRepository) AuthUsecase {
	return &authUsecase{
		adminRepo: adminRepo,
	}
}

func (u *authUsecase) Login(ctx context.Context, req *entity.LoginRequest) (*entity.LoginResponse, error) {
	// Get admin by username
	admin, err := u.adminRepo.GetByUsername(ctx, req.Username)
	if err != nil {
		return nil, err
	}

	if admin == nil {
		return nil, errors.New("invalid credentials")
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Generate JWT token
	token, err := u.generateToken(admin)
	if err != nil {
		return nil, err
	}

	return &entity.LoginResponse{
		Token: token,
		User:  *admin,
	}, nil
}

func (u *authUsecase) generateToken(admin *entity.AdminUser) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  admin.ID,
		"username": admin.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // 24 hours
		"iat":      time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "your-super-secret-jwt-key-here"
	}

	return token.SignedString([]byte(secret))
}
