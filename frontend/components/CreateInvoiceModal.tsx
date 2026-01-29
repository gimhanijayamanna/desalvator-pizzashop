'use client';

import { useState, useEffect } from 'react';
import { itemsApi, invoicesApi } from '@/lib/api';
import { Item } from '@/types';

interface SelectedItem extends Item {
    quantity: number;
}

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateInvoiceModal({ isOpen, onClose, onSuccess }: CreateInvoiceModalProps) {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchItems();
        }
    }, [isOpen]);

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

            // Reset form
            setFormData({ customer_name: '', phone: '' });
            setSelectedItems([]);
            setSearch('');

            onSuccess();
            onClose();
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose}></div>

                <div className="relative bg-[#1a2332] rounded-lg shadow-2xl border border-[#D4AF37]/30 max-w-5xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0f1419] [&::-webkit-scrollbar-thumb]:bg-[#D4AF37] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-[#0f1419] hover:[&::-webkit-scrollbar-thumb]:bg-[#F5F5DC]">
                    <div className="sticky top-0 bg-[#0f1419] border-b-2 border-[#D4AF37]/30 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#F5F5DC]">Create New Invoice</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-[#D4AF37]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Left Column - Customer & Items Selection */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-primary mb-2">Customer Name *</label>
                                    <input
                                        type="text"
                                        value={formData.customer_name}
                                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        className="w-full bg-[#0f1419] text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-primary mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-[#0f1419] text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-primary mb-2">Add Items</label>
                                    <input
                                        type="text"
                                        placeholder="Search items..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-[#0f1419] text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary mb-3"
                                    />

                                    <div className="max-h-64 overflow-y-auto space-y-2 bg-[#0f1419] rounded-lg p-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0a0e14] [&::-webkit-scrollbar-thumb]:bg-[#D4AF37] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#F5F5DC]">
                                        {filteredItems.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-2 hover:bg-dark rounded">
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => addItem(item)}
                                                    className="bg-primary hover:bg-primary-dark text-dark px-4 py-1 rounded text-sm font-bold"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Order Summary */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-primary">Order Summary</h3>

                                {selectedItems.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 bg-[#0f1419] rounded-lg">
                                        No items added yet
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="max-h-80 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0a0e14] [&::-webkit-scrollbar-thumb]:bg-[#D4AF37] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#F5F5DC]">
                                            {selectedItems.map(item => (
                                                <div key={item.id} className="bg-[#0f1419] p-4 rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-gray-400">${item.price.toFixed(2)} each</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-500 hover:text-red-400"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-12 text-center">{item.quantity}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded"
                                                        >
                                                            +
                                                        </button>
                                                        <span className="ml-auto font-bold text-primary">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t-2 border-gray-700 pt-4 space-y-2">
                                            <div className="flex justify-between text-gray-400">
                                                <span>Subtotal:</span>
                                                <span>${calculateSubtotal().toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-400">
                                                <span>Tax (10%):</span>
                                                <span>${calculateTax().toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xl font-bold text-primary">
                                                <span>Total:</span>
                                                <span>${calculateTotal().toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t-2 border-gray-700 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary hover:bg-primary-dark text-dark font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Invoice'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
