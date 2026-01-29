# Da Salvatore Pizza Shop - Frontend

## Overview
Next.js-based frontend application for the pizza shop billing system with a professional, elegant UI design.

## Tech Stack
- **Framework**: Next.js 14.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Fonts**: Playfair Display (headings), Inter (body)

## Project Structure
```
frontend/
├── app/
│   ├── items/
│   │   ├── create/
│   │   │   └── page.tsx          # Add new item form
│   │   ├── edit/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Edit item form
│   │   └── page.tsx              # Items listing
│   ├── invoices/
│   │   ├── create/
│   │   │   └── page.tsx          # Create invoice form
│   │   ├── [id]/
│   │   │   └── page.tsx          # Invoice detail & print
│   │   └── page.tsx              # Invoices listing
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   └── Navigation.tsx            # Navigation component
├── lib/
│   └── api.ts                    # API client configuration
├── types/
│   └── index.ts                  # TypeScript type definitions
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── next.config.mjs               # Next.js configuration
```

## Features

### Home Page
- Elegant landing page with brand identity
- Quick access to Item Management and Invoice Creation
- Professional footer with contact information

### Item Management
- **View Items**: Grid view of all menu items with images
- **Search**: Real-time search functionality
- **Add Item**: Form to add new pizza/items
- **Edit Item**: Form to update existing items
- **Delete Item**: Confirmation modal for deletion
- **Categories**: Support for PIZZA, BEVERAGE, SIDE, DESSERT
- **Availability Toggle**: Mark items as available/unavailable

### Invoice Management
- **View Invoices**: List of all invoices with details
- **Search**: Search by invoice number, customer name, or phone
- **Create Invoice**: Interactive form with item selection
- **Invoice Details**: Printable invoice view
- **Print**: Professional print layout
- **Delete Invoice**: Confirmation modal for deletion
- **Real-time Calculations**: Auto-calculate subtotal, tax (10%), and total

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Backend API running on port 8080

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment (optional):**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Design System

### Color Palette
- **Primary**: `#D4AF37` (Gold) - Used for CTAs and accents
- **Dark**: `#0F172A` - Main background
- **Dark Light**: `#1E293B` - Cards and containers
- **Dark Lighter**: `#334155` - Hover states

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, readable)

### Components
- **Buttons**: Rounded corners, hover effects, disabled states
- **Forms**: Outlined inputs with focus states
- **Cards**: Elevated with shadows, hover animations
- **Modals**: Centered overlays with blur backdrop

## Pages Overview

### `/` - Home
Landing page with branding and navigation links.

### `/items` - Item Management
- Grid layout of menu items
- Search bar
- Add Item button
- Edit/Delete actions per item

### `/items/create` - Add Item
Form with fields:
- Item Name (required)
- Category (dropdown: PIZZA, BEVERAGE, SIDE, DESSERT)
- Price (required, number)
- Description (textarea)
- Image URL
- Availability checkbox

### `/items/edit/[id]` - Edit Item
Same form as Add Item, pre-filled with existing data.

### `/invoices` - Invoice Management
- List of invoices with expandable details
- Search functionality
- Print button per invoice
- Delete button with confirmation

### `/invoices/create` - Create Invoice
Two-column layout:
- **Left**: Customer info, searchable item list
- **Right**: Selected items with quantity controls, totals

### `/invoices/[id]` - Invoice Detail
Printable invoice with:
- Company branding
- Invoice number and date
- Customer information
- Itemized list
- Subtotal, tax, and total
- Print button (hidden when printing)

## API Integration

The frontend communicates with the backend via REST API:

```typescript
// lib/api.ts
const API_BASE_URL = 'http://localhost:8080/api';

// Items
GET    /items          - Get all items
GET    /items/:id      - Get single item
POST   /items          - Create item
PUT    /items/:id      - Update item
DELETE /items/:id      - Delete item

// Invoices
GET    /invoices       - Get all invoices
GET    /invoices/:id   - Get single invoice
POST   /invoices       - Create invoice
DELETE /invoices/:id   - Delete invoice
```

## Responsive Design

The application is fully responsive:
- **Mobile**: Single column layouts
- **Tablet**: 2-column grids
- **Desktop**: Up to 4-column grids

Breakpoints (Tailwind CSS):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Print Functionality

Invoices have special print styles:
- Hides navigation and action buttons
- Optimizes layout for paper
- Uses print-friendly colors
- Maintained branding

To print: Click "Print" button or use browser's print function (Ctrl+P / Cmd+P)

## Development Tips

### Adding New Pages
1. Create file in `app/[route]/page.tsx`
2. Add `'use client'` if using React hooks
3. Import Navigation component
4. Follow existing layout patterns

### Styling Guidelines
- Use Tailwind utility classes
- Follow established color scheme
- Maintain consistent spacing (p-4, p-6, p-8)
- Use rounded corners (`rounded-lg`)
- Add hover states for interactive elements

### State Management
- Use React hooks (useState, useEffect)
- Fetch data on component mount
- Handle loading and error states
- Show user feedback (alerts, loading spinners)

## Testing

### Manual Testing Checklist
- [ ] Create, edit, delete items
- [ ] Search items
- [ ] Create invoice with multiple items
- [ ] Adjust quantities in invoice
- [ ] Print invoice
- [ ] Delete invoice
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Form validation
- [ ] Error handling

### Browser Compatibility
Tested on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

## Troubleshooting

### API Connection Issues
- Verify backend is running on port 8080
- Check CORS settings in backend
- Ensure NEXT_PUBLIC_API_URL is correct

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Check for TypeScript errors

### Styling Issues
- Clear browser cache
- Check Tailwind CSS compilation
- Verify `globals.css` is imported

## Future Enhancements
- User authentication
- Invoice status updates (Draft, Paid, Cancelled)
- Export invoices to PDF
- Sales analytics dashboard
- Multiple tax rates
- Discount/coupon system
- Customer management
- Email invoice to customers

## License
© 2026 Da Salvatore. All rights reserved.
