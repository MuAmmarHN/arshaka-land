package http

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/usecase"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type BannerHandler struct {
	bannerUsecase usecase.BannerUsecase
}

func NewBannerHandler(bannerUsecase usecase.BannerUsecase) *BannerHandler {
	return &BannerHandler{
		bannerUsecase: bannerUsecase,
	}
}

func (h *BannerHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	banners, err := h.bannerUsecase.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    banners,
	})
}

func (h *BannerHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	banner, err := h.bannerUsecase.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if banner == nil {
		http.Error(w, "Banner not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    banner,
	})
}

func (h *BannerHandler) Create(w http.ResponseWriter, r *http.Request) {
	var banner entity.Banner
	if err := json.NewDecoder(r.Body).Decode(&banner); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.bannerUsecase.Create(r.Context(), &banner); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    banner,
		"message": "Banner created successfully",
	})
}

func (h *BannerHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var banner entity.Banner
	if err := json.NewDecoder(r.Body).Decode(&banner); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	banner.ID = id
	if err := h.bannerUsecase.Update(r.Context(), &banner); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    banner,
		"message": "Banner updated successfully",
	})
}

func (h *BannerHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.bannerUsecase.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Banner deleted successfully",
	})
}
