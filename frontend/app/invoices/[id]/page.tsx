'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { invoicesApi } from '@/lib/api';
import { Invoice } from '@/types';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoicesApi.getById(Number(params.id));
      setInvoice(response.data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      alert('Failed to load invoice');
      router.push('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2332] text-[#F5F5DC] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a2332] text-[#F5F5DC] flex flex-col">
      <Header />

      {/* Navigation - Hide on print */}
      <div className="no-print border-b border-gray-700 bg-[#0F172A]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/invoices" className="text-gray-400 hover:text-white transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Invoices
          </Link>
          <button
            onClick={handlePrint}
            className="bg-primary hover:bg-primary-dark text-dark font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white text-black rounded-lg shadow-2xl overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                  DA SALVATORE
                </h1>
                <p className="text-sm opacity-90">PIZZERIA</p>
                <p className="text-sm mt-4">
                  Professional billing and management system<br />
                  for pizza shops. Est. 1987.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90 mb-1">INVOICE</div>
                <div className="text-3xl font-bold">{invoice.invoice_number}</div>
                <div className="mt-4 text-sm">
                  <div>{formatDate(invoice.created_at)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Business Info */}
          <div className="grid grid-cols-2 gap-8 p-8 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-amber-800 mb-3">BILL TO:</h3>
              <div className="space-y-1">
                <div className="font-bold text-lg">{invoice.customer_name}</div>
                <div className="text-gray-600">Phone: {invoice.phone}</div>
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-amber-800 mb-3">FROM:</h3>
              <div className="space-y-1">
                <div className="font-bold">Da Salvatore Pizzeria</div>
                <div className="text-gray-600">123 Pizza Street</div>
                <div className="text-gray-600">Phone: +1 (555) 123-4567</div>
                <div className="text-gray-600">info@dasalvatore.com</div>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-amber-800">
                  <th className="text-left py-3 font-bold text-amber-800">ITEM</th>
                  <th className="text-center py-3 font-bold text-amber-800">QTY</th>
                  <th className="text-right py-3 font-bold text-amber-800">PRICE</th>
                  <th className="text-right py-3 font-bold text-amber-800">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4">
                      <div className="font-medium">{item.item_name}</div>
                    </td>
                    <td className="text-center py-4">{item.quantity}</td>
                    <td className="text-right py-4">${item.price.toFixed(2)}</td>
                    <td className="text-right py-4 font-medium">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 pb-8">
            <div className="flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-amber-800 pt-3">
                  <div className="flex justify-between text-2xl font-bold">
                    <span className="text-amber-800">TOTAL:</span>
                    <span className="text-amber-800">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {invoice.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-6 text-center text-sm text-gray-600">
            <p className="mb-2">Thank you for your business!</p>
            <p>For questions about this invoice, please contact us at info@dasalvatore.com</p>
          </div>
        </div>
      </main>

      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}
