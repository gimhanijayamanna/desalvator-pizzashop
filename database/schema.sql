-- Da Salvatore Pizza Shop Database Schema
-- Database: pizzashop

-- Create database (run this separately if needed)
-- CREATE DATABASE pizzashop;
-- \c pizzashop;

-- Items table for managing pizza menu items
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table for managing customer bills
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice items table for storing items in each invoice
CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id),
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_is_available ON items(is_available);

-- Insert sample data for testing
INSERT INTO items (name, category, price, description, image_url, is_available) VALUES
('Pepperoni Pizza', 'PIZZA', 15.99, 'Classic pepperoni with mozzarella cheese', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('Margherita Pizza', 'PIZZA', 13.99, 'Fresh tomatoes, basil, and mozzarella', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('Veggie Supreme', 'PIZZA', 14.99, 'Loaded with fresh seasonal vegetables', 'https://images.unsplash.com/photo-1610936935476-8f2e6f96ab7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('BBQ Chicken Pizza', 'PIZZA', 16.99, 'BBQ sauce, grilled chicken, and onions', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('Hawaiian Pizza', 'PIZZA', 14.99, 'Ham, pineapple, and mozzarella', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('Quattro Formaggi', 'PIZZA', 17.99, 'Four cheese blend pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('Meat Lovers Pizza', 'PIZZA', 18.99, 'Pepperoni, sausage, bacon, and ham', 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('Mediterranean Pizza', 'PIZZA', 16.99, 'Olives, feta cheese, tomatoes, and spinach', 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('Soft Drink', 'BEVERAGE', 2.99, 'Assorted soft drinks', 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true),
('French Fries', 'SIDE', 4.99, 'Crispy golden french fries', 'https://images.unsplash.com/photo-1576107232684-1279f390859f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', true);

-- Insert sample invoices for testing
INSERT INTO invoices (invoice_number, customer_name, phone, subtotal, tax, total, status) VALUES
('INV-001', 'John Doe', '555-0123', 41.00, 4.10, 45.05, 'PAID'),
('INV-002', 'Jane Smith', '555-0456', 23.97, 2.40, 26.37, 'PAID');

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, item_id, item_name, quantity, price, total) VALUES
(1, 1, 'Pepperoni Pizza', 2, 15.99, 31.98),
(1, 9, 'Soft Drink', 3, 2.99, 8.97),
(2, 2, 'Margherita Pizza', 1, 13.99, 13.99),
(2, 10, 'French Fries', 2, 4.99, 9.98);
