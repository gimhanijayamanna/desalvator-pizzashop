'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-700 bg-[#0F172A] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider">DA SALVATORE</span>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              {pathname.includes('/items') && 'Item Management'}
              {pathname.includes('/invoices') && 'Invoice Management'}
              {pathname === '/' && 'Pizza Shop Billing'}
            </span>
          </Link>

          <div className="flex gap-8 text-sm">
            <Link
              href="/"
              className={`uppercase tracking-wide transition ${pathname === '/'
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-gray-300 hover:text-primary'
                }`}
            >
              HOME
            </Link>
            <Link
              href="/items"
              className={`uppercase tracking-wide transition ${pathname.includes('/items')
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-gray-300 hover:text-primary'
                }`}
            >
              ITEMS
            </Link>
            <Link
              href="/invoices"
              className={`uppercase tracking-wide transition ${pathname.includes('/invoices')
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-gray-300 hover:text-primary'
                }`}
            >
              INVOICES
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
