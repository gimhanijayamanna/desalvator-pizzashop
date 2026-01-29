'use client';

import { useState } from 'react';
import axios from 'axios';
import { itemsApi } from '@/lib/api';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddItemModal({ isOpen, onClose, onSuccess }: AddItemModalProps) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        category: 'PIZZA',
        price: '',
        description: '',
        image_url: '',
        is_available: true,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.category || !formData.price) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            let imageUrl = formData.image_url;

            if (imageFile) {
                const formDataUpload = new FormData();
                formDataUpload.append('image', imageFile);

                const uploadResponse = await axios.post('http://localhost:8080/api/upload', formDataUpload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                imageUrl = uploadResponse.data.image_url;
            }

            await itemsApi.create({
                ...formData,
                price: parseFloat(formData.price),
                image_url: imageUrl,
            });

            // Reset form
            setFormData({
                name: '',
                category: 'PIZZA',
                price: '',
                description: '',
                image_url: '',
                is_available: true,
            });
            setImageFile(null);
            setImagePreview('');

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating item:', error);
            alert('Failed to create item');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose}></div>

                <div className="relative bg-[#1a2332] rounded-lg shadow-2xl border border-[#D4AF37]/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0f1419] [&::-webkit-scrollbar-thumb]:bg-[#D4AF37] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-[#0f1419] hover:[&::-webkit-scrollbar-thumb]:bg-[#F5F5DC]">
                    <div className="sticky top-0 bg-[#0f1419] border-b-2 border-[#D4AF37]/30 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#F5F5DC]">Add New Item</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-[#D4AF37]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm text-primary mb-2">Item Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#0f1419] text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-primary mb-2">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f1419] text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                >
                                    <option value="PIZZA">PIZZA</option>
                                    <option value="BEVERAGE">BEVERAGE</option>
                                    <option value="SIDE">SIDE</option>
                                    <option value="DESSERT">DESSERT</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-primary mb-2">Price ($) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className="w-full bg-[#0f1419] text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-primary mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-[#0f1419] text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-primary mb-2">Item Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full bg-[#0f1419] text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-dark hover:file:bg-primary-dark"
                            />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="mt-4 w-full max-w-xs h-48 object-cover rounded-lg" />
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_available"
                                name="is_available"
                                checked={formData.is_available}
                                onChange={handleChange}
                                className="w-5 h-5 text-primary bg-dark border-gray-600 rounded"
                            />
                            <label htmlFor="is_available" className="ml-3 text-primary">Item Available</label>
                        </div>

                        <div className="flex gap-4 pt-4">
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
                                {loading ? 'Adding...' : 'Add Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
