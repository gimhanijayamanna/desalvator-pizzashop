# Da Salvatore Pizza Shop - Backend

## Overview
Go-based REST API backend for the pizza shop billing system, following MVC architecture.

## Tech Stack
- **Language**: Go 1.21
- **Database**: PostgreSQL
- **Router**: Gorilla Mux
- **CORS**: rs/cors

## Project Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers (Controller layer)
├── models/          # Data models (Model layer)
├── routes/          # API route definitions
├── main.go          # Application entry point
├── go.mod           # Go module dependencies
├── .env.example     # Environment variables template
└── README.md        # This file
```

## Prerequisites
- Go 1.21 or higher
- PostgreSQL 12 or higher
- Database created and schema loaded (see ../database/README.md)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
go mod download
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pizzashop
DB_SSLMODE=disable
SERVER_PORT=8080
```

### 3. Run the Server
```bash
go run main.go
```

The server will start on `http://localhost:8080`

### 4. Build for Production
```bash
go build -o pizzashop-server
./pizzashop-server
```

## API Endpoints

### Items

#### GET /api/items
Get all items with optional filtering
- Query Parameters:
  - `search` (optional): Search by name or description
  - `category` (optional): Filter by category
- Response: `200 OK` with array of items

#### GET /api/items/:id
Get a single item by ID
- Response: `200 OK` with item object or `404 Not Found`

#### POST /api/items
Create a new item
- Request Body:
```json
{
  "name": "Margherita Pizza",
  "category": "PIZZA",
  "price": 13.99,
  "description": "Fresh tomatoes and mozzarella",
  "image_url": "https://example.com/image.jpg",
  "is_available": true
}
```
- Response: `201 Created` with created item

#### PUT /api/items/:id
Update an existing item
- Request Body: Same as POST
- Response: `200 OK` with updated item or `404 Not Found`

#### DELETE /api/items/:id
Delete an item
- Response: `204 No Content` or `404 Not Found`

### Invoices

#### GET /api/invoices
Get all invoices with their items
- Query Parameters:
  - `search` (optional): Search by invoice number, customer name, or phone
- Response: `200 OK` with array of invoices

#### GET /api/invoices/:id
Get a single invoice by ID with its items
- Response: `200 OK` with invoice object or `404 Not Found`

#### POST /api/invoices
Create a new invoice
- Request Body:
```json
{
  "customer_name": "John Doe",
  "phone": "555-0123",
  "items": [
    {
      "item_id": 1,
      "quantity": 2
    },
    {
      "item_id": 9,
      "quantity": 3
    }
  ]
}
```
- Response: `201 Created` with created invoice including calculated totals

#### DELETE /api/invoices/:id
Delete an invoice (cascade deletes invoice items)
- Response: `204 No Content` or `404 Not Found`

## Error Handling
All endpoints return appropriate HTTP status codes:
- `200 OK`: Successful GET/PUT
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Testing with cURL

### Get all items
```bash
curl http://localhost:8080/api/items
```

### Create an item
```bash
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Pizza","category":"PIZZA","price":15.99,"description":"Test","image_url":"","is_available":true}'
```

### Create an invoice
```bash
curl -X POST http://localhost:8080/api/invoices \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"John Doe","phone":"555-0123","items":[{"item_id":1,"quantity":2}]}'
```

## Development Notes
- Tax is calculated at 10% in the CreateInvoice controller
- Invoice numbers are auto-generated in format: INV-001, INV-002, etc.
- Foreign key constraints ensure data integrity
- CORS is enabled for frontend access
- All timestamps are in UTC

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in .env file
- Ensure database exists and schema is loaded

### Port Already in Use
- Change SERVER_PORT in .env file
- Kill existing process: `lsof -ti:8080 | xargs kill`

### CORS Errors
- Verify frontend URL in main.go cors.AllowedOrigins
- Check browser console for specific CORS errors
