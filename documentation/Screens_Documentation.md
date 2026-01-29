# Screen Documentation - Da Salvatore Pizza Shop Billing System

## Overview
This document provides detailed descriptions of all screens in the pizza shop billing system, with annotated explanations of key features and functionalities.

---

## 1. Home Page

**Route**: `/`

### Description
The landing page serves as the entry point to the application, featuring elegant branding and quick access to main functionalities.

### Key Features
- **Company Branding**: "DA SALVATORE" header with professional styling
- **Hero Section**: Two-column layout
  - Left: Visual pizza menu mockup with interactive elements
  - Right: Call-to-action panel with navigation buttons
- **Navigation Bar**: Links to HOME, ITEMS, and INVOICES
- **Footer**: Contact information and quick links

### User Actions
1. Click "Manage Items" to go to item management
2. Click "Create Invoice" to start creating a new invoice
3. Navigate using top menu links

### UI Elements
- Gradient background (dark blue to darker blue)
- Gold/amber accent color (#D4AF37)
- Playfair Display font for headings (elegant serif)
- Inter font for body text (clean sans-serif)

---

## 2. Item Management Page

**Route**: `/items`

### Description
Comprehensive view of all menu items in a grid layout, allowing full CRUD operations.

### Key Features
- **Search Bar**: Real-time filtering of items
- **Add Item Button**: Top-right corner (gold background)
- **Item Cards**: Grid layout (4 columns on desktop)
  - Item image/icon
  - Category badge (top-left)
  - Availability indicator (top-right green checkmark)
  - Item name
  - Description (2-line clamp)
  - Price (large, gold color)
  - Availability status badge
  - Edit and Delete buttons

### User Actions
1. **Search**: Type in search bar to filter items by name/description
2. **Add Item**: Click "+ Add Item" button
3. **Edit Item**: Click "Edit" button on any item card
4. **Delete Item**: Click "Delete" button, confirm in modal

### Item Card Information
- Image: Visual representation or pizza emoji
- Name: Bold, prominent display
- Category: PIZZA, BEVERAGE, SIDE, DESSERT
- Price: Dollar amount with 2 decimal places
- Description: Brief text about the item
- Availability: Available/Unavailable badge

### Delete Confirmation Modal
- Appears when delete is clicked
- Dark overlay background
- Confirmation message
- Cancel and Delete buttons

---

## 3. Add New Item Page

**Route**: `/items/create`

### Description
Form to create a new menu item with all required details.

### Form Fields
1. **Item Name** (required)
   - Text input
   - Placeholder: "Enter item name"

2. **Category** (required)
   - Dropdown select
   - Options: PIZZA, BEVERAGE, SIDE, DESSERT
   - Default: PIZZA

3. **Price ($)** (required)
   - Number input
   - Step: 0.01 (allows cents)
   - Min: 0

4. **Description** (optional)
   - Textarea (4 rows)
   - Placeholder: "Enter item description"

5. **Image URL** (optional)
   - URL input
   - Placeholder: "https://example.com/image.jpg"

6. **Item Available** (optional)
   - Checkbox
   - Default: checked (true)

### User Actions
1. Fill in required fields (Name, Category, Price)
2. Optionally add description and image URL
3. Toggle availability checkbox
4. Click "Add Pizza" to create
5. Click "Cancel" to return without saving

### Validation
- Name, Category, and Price are required
- Price must be a positive number
- URL must be valid format (optional)

---

## 4. Edit Item Page

**Route**: `/items/edit/[id]`

### Description
Form to update an existing menu item, identical layout to Add Item but pre-filled with current data.

### Key Features
- All fields pre-populated with existing item data
- Same validation as Add Item form
- "Update Pizza" button instead of "Add Pizza"

### User Actions
1. Modify any field values
2. Click "Update Pizza" to save changes
3. Click "Cancel" to discard changes

---

## 5. Invoice Management Page

**Route**: `/invoices`

### Description
List view of all invoices with detailed information and action buttons.

### Key Features
- **Search Bar**: Filter by invoice number, customer name, or phone
- **New Invoice Button**: Top-right corner
- **Invoice Count**: Shows total number of invoices
- **Invoice Cards**: Stacked list layout
  - Invoice number with PAID badge
  - Customer name and phone
  - Creation date and time
  - Number of items
  - Total amount (large, gold)
  - Tax amount (small text)
  - Itemized list (italic text)
  - Print and Delete buttons

### Invoice Card Layout
```
┌─────────────────────────────────────────────────────────┐
│ INV-001 [PAID]                         TOTAL AMOUNT     │
│                                        $45.05           │
│ Customer: John Doe        Phone: 555-0123              │
│ Date: 01/29/2026, 10:30:00 AM    Items: 2              │
│ ──────────────────────────────────────────────────     │
│ Pepperoni Pizza × 2 = $31.98                           │
│ Soft Drink × 3 = $8.97                                 │
│ ──────────────────────────────────────────────────     │
│ [Print Button]                      [Delete Button]     │
└─────────────────────────────────────────────────────────┘
```

### User Actions
1. **Search**: Type to filter invoices
2. **View Details**: Click anywhere on invoice card
3. **Print**: Click "Print" button to view printable invoice
4. **Delete**: Click delete icon, confirm in modal
5. **Create New**: Click "+ New Invoice" button

---

## 6. Create New Invoice Page

**Route**: `/invoices/create`

### Description
Two-column interactive form for creating customer invoices with item selection.

### Layout

#### Left Column
1. **Customer Name** (required)
   - Text input
   
2. **Phone Number** (required)
   - Tel input

3. **Search Menu Items**
   - Search bar with icon
   - Filters available items list

4. **Available Items List**
   - Scrollable container (max height)
   - Each item shows:
     - Image/icon
     - Name
     - Category
     - Price
   - Click to add to order

#### Right Column
1. **Selected Items**
   - Shows message if empty: "No items added yet..."
   - For each selected item:
     - Item name
     - Unit price
     - Quantity controls (-, number, +)
     - Line total
     - Remove button (X)

2. **Totals Section**
   - Subtotal
   - Tax (10%)
   - Total (large, gold)

3. **Action Buttons**
   - Cancel (gray)
   - Create Invoice (gold)

### User Flow
1. Enter customer name and phone number
2. Search for items in the search bar
3. Click items from the list to add them
4. Adjust quantities using +/- buttons
5. Remove items with X button if needed
6. Review totals
7. Click "Create Invoice" to save

### Calculations
- Subtotal = Sum of (price × quantity) for all items
- Tax = Subtotal × 10%
- Total = Subtotal + Tax

---

## 7. Invoice Detail & Print Page

**Route**: `/invoices/[id]`

### Description
Professional, printable invoice view with complete transaction details.

### Layout

#### Header Section (Gold Background)
- Company name: "DA SALVATORE"
- Tagline: "PIZZERIA"
- Company description
- Invoice number (large)
- Date and time

#### Customer & Business Info Section
- **Left**: Bill To
  - Customer name
  - Phone number
- **Right**: From
  - Business name
  - Address
  - Phone
  - Email

#### Items Table
| ITEM | QTY | PRICE | TOTAL |
|------|-----|-------|-------|
| Pepperoni Pizza | 2 | $15.99 | $31.98 |
| Soft Drink | 3 | $2.99 | $8.97 |

#### Totals Section (Right-aligned)
- Subtotal: $41.00
- Tax (10%): $4.10
- **TOTAL: $45.05** (large, bold, gold)
- Status badge (PAID, green)

#### Footer
- Thank you message
- Contact information

### User Actions
1. **Print**: Click "Print Invoice" button (hides when printing)
2. **Back**: Click back arrow to return to invoice list

### Print Behavior
- Navigation hidden
- Optimized for paper (A4/Letter)
- Print-friendly colors (white background, black text)
- Professional layout maintained

---

## Navigation Component

### Description
Sticky header navigation present on all pages (except home).

### Elements
- Left: Back arrow + Page title
- Right: Navigation links (HOME, ITEMS, INVOICES)
- Active page underlined with gold

---

## Design Patterns

### Color Scheme
- **Primary Gold**: `#D4AF37` - Buttons, highlights, prices
- **Dark Background**: `#0F172A` - Main background
- **Card Background**: `#1E293B` - Cards, forms
- **Text**: White on dark backgrounds
- **Success**: Green for paid status, availability
- **Danger**: Red for delete actions

### Typography
- **Headings**: Playfair Display (elegant serif)
- **Body**: Inter (clean sans-serif)
- **Sizes**:
  - Page titles: 3xl (30px)
  - Card titles: xl-2xl (20-24px)
  - Body text: base (16px)
  - Small text: sm (14px)

### Interactive Elements
- **Buttons**: Rounded corners, hover effects, disabled states
- **Inputs**: Dark background, gold focus border
- **Cards**: Shadow on hover, scale animation
- **Modals**: Dark overlay (75% opacity), centered content

### Responsive Design
- **Mobile**: Single column, stacked layouts
- **Tablet**: 2-column grids
- **Desktop**: Up to 4-column grids
- Touch-friendly button sizes
- Readable text sizes on all devices

---

## User Experience Features

### Loading States
- Spinner animation while fetching data
- Disabled buttons during form submission

### Error Handling
- Alert messages for errors
- Form validation feedback
- Graceful failure with redirect

### Feedback
- Success messages after actions
- Confirmation modals for destructive actions
- Visual hover states

### Accessibility
- Semantic HTML
- Proper form labels
- Keyboard navigation support
- Focus visible indicators

---

## Screenshots Reference

Based on the provided images, the implementation matches:
1. ✅ Home page with branding and CTA buttons
2. ✅ Item grid with search and add button
3. ✅ Add/Edit item forms with all fields
4. ✅ Invoice list with detailed cards
5. ✅ Create invoice with two-column layout
6. ✅ Printable invoice view

---

## Technical Implementation Notes

### Framework
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Go with Gorilla Mux
- **Database**: PostgreSQL

### State Management
- React hooks (useState, useEffect)
- Real-time calculations
- Form validation

### API Integration
- Axios for HTTP requests
- RESTful endpoints
- Error handling with try-catch

### Print Functionality
- CSS media queries for print
- `window.print()` JavaScript API
- Print-specific styles

---

This documentation covers all screens and features of the Da Salvatore Pizza Shop Billing System, providing a comprehensive guide for understanding the user interface and interactions.
