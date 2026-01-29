package models

import "time"

// Item represents a menu item (pizza, beverage, etc.)
type Item struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Category    string    `json:"category"`
	Price       float64   `json:"price"`
	Description string    `json:"description"`
	ImageURL    string    `json:"image_url"`
	IsAvailable bool      `json:"is_available"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateItemRequest represents the request body for creating an item
type CreateItemRequest struct {
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	IsAvailable bool    `json:"is_available"`
}

// UpdateItemRequest represents the request body for updating an item
type UpdateItemRequest struct {
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	IsAvailable bool    `json:"is_available"`
}
