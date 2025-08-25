package http

import (
	"encoding/json"
	"net/http"
	"strconv"

	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/usecase"

	"github.com/gorilla/mux"
)

type KegiatanPhotoHandler struct {
	kegiatanPhotoUsecase usecase.KegiatanPhotoUsecase
}

func NewKegiatanPhotoHandler(kegiatanPhotoUsecase usecase.KegiatanPhotoUsecase) *KegiatanPhotoHandler {
	return &KegiatanPhotoHandler{
		kegiatanPhotoUsecase: kegiatanPhotoUsecase,
	}
}

func (h *KegiatanPhotoHandler) GetByKegiatanID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	kegiatanID, err := strconv.Atoi(vars["kegiatan_id"])
	if err != nil {
		http.Error(w, "Invalid kegiatan ID", http.StatusBadRequest)
		return
	}

	photos, err := h.kegiatanPhotoUsecase.GetByKegiatanID(r.Context(), kegiatanID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    photos,
	})
}

func (h *KegiatanPhotoHandler) Create(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	kegiatanID, err := strconv.Atoi(vars["kegiatan_id"])
	if err != nil {
		http.Error(w, "Invalid kegiatan ID", http.StatusBadRequest)
		return
	}

	var req struct {
		ImageURL  string `json:"image_url"`
		Caption   string `json:"caption"`
		SortOrder int    `json:"sort_order"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	photo := &entity.KegiatanFoto{
		KegiatanID: kegiatanID,
		ImageURL:   req.ImageURL,
		Caption:    req.Caption,
		SortOrder:  req.SortOrder,
	}

	err = h.kegiatanPhotoUsecase.Create(r.Context(), photo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    photo,
		"message": "Photo created successfully",
	})
}

func (h *KegiatanPhotoHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	photoID, err := strconv.Atoi(vars["photo_id"])
	if err != nil {
		http.Error(w, "Invalid photo ID", http.StatusBadRequest)
		return
	}

	var req struct {
		ImageURL  string `json:"image_url"`
		Caption   string `json:"caption"`
		SortOrder int    `json:"sort_order"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	photo := &entity.KegiatanFoto{
		ID:        photoID,
		ImageURL:  req.ImageURL,
		Caption:   req.Caption,
		SortOrder: req.SortOrder,
	}

	err = h.kegiatanPhotoUsecase.Update(r.Context(), photo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    photo,
		"message": "Photo updated successfully",
	})
}

func (h *KegiatanPhotoHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	photoID, err := strconv.Atoi(vars["photo_id"])
	if err != nil {
		http.Error(w, "Invalid photo ID", http.StatusBadRequest)
		return
	}

	err = h.kegiatanPhotoUsecase.Delete(r.Context(), photoID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Photo deleted successfully",
	})
}

func (h *KegiatanPhotoHandler) UpdateSortOrder(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Photos []struct {
			ID        int `json:"id"`
			SortOrder int `json:"sort_order"`
		} `json:"photos"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.kegiatanPhotoUsecase.UpdateSortOrder(r.Context(), req.Photos)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Sort order updated successfully",
	})
}
