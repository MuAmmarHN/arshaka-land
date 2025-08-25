package http

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/repository"
	"arshaka-backend/internal/usecase"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type PembinaHandler struct {
	pembinaUsecase usecase.PembinaUsecase
}

func NewPembinaHandler(pembinaUsecase usecase.PembinaUsecase) *PembinaHandler {
	return &PembinaHandler{
		pembinaUsecase: pembinaUsecase,
	}
}

func (h *PembinaHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	pembina, err := h.pembinaUsecase.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    pembina,
	})
}

func (h *PembinaHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	pembina, err := h.pembinaUsecase.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if pembina == nil {
		http.Error(w, "Pembina not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    pembina,
	})
}

func (h *PembinaHandler) Create(w http.ResponseWriter, r *http.Request) {
	var pembina entity.Pembina
	if err := json.NewDecoder(r.Body).Decode(&pembina); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.pembinaUsecase.Create(r.Context(), &pembina); err != nil {
		if err == repository.ErrMaxPembinaReached {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    pembina,
		"message": "Pembina created successfully",
	})
}

func (h *PembinaHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var pembina entity.Pembina
	if err := json.NewDecoder(r.Body).Decode(&pembina); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Debug log
	fmt.Printf("Update handler received data: ID=%d, Nama=%s, NIP=%s\n", id, pembina.Nama, pembina.NIP)

	pembina.ID = id
	if err := h.pembinaUsecase.Update(r.Context(), &pembina); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    pembina,
		"message": "Pembina updated successfully",
	})
}

func (h *PembinaHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.pembinaUsecase.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Pembina deleted successfully",
	})
}
