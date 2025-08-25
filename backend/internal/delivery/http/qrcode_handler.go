package http

import (
	"arshaka-backend/internal/entity"
	"arshaka-backend/internal/usecase"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type QRCodeHandler struct {
	qrcodeUsecase usecase.QRCodeUsecase
}

func NewQRCodeHandler(qrcodeUsecase usecase.QRCodeUsecase) *QRCodeHandler {
	return &QRCodeHandler{
		qrcodeUsecase: qrcodeUsecase,
	}
}

func (h *QRCodeHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	qrcodes, err := h.qrcodeUsecase.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    qrcodes,
	})
}

func (h *QRCodeHandler) GetEnabled(w http.ResponseWriter, r *http.Request) {
	qrcodes, err := h.qrcodeUsecase.GetEnabled(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Ensure we always return an array, never null
	if qrcodes == nil {
		qrcodes = []entity.QRCode{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    qrcodes,
	})
}

func (h *QRCodeHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	qrcode, err := h.qrcodeUsecase.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if qrcode == nil {
		http.Error(w, "QR Code not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    qrcode,
	})
}

func (h *QRCodeHandler) Create(w http.ResponseWriter, r *http.Request) {
	var qrcode entity.QRCode
	if err := json.NewDecoder(r.Body).Decode(&qrcode); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.qrcodeUsecase.Create(r.Context(), &qrcode); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    qrcode,
		"message": "QR Code created successfully",
	})
}

func (h *QRCodeHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var qrcode entity.QRCode
	if err := json.NewDecoder(r.Body).Decode(&qrcode); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	qrcode.ID = id
	if err := h.qrcodeUsecase.Update(r.Context(), &qrcode); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    qrcode,
		"message": "QR Code updated successfully",
	})
}

func (h *QRCodeHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.qrcodeUsecase.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "QR Code deleted successfully",
	})
}

func (h *QRCodeHandler) ToggleEnable(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.qrcodeUsecase.ToggleEnable(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "QR Code status toggled successfully",
	})
}
