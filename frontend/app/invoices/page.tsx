'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateInvoiceModal from '@/components/CreateInvoiceModal';
import { invoicesApi } from '@/lib/api';
import { Invoice } from '@/types';

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [search]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoicesApi.getAll(search);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await invoicesApi.delete(id);
      fetchInvoices();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  const handlePrint = (id: number) => {
    router.push(`/invoices/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
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
              Invoice Management
            </h1>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-dark font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            New Invoice
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search invoices..."
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

        {/* Invoices Count */}
        <div className="mb-4">
          <p className="text-primary text-sm">
            {invoices.length} invoices
          </p>
        </div>

        {/* Invoices List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12 bg-dark-light rounded-lg">
            <p className="text-gray-400">No invoices found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-dark-light rounded-lg p-6 shadow-lg hover:shadow-2xl transition border border-gray-700"
              >
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{invoice.invoice_number}</h3>
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {invoice.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-primary">Customer:</span>
                        <span className="text-white ml-2">{invoice.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-primary">Phone:</span>
                        <span className="text-white ml-2">{invoice.phone}</span>
                      </div>
                      <div>
                        <span className="text-primary">Date:</span>
                        <span className="text-white ml-2">{formatDate(invoice.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-primary">Items:</span>
                        <span className="text-white ml-2">{invoice.items?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="text-right">
                    <div className="text-sm text-primary mb-1">TOTAL AMOUNT</div>
                    <div className="text-3xl font-bold text-primary">
                      ${invoice.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">Tax: ${invoice.tax.toFixed(2)}</div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="border-t border-gray-700 pt-4 mb-4">
                  <div className="space-y-1 text-sm italic text-gray-300">
                    {invoice.items?.map((item, index) => (
                      <div key={index}>
                        {item.item_name} × {item.quantity} = ${item.total.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePrint(invoice.id)}
                    className="flex-1 bg-primary hover:bg-primary-dark text-dark font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(invoice.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-light rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this invoice? This action cannot be undone.
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

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          fetchInvoices();
        }}
      />

      <Footer />
    </div>
  );
}
