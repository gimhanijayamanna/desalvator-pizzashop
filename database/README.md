# Database Structure Documentation

## Overview
This document provides a comprehensive overview of the database structure for the Da Salvatore Pizza Shop Billing System.

## Database Name
**pizzashop**

## Tables

### 1. items
Stores information about menu items (pizzas, beverages, sides, etc.)

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for each item |
| name | VARCHAR(255) | NOT NULL | Name of the item |
| category | VARCHAR(100) | NOT NULL | Category (e.g., PIZZA, BEVERAGE, SIDE) |
| price | DECIMAL(10, 2) | NOT NULL | Price of the item |
| description | TEXT | - | Detailed description of the item |
| image_url | TEXT | - | URL to the item's image |
| is_available | BOOLEAN | DEFAULT true | Availability status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record update timestamp |

**Indexes:**
- `idx_items_category` on `category`
- `idx_items_is_available` on `is_available`

---

### 2. invoices
Stores customer invoice/bill information

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for each invoice |
| invoice_number | VARCHAR(50) | UNIQUE, NOT NULL | Invoice number (e.g., INV-001) |
| customer_name | VARCHAR(255) | NOT NULL | Name of the customer |
| phone | VARCHAR(20) | NOT NULL | Customer's phone number |
| subtotal | DECIMAL(10, 2) | NOT NULL | Subtotal amount before tax |
| tax | DECIMAL(10, 2) | NOT NULL | Tax amount |
| total | DECIMAL(10, 2) | NOT NULL | Total amount including tax |
| status | VARCHAR(20) | DEFAULT 'PAID' | Invoice status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Invoice creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Invoice update timestamp |

**Indexes:**
- `idx_invoices_invoice_number` on `invoice_number`
- `idx_invoices_created_at` on `created_at`

---

### 3. invoice_items
Stores individual items within each invoice

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for each invoice item |
| invoice_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to invoices table |
| item_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to items table |
| item_name | VARCHAR(255) | NOT NULL | Name of the item (snapshot) |
| quantity | INTEGER | NOT NULL | Quantity ordered |
| price | DECIMAL(10, 2) | NOT NULL | Price per unit at time of order |
| total | DECIMAL(10, 2) | NOT NULL | Total for this line item |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Foreign Keys:**
- `invoice_id` references `invoices(id)` ON DELETE CASCADE
- `item_id` references `items(id)`

**Indexes:**
- `idx_invoice_items_invoice_id` on `invoice_id`

---

## Relationships

```
items (1) ----< (many) invoice_items
                          |
                          |
invoices (1) ----< (many) invoice_items
```

1. **One-to-Many**: An item can appear in multiple invoice items
2. **One-to-Many**: An invoice can have multiple invoice items
3. **Cascade Delete**: When an invoice is deleted, all associated invoice_items are automatically deleted

---

## Database Setup Instructions

### Prerequisites
- PostgreSQL 12 or higher installed
- Database user with CREATE DATABASE privileges

### Setup Steps

1. **Create the database:**
   ```sql
   CREATE DATABASE pizzashop;
   ```

2. **Connect to the database:**
   ```bash
   psql -U postgres -d pizzashop
   ```
   or
   ```sql
   \c pizzashop
   ```

3. **Run the schema file:**
   ```bash
   psql -U postgres -d pizzashop -f schema.sql
   ```

4. **Verify the tables:**
   ```sql
   \dt
   ```

### Sample Data
The schema includes sample data for testing:
- 10 menu items (8 pizzas, 1 beverage, 1 side)
- 2 sample invoices
- Associated invoice items

---

## Backup Instructions

### Create Backup
```bash
pg_dump -U postgres -d pizzashop -f pizzashop_backup.sql
```

### Restore from Backup
```bash
psql -U postgres -d pizzashop -f pizzashop_backup.sql
```

---

## Query Examples

### Get all available items
```sql
SELECT * FROM items WHERE is_available = true ORDER BY category, name;
```

### Get invoice with items
```sql
SELECT 
    i.invoice_number,
    i.customer_name,
    i.phone,
    i.total,
    i.created_at,
    json_agg(
        json_build_object(
            'name', ii.item_name,
            'quantity', ii.quantity,
            'price', ii.price,
            'total', ii.total
        )
    ) as items
FROM invoices i
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
WHERE i.id = 1
GROUP BY i.id;
```

### Get total sales by category
```sql
SELECT 
    i.category,
    COUNT(*) as items_sold,
    SUM(ii.total) as total_revenue
FROM invoice_items ii
JOIN items i ON ii.item_id = i.id
GROUP BY i.category
ORDER BY total_revenue DESC;
```

---

## Maintenance

### Update modified timestamp trigger (optional)
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Notes
- All monetary values are stored with 2 decimal precision
- Tax rate is calculated at 10% in the application layer
- Invoice numbers follow the format: INV-XXX
- Timestamps are stored in UTC
- Foreign key constraints ensure data integrity
