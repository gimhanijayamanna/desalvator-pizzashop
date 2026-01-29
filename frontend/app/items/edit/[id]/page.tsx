'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types';
import axios from 'axios';

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemsApi.getById(Number(params.id));
      const item: Item = response.data;
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        description: item.description,
        image_url: item.image_url,
        is_available: item.is_available,
      });
      // Set existing image as preview if available
      if (item.image_url) {
        setImagePreview(item.image_url.startsWith('http') ? item.image_url : `http://localhost:8080${item.image_url}`);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      alert('Failed to load item');
      router.push('/items');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
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
      setSaving(true);

      let imageUrl = formData.image_url;

      // Upload image if a new one is selected
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

      await itemsApi.update(Number(params.id), {
        ...formData,
        price: parseFloat(formData.price),
        image_url: imageUrl,
      });
      router.push('/items');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2332] text-[#F5F5DC] flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2332] text-[#F5F5DC] flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-dark-light rounded-lg p-8 shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Edit Item</h1>
            <div className="h-1 w-20 bg-primary rounded"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Name */}
            <div>
              <label className="block text-sm text-primary mb-2">Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
                className="w-full bg-dark text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                required
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-primary mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-dark text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                  required
                >
                  <option value="PIZZA">PIZZA</option>
                  <option value="BEVERAGE">BEVERAGE</option>
                  <option value="SIDE">SIDE</option>
                  <option value="DESSERT">DESSERT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-primary mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className="w-full bg-dark text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-primary mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter item description"
                rows={4}
                className="w-full bg-dark text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-primary mb-2">Item Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-dark text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark hover:file:bg-primary-dark"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>

            {/* Availability Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
                className="w-5 h-5 text-primary bg-dark border-gray-600 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="is_available" className="ml-3 text-primary">
                Item Available
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/items"
                className="flex-1 bg-dark-lighter hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary hover:bg-primary-dark text-dark font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Pizza'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
