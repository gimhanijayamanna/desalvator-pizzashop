import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Item API calls
export const itemsApi = {
  getAll: (search?: string, category?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    return api.get(`/items?${params.toString()}`);
  },
  getById: (id: number) => api.get(`/items/${id}`),
  create: (data: any) => api.post('/items', data),
  update: (id: number, data: any) => api.put(`/items/${id}`, data),
  delete: (id: number) => api.delete(`/items/${id}`),
};

// Invoice API calls
export const invoicesApi = {
  getAll: (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    return api.get(`/invoices?${params.toString()}`);
  },
  getById: (id: number) => api.get(`/invoices/${id}`),
  create: (data: any) => api.post('/invoices', data),
  delete: (id: number) => api.delete(`/invoices/${id}`),
};

export default api;
