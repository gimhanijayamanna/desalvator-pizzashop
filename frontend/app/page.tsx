'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a2332] text-[#F5F5DC] flex flex-col">
      <Header />

      {/* Hero Section with Frame */}
      <section className="py-8 flex-1">
        <div className="container mx-auto px-4">
          <div className="relative max-w-6xl mx-auto">
            {/* Ornate Frame */}
            <div className="relative bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#8B4513] p-4 rounded-lg shadow-2xl">
              <div className="absolute inset-0 border-4 border-[#D4AF37]/30 rounded-lg"></div>
              <div className="absolute inset-2 border border-[#F5F5DC]/20 rounded-lg"></div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-0 bg-[#2a1810] rounded-lg overflow-hidden relative z-10">
                {/* Image - Takes 3 columns */}
                <div className="relative md:col-span-3 h-64 md:h-96 bg-gradient-to-br from-amber-900 to-red-900">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
                    alt="Authentic Italian Pizza"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content - Takes 2 columns */}
                <div className="md:col-span-2 bg-[#F5F5DC] text-[#1a2332] p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-60" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif text-center mb-3">
                    Pizza Shop
                    <br />
                    <span className="italic">Billing System</span>
                  </h2>

                  <p className="text-center text-sm leading-relaxed mb-6 text-gray-700">
                    Professional billing and inventory management for your pizza shop. Manage menu items and create invoices efficiently.
                  </p>

                  <div className="flex flex-col gap-3">
                    <Link
                      href="/items"
                      className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#1a2332] px-6 py-3 rounded font-semibold transition-colors text-sm w-full text-center"
                    >
                      Manage Items
                    </Link>
                    <Link
                      href="/invoices"
                      className="bg-[#1a2332] hover:bg-[#2a3342] text-[#F5F5DC] px-6 py-3 rounded font-semibold transition-colors text-sm w-full text-center"
                    >
                      Create Invoice
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
