'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddItemModal from '@/components/AddItemModal';
import EditItemModal from '@/components/EditItemModal';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types';

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<number | null>(null);

  useEffect(() => {
    fetchItems();
  }, [search]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemsApi.getAll(search);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await itemsApi.delete(id);
      fetchItems();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2332] text-[#F5F5DC] flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              Item Management
            </h1>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-dark font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Item
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search pizzas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-light text-white border border-gray-600 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:border-primary"
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

        {/* Items Count */}
        <div className="mb-4">
          <p className="text-primary text-sm">
            Showing {items.length} items
          </p>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-dark-light rounded-lg">
            <p className="text-gray-400">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-dark-light rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition group"
              >
                {/* Item Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:8080${item.image_url}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🍕
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.category}
                  </div>

                  {/* Availability Badge */}
                  {item.is_available && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {item.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary text-xl font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${item.is_available ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setItemToEdit(item.id);
                        setEditModalOpen(true);
                      }}
                      className="flex-1 bg-primary hover:bg-primary-dark text-dark font-bold py-2 px-4 rounded transition text-center text-sm flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition text-sm flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-light rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          fetchItems();
        }}
      />

      {/* Edit Item Modal */}
      {itemToEdit && (
        <EditItemModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setItemToEdit(null);
          }}
          onSuccess={() => {
            fetchItems();
          }}
          itemId={itemToEdit}
        />
      )}

      <Footer />
    </div>
  );
}
