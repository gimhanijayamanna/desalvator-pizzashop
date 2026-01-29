export interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id?: number;
  invoice_id?: number;
  item_id: number;
  item_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  phone: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
}

export interface CreateInvoiceRequest {
  customer_name: string;
  phone: string;
  items: {
    item_id: number;
    quantity: number;
  }[];
}
