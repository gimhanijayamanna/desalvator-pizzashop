'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { itemsApi, invoicesApi } from '@/lib/api';
import { Item } from '@/types';

interface SelectedItem extends Item {
  quantity: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemsApi.getAll();
      setItems(response.data.filter((item: Item) => item.is_available));
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = (item: Item) => {
    const existing = selectedItems.find(i => i.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter(i => i.id !== id));
    } else {
      setSelectedItems(selectedItems.map(i =>
        i.id === id ? { ...i, quantity } : i
      ));
    }
  };

  const removeItem = (id: number) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };

  const calculateSubtotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.10;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.phone) {
      alert('Please enter customer name and phone number');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      setLoading(true);
      await invoicesApi.create({
        customer_name: formData.customer_name,
        phone: formData.phone,
        items: selectedItems.map(item => ({
          item_id: item.id,
          quantity: item.quantity,
        })),
      });
      router.push('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a2332] text-[#F5F5DC] flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-dark-light rounded-lg p-8 shadow-2xl border border-gray-700">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create New Invoice</h1>
              <div className="h-1 w-20 bg-primary rounded"></div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Customer & Items */}
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <label className="block text-sm text-primary mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="Enter customer name"
                      className="w-full bg-dark text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-primary mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="w-full bg-dark text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  {/* Search Menu Items */}
                  <div>
                    <label className="block text-sm text-primary mb-2">Search Menu Items</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search items..."
                        className="w-full bg-dark text-white border border-gray-600 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:border-primary"
                      />
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Available Items */}
                  <div className="bg-dark rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => addItem(item)}
                          className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg hover:bg-gray-700 cursor-pointer transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-2xl">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                '🍕'
                              )}
                            </div>
                            <div>
                              <div className="font-bold">{item.name}</div>
                              <div className="text-xs text-gray-400">{item.category}</div>
                            </div>
                          </div>
                          <div className="text-primary font-bold">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Selected Items & Total */}
                <div className="space-y-6">
                  {/* Selected Items */}
                  <div>
                    <label className="block text-sm text-primary mb-2">Selected Items</label>
                    <div className="bg-dark rounded-lg p-4 min-h-[300px]">
                      {selectedItems.length === 0 ? (
                        <div className="text-center text-gray-400 italic py-8">
                          No items added yet. Click on items to add them.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-sm text-gray-400">
                                  ${item.price.toFixed(2)} each
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-dark rounded-lg">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-3 py-1 hover:bg-gray-700 rounded-l-lg transition"
                                  >
                                    -
                                  </button>
                                  <span className="px-3">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-3 py-1 hover:bg-gray-700 rounded-r-lg transition"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="text-primary font-bold w-20 text-right">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-400 transition"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-dark rounded-lg p-6 space-y-3">
                    <div className="flex justify-between text-lg">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Tax (10%):</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-3">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total:</span>
                        <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <Link
                      href="/invoices"
                      className="flex-1 bg-dark-lighter hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition text-center"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading || selectedItems.length === 0}
                      className="flex-1 bg-primary hover:bg-primary-dark text-dark font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating...' : 'Create Invoice'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
