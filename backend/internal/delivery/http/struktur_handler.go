package http

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/usecase"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type StrukturHandler struct {
	strukturUsecase usecase.StrukturUsecase
}

func NewStrukturHandler(strukturUsecase usecase.StrukturUsecase) *StrukturHandler {
	return &StrukturHandler{
		strukturUsecase: strukturUsecase,
	}
}

func (h *StrukturHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	struktur, err := h.strukturUsecase.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    struktur,
	})
}

func (h *StrukturHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	struktur, err := h.strukturUsecase.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if struktur == nil {
		http.Error(w, "Struktur not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    struktur,
	})
}

func (h *StrukturHandler) Create(w http.ResponseWriter, r *http.Request) {
	var struktur entity.Struktur
	if err := json.NewDecoder(r.Body).Decode(&struktur); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.strukturUsecase.Create(r.Context(), &struktur); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    struktur,
		"message": "Struktur created successfully",
	})
}

func (h *StrukturHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var struktur entity.Struktur
	if err := json.NewDecoder(r.Body).Decode(&struktur); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Debug log
	fmt.Printf("Update handler received data: ID=%d, Nama=%s, NRA=%s\n", id, struktur.Nama, struktur.NRA)

	struktur.ID = id
	if err := h.strukturUsecase.Update(r.Context(), &struktur); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    struktur,
		"message": "Struktur updated successfully",
	})
}

func (h *StrukturHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.strukturUsecase.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Struktur deleted successfully",
	})
}
