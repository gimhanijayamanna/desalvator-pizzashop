package models

import "time"

// Invoice represents a customer invoice/bill
type Invoice struct {
	ID            int       `json:"id"`
	InvoiceNumber string    `json:"invoice_number"`
	CustomerName  string    `json:"customer_name"`
	Phone         string    `json:"phone"`
	Subtotal      float64   `json:"subtotal"`
	Tax           float64   `json:"tax"`
	Total         float64   `json:"total"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Items         []InvoiceItem `json:"items,omitempty"`
}

// InvoiceItem represents an item within an invoice
type InvoiceItem struct {
	ID        int     `json:"id"`
	InvoiceID int     `json:"invoice_id"`
	ItemID    int     `json:"item_id"`
	ItemName  string  `json:"item_name"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
	Total     float64 `json:"total"`
}

// CreateInvoiceRequest represents the request body for creating an invoice
type CreateInvoiceRequest struct {
	CustomerName string                  `json:"customer_name"`
	Phone        string                  `json:"phone"`
	Items        []CreateInvoiceItemRequest `json:"items"`
}

// CreateInvoiceItemRequest represents an item in the create invoice request
type CreateInvoiceItemRequest struct {
	ItemID   int `json:"item_id"`
	Quantity int `json:"quantity"`
}
