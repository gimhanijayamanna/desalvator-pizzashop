# Da Salvatore Pizza Shop - Billing System

## Project Overview

A full-stack web application for managing pizza shop operations, including menu items and customer invoicing. Built with modern technologies following best practices and MVC architecture.

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Go (Golang) with MVC pattern
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS

## Project Structure

```
pizza-shop/
├── backend/                 # Go backend (MVC)
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── main.go             # Application entry
│   ├── go.mod              # Go dependencies
│   └── README.md           # Backend documentation
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   │   ├── items/         # Item management pages
│   │   ├── invoices/      # Invoice management pages
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   ├── lib/               # API client & utilities
│   ├── types/             # TypeScript definitions
│   ├── package.json       # Node dependencies
│   └── README.md          # Frontend documentation
├── database/              # Database files
│   ├── schema.sql         # Database schema
│   └── README.md          # Database documentation
└── documentation/         # Project documentation
    ├── Database_Structure.md
    └── Screens_Documentation.md
```

## Features

### Item Management
- Create, Read, Update, Delete (CRUD) menu items
- Search and filter items
- Category management (Pizza, Beverage, Side, Dessert)
- Availability toggle
- Image URL support

### Invoice Management
- Create customer invoices
- Select multiple items with quantities
- Automatic calculation (subtotal, tax, total)
- Invoice listing and search
- Professional printable invoices
- Delete invoices

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Elegant dark theme with gold accents
- Real-time search
- Loading states
- Confirmation modals
- Print-optimized invoice view

## Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 12+

### 1. Database Setup

```bash
# Create database
createdb pizzashop

# Run schema
psql -d pizzashop -f database/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
go mod download

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run server
go run main.go
```

Backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start on `http://localhost:3000`

### 4. Access the Application

Open your browser to `http://localhost:3000`

## Documentation

Detailed documentation available in:

1. **[Backend README](backend/README.md)**
   - API endpoints
   - Go project structure
   - Database connection
   - Testing examples

2. **[Frontend README](frontend/README.md)**
   - Component structure
   - Routing
   - API integration
   - Styling guidelines

3. **[Database Documentation](database/README.md)**
   - Schema details
   - Table relationships
   - Setup instructions
   - Query examples

4. **[Screens Documentation](documentation/Screens_Documentation.md)**
   - Detailed screen descriptions
   - User flows
   - UI/UX patterns

5. **[Database Structure](documentation/Database_Structure.md)**
   - ERD diagram
   - Field descriptions
   - Relationships

## API Endpoints

### Items
```
GET    /api/items          - Get all items
GET    /api/items/:id      - Get single item
POST   /api/items          - Create item
PUT    /api/items/:id      - Update item
DELETE /api/items/:id      - Delete item
```

### Invoices
```
GET    /api/invoices       - Get all invoices
GET    /api/invoices/:id   - Get single invoice
POST   /api/invoices       - Create invoice
DELETE /api/invoices/:id   - Delete invoice
```

## Database Schema

### Tables

**items**
- id, name, category, price, description
- image_url, is_available
- created_at, updated_at

**invoices**
- id, invoice_number, customer_name, phone
- subtotal, tax, total, status
- created_at, updated_at

**invoice_items**
- id, invoice_id, item_id
- item_name, quantity, price, total

## Design System

### Colors
- Primary: `#D4AF37` (Gold)
- Dark: `#0F172A`
- Dark Light: `#1E293B`
- Success: Green
- Danger: Red

### Fonts
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

## Technologies Used

### Backend
- Go 1.21
- Gorilla Mux (routing)
- lib/pq (PostgreSQL driver)
- godotenv (environment variables)
- rs/cors (CORS middleware)

### Frontend
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- Axios (HTTP client)

### Database
- PostgreSQL 12+

## Testing

### Backend Testing
```bash
cd backend

# Test items endpoint
curl http://localhost:8080/api/items

# Test creating item
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Pizza","category":"PIZZA","price":15.99,"is_available":true}'
```

### Frontend Testing
- Navigate through all pages
- Test CRUD operations
- Verify responsive design
- Test print functionality

## Project Deliverables

**Database Structure Document**
- Available in `database/README.md`
- Detailed table schemas
- Relationships diagram
**Screens and Functionalities**
- Item Management (List, Add, Edit, Delete)
- Invoice Management (List, Create, View, Print, Delete)
- Responsive design implemented

**Invoice Printing**
- Professional print layout
- Company branding included
- Optimized for paper

**Documentation**
- README files for all components
- Screen documentation with descriptions
- Database structure explained

**Code Submission**
- Clean, organized code
- TypeScript for type safety
- Go following MVC pattern
- Comments where needed

## Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pizzashop
DB_SSLMODE=disable
SERVER_PORT=8080
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Deployment

### Backend
```bash
cd backend
go build -o pizzashop-server
./pizzashop-server
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Security Considerations

- Environment variables for sensitive data
- Input validation on frontend and backend
- SQL injection prevention (parameterized queries)
- CORS configuration for API access
- Form validation

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check .env credentials
- Ensure database exists

### API Connection Error
- Verify backend is running on port 8080
- Check CORS settings
- Verify API URL in frontend

### Build Errors
- Clear node_modules and reinstall
- Delete .next folder
- Run `go mod tidy` for Go dependencies

## Future Enhancements

- User authentication and authorization
- Sales analytics dashboard
- Multi-currency support
- PDF export for invoices
- Email invoice to customers
- Inventory management
- Customer management system
- Order status tracking

## Support

For questions or issues:
- Check documentation in respective directories
- Review error logs
- Ensure all dependencies are installed
- Verify database schema is loaded

## License

© 2026 Da Salvatore. All rights reserved.

---

## Summary

This project demonstrates:
- Full-stack development with Go and Next.js
- RESTful API design
- PostgreSQL database design
- Responsive UI/UX
- MVC architecture pattern
- TypeScript for type safety
- Professional documentation
- Print functionality
- Real-time calculations
- CRUD operations

Built with attention to code quality, user experience, and best practices.
