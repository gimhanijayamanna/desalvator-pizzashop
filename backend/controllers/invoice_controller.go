package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"pizzashop-backend/config"
	"pizzashop-backend/models"

	"github.com/gorilla/mux"
)

// GetInvoices retrieves all invoices with their items
func GetInvoices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	search := r.URL.Query().Get("search")

	query := `SELECT id, invoice_number, customer_name, phone, subtotal, tax, total, status, created_at, updated_at 
	          FROM invoices WHERE 1=1`
	args := []interface{}{}
	argCount := 1

	if search != "" {
		query += fmt.Sprintf(" AND (invoice_number ILIKE $%d OR customer_name ILIKE $%d OR phone ILIKE $%d)", 
			argCount, argCount, argCount)
		args = append(args, "%"+search+"%")
		argCount++
	}

	query += " ORDER BY created_at DESC"

	rows, err := config.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	invoices := []models.Invoice{}
	for rows.Next() {
		var invoice models.Invoice
		err := rows.Scan(
			&invoice.ID,
			&invoice.InvoiceNumber,
			&invoice.CustomerName,
			&invoice.Phone,
			&invoice.Subtotal,
			&invoice.Tax,
			&invoice.Total,
			&invoice.Status,
			&invoice.CreatedAt,
			&invoice.UpdatedAt,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Get items for this invoice
		itemsQuery := `SELECT id, invoice_id, item_id, item_name, quantity, price, total 
		               FROM invoice_items WHERE invoice_id = $1`
		itemRows, err := config.DB.Query(itemsQuery, invoice.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		items := []models.InvoiceItem{}
		for itemRows.Next() {
			var item models.InvoiceItem
			err := itemRows.Scan(
				&item.ID,
				&item.InvoiceID,
				&item.ItemID,
				&item.ItemName,
				&item.Quantity,
				&item.Price,
				&item.Total,
			)
			if err != nil {
				itemRows.Close()
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			items = append(items, item)
		}
		itemRows.Close()

		invoice.Items = items
		invoices = append(invoices, invoice)
	}

	json.NewEncoder(w).Encode(invoices)
}

// GetInvoice retrieves a single invoice by ID with its items
func GetInvoice(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	var invoice models.Invoice
	query := `SELECT id, invoice_number, customer_name, phone, subtotal, tax, total, status, created_at, updated_at 
	          FROM invoices WHERE id = $1`

	err := config.DB.QueryRow(query, id).Scan(
		&invoice.ID,
		&invoice.InvoiceNumber,
		&invoice.CustomerName,
		&invoice.Phone,
		&invoice.Subtotal,
		&invoice.Tax,
		&invoice.Total,
		&invoice.Status,
		&invoice.CreatedAt,
		&invoice.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Invoice not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get items for this invoice
	itemsQuery := `SELECT id, invoice_id, item_id, item_name, quantity, price, total 
	               FROM invoice_items WHERE invoice_id = $1`
	itemRows, err := config.DB.Query(itemsQuery, invoice.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer itemRows.Close()

	items := []models.InvoiceItem{}
	for itemRows.Next() {
		var item models.InvoiceItem
		err := itemRows.Scan(
			&item.ID,
			&item.InvoiceID,
			&item.ItemID,
			&item.ItemName,
			&item.Quantity,
			&item.Price,
			&item.Total,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	invoice.Items = items
	json.NewEncoder(w).Encode(invoice)
}

// CreateInvoice creates a new invoice with items
func CreateInvoice(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req models.CreateInvoiceRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validation
	if req.CustomerName == "" || req.Phone == "" || len(req.Items) == 0 {
		http.Error(w, "Invalid input: customer name, phone, and items are required", http.StatusBadRequest)
		return
	}

	// Start transaction
	tx, err := config.DB.Begin()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Generate invoice number
	var maxInvoiceNum int
	err = tx.QueryRow("SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) FROM invoices WHERE invoice_number LIKE 'INV-%'").Scan(&maxInvoiceNum)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	invoiceNumber := fmt.Sprintf("INV-%03d", maxInvoiceNum+1)

	// Calculate totals
	var subtotal float64
	invoiceItems := []models.InvoiceItem{}

	for _, reqItem := range req.Items {
		var item models.Item
		err := tx.QueryRow("SELECT id, name, price FROM items WHERE id = $1", reqItem.ItemID).Scan(
			&item.ID,
			&item.Name,
			&item.Price,
		)
		if err != nil {
			http.Error(w, fmt.Sprintf("Item not found: %d", reqItem.ItemID), http.StatusBadRequest)
			return
		}

		itemTotal := item.Price * float64(reqItem.Quantity)
		subtotal += itemTotal

		invoiceItems = append(invoiceItems, models.InvoiceItem{
			ItemID:   item.ID,
			ItemName: item.Name,
			Quantity: reqItem.Quantity,
			Price:    item.Price,
			Total:    itemTotal,
		})
	}

	tax := subtotal * 0.10 // 10% tax
	total := subtotal + tax

	// Insert invoice
	var invoice models.Invoice
	invoiceQuery := `INSERT INTO invoices (invoice_number, customer_name, phone, subtotal, tax, total, status) 
	                 VALUES ($1, $2, $3, $4, $5, $6, $7) 
	                 RETURNING id, invoice_number, customer_name, phone, subtotal, tax, total, status, created_at, updated_at`

	err = tx.QueryRow(
		invoiceQuery,
		invoiceNumber,
		req.CustomerName,
		req.Phone,
		subtotal,
		tax,
		total,
		"PAID",
	).Scan(
		&invoice.ID,
		&invoice.InvoiceNumber,
		&invoice.CustomerName,
		&invoice.Phone,
		&invoice.Subtotal,
		&invoice.Tax,
		&invoice.Total,
		&invoice.Status,
		&invoice.CreatedAt,
		&invoice.UpdatedAt,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert invoice items
	itemQuery := `INSERT INTO invoice_items (invoice_id, item_id, item_name, quantity, price, total) 
	              VALUES ($1, $2, $3, $4, $5, $6)`

	for _, item := range invoiceItems {
		_, err := tx.Exec(
			itemQuery,
			invoice.ID,
			item.ItemID,
			item.ItemName,
			item.Quantity,
			item.Price,
			item.Total,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Commit transaction
	err = tx.Commit()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	invoice.Items = invoiceItems
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(invoice)
}

// DeleteInvoice deletes an invoice and its items (cascade)
func DeleteInvoice(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	result, err := config.DB.Exec("DELETE FROM invoices WHERE id = $1", id)
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
		http.Error(w, "Invoice not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
