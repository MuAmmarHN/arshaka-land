package http

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/usecase"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type KegiatanHandler struct {
	kegiatanUsecase usecase.KegiatanUsecase
}

func NewKegiatanHandler(kegiatanUsecase usecase.KegiatanUsecase) *KegiatanHandler {
	return &KegiatanHandler{
		kegiatanUsecase: kegiatanUsecase,
	}
}

func (h *KegiatanHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	log.Printf("GetAll kegiatan request received")
	kegiatan, err := h.kegiatanUsecase.GetAll(r.Context())
	if err != nil {
		log.Printf("Error getting kegiatan: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("Found %d kegiatan", len(kegiatan))
	for i, k := range kegiatan {
		log.Printf("Kegiatan %d: ID=%d, Judul=%s, Fotos=%d", i, k.ID, k.Judul, len(k.Fotos))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    kegiatan,
	})
}

func (h *KegiatanHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	kegiatan, err := h.kegiatanUsecase.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if kegiatan == nil {
		http.Error(w, "Kegiatan not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    kegiatan,
	})
}

func (h *KegiatanHandler) Create(w http.ResponseWriter, r *http.Request) {
	var kegiatan entity.Kegiatan
	if err := json.NewDecoder(r.Body).Decode(&kegiatan); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.kegiatanUsecase.Create(r.Context(), &kegiatan); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    kegiatan,
		"message": "Kegiatan created successfully",
	})
}

func (h *KegiatanHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var kegiatan entity.Kegiatan
	if err := json.NewDecoder(r.Body).Decode(&kegiatan); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	kegiatan.ID = id
	if err := h.kegiatanUsecase.Update(r.Context(), &kegiatan); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    kegiatan,
		"message": "Kegiatan updated successfully",
	})
}

func (h *KegiatanHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.kegiatanUsecase.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Kegiatan deleted successfully",
	})
}
