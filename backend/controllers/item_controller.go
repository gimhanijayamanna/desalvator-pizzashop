package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"pizzashop-backend/config"
	"pizzashop-backend/models"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

// GetItems retrieves all items
func GetItems(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	search := r.URL.Query().Get("search")
	category := r.URL.Query().Get("category")

	query := `SELECT id, name, category, price, description, image_url, is_available, created_at, updated_at 
	          FROM items WHERE 1=1`
	args := []interface{}{}
	argCount := 1

	if search != "" {
		query += fmt.Sprintf(" AND (name ILIKE $%d OR description ILIKE $%d)", argCount, argCount)
		args = append(args, "%"+search+"%")
		argCount++
	}

	if category != "" {
		query += fmt.Sprintf(" AND category = $%d", argCount)
		args = append(args, category)
		argCount++
	}

	query += " ORDER BY category, name"

	rows, err := config.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	items := []models.Item{}
	for rows.Next() {
		var item models.Item
		err := rows.Scan(
			&item.ID,
			&item.Name,
			&item.Category,
			&item.Price,
			&item.Description,
			&item.ImageURL,
			&item.IsAvailable,
			&item.CreatedAt,
			&item.UpdatedAt,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	json.NewEncoder(w).Encode(items)
}

// GetItem retrieves a single item by ID
func GetItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	var item models.Item
	query := `SELECT id, name, category, price, description, image_url, is_available, created_at, updated_at 
	          FROM items WHERE id = $1`

	err := config.DB.QueryRow(query, id).Scan(
		&item.ID,
		&item.Name,
		&item.Category,
		&item.Price,
		&item.Description,
		&item.ImageURL,
		&item.IsAvailable,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(item)
}

// UploadImage handles image upload
func UploadImage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Parse multipart form with 10MB max memory
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Get file from form
	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to get image: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Validate file type
	ext := strings.ToLower(filepath.Ext(handler.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" && ext != ".webp" {
		http.Error(w, "Invalid file type. Only jpg, jpeg, png, gif, and webp are allowed", http.StatusBadRequest)
		return
	}

	// Create uploads directory if it doesn't exist
	uploadsDir := "./uploads"
	if err := os.MkdirAll(uploadsDir, os.ModePerm); err != nil {
		http.Error(w, "Failed to create uploads directory: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Generate unique filename
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), handler.Filename)
	filePath := filepath.Join(uploadsDir, filename)

	// Create file on disk
	dst, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Failed to create file: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy uploaded file to destination
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Failed to save file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the file path
	response := map[string]string{
		"image_url": "/uploads/" + filename,
	}
	json.NewEncoder(w).Encode(response)
}

// CreateItem creates a new item
func CreateItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req models.CreateItemRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validation
	if req.Name == "" || req.Category == "" || req.Price <= 0 {
		http.Error(w, "Invalid input: name, category, and price are required", http.StatusBadRequest)
		return
	}

	var item models.Item
	query := `INSERT INTO items (name, category, price, description, image_url, is_available) 
	          VALUES ($1, $2, $3, $4, $5, $6) 
	          RETURNING id, name, category, price, description, image_url, is_available, created_at, updated_at`

	err = config.DB.QueryRow(
		query,
		req.Name,
		req.Category,
		req.Price,
		req.Description,
		req.ImageURL,
		req.IsAvailable,
	).Scan(
		&item.ID,
		&item.Name,
		&item.Category,
		&item.Price,
		&item.Description,
		&item.ImageURL,
		&item.IsAvailable,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(item)
}

// UpdateItem updates an existing item
func UpdateItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	var req models.UpdateItemRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validation
	if req.Name == "" || req.Category == "" || req.Price <= 0 {
		http.Error(w, "Invalid input: name, category, and price are required", http.StatusBadRequest)
		return
	}

	var item models.Item
	query := `UPDATE items 
	          SET name = $1, category = $2, price = $3, description = $4, image_url = $5, 
	              is_available = $6, updated_at = CURRENT_TIMESTAMP 
	          WHERE id = $7 
	          RETURNING id, name, category, price, description, image_url, is_available, created_at, updated_at`

	err = config.DB.QueryRow(
		query,
		req.Name,
		req.Category,
		req.Price,
		req.Description,
		req.ImageURL,
		req.IsAvailable,
		id,
	).Scan(
		&item.ID,
		&item.Name,
		&item.Category,
		&item.Price,
		&item.Description,
		&item.ImageURL,
		&item.IsAvailable,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(item)
}

// DeleteItem deletes an item
func DeleteItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	result, err := config.DB.Exec("DELETE FROM items WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
