'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { InvoiceModal } from '@/components/InvoiceModal';
import { invoicesApi } from '@/lib/api';
import { Invoice } from '@/types';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoicesApi.getById(Number(params.id));
      setInvoice(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      alert('Failed to load invoice');
      router.push('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/invoices');
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

  return (
    <div className="min-h-screen bg-[#1a2332] text-[#F5F5DC] flex flex-col">
      <Header />
      <Footer />

      {invoice && (
        <InvoiceModal
          invoice={invoice}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
