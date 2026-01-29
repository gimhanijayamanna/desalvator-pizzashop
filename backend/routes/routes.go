package routes

import (
	"net/http"
	"pizzashop-backend/controllers"

	"github.com/gorilla/mux"
)

// SetupRoutes configures all API routes
func SetupRoutes() *mux.Router {
	router := mux.NewRouter()

	// Item routes
	router.HandleFunc("/api/items", controllers.GetItems).Methods("GET")
	router.HandleFunc("/api/items/{id}", controllers.GetItem).Methods("GET")
	router.HandleFunc("/api/items", controllers.CreateItem).Methods("POST")
	router.HandleFunc("/api/items/{id}", controllers.UpdateItem).Methods("PUT")
	router.HandleFunc("/api/items/{id}", controllers.DeleteItem).Methods("DELETE")
	
	// Image upload route
	router.HandleFunc("/api/upload", controllers.UploadImage).Methods("POST")

	// Invoice routes
	router.HandleFunc("/api/invoices", controllers.GetInvoices).Methods("GET")
	router.HandleFunc("/api/invoices/{id}", controllers.GetInvoice).Methods("GET")
	router.HandleFunc("/api/invoices", controllers.CreateInvoice).Methods("POST")
	router.HandleFunc("/api/invoices/{id}", controllers.DeleteInvoice).Methods("DELETE")

	// Serve static files (uploaded images)
	router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	return router
}
