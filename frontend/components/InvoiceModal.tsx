'use client';

import { Invoice } from '@/types';

type InvoiceModalProps = {
    invoice: Invoice;
    isOpen: boolean;
    onClose: () => void;
};

export function InvoiceModal({ invoice, isOpen, onClose }: InvoiceModalProps) {
    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto invoice-modal">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
                    {/* Close and Print Buttons - Hide on print */}
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center no-print">
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#1a2332] font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Invoice
                        </button>
                    </div>

                    {/* Invoice Content */}
                    <InvoicePrint invoice={invoice} />
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        @page {
                            size: A4 portrait;
                            margin: 0.5cm;
                        }
                        
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        
                        /* Force white background everywhere */
                        html, body {
                            background: white !important;
                            height: auto !important;
                            min-height: auto !important;
                        }
                        
                        /* Hide header, footer, navigation */
                        header, footer, nav, .sticky {
                            display: none !important;
                        }
                        
                        /* Hide the dark backdrop completely */
                        .fixed {
                            position: static !important;
                            background: transparent !important;
                        }
                        
                        /* Hide all backdrop and overlay elements */
                        .invoice-modal > div:first-child,
                        .bg-black,
                        .bg-opacity-75,
                        [class*="bg-black"],
                        .invoice-modal button,
                        .invoice-modal svg {
                            display: none !important;
                            visibility: hidden !important;
                        }
                        
                        /* Reset modal to normal flow */
                        .invoice-modal {
                            position: static !important;
                            background: white !important;
                            overflow: visible !important;
                            z-index: 1 !important;
                            min-height: auto !important;
                            height: auto !important;
                        }
                        
                        .invoice-modal > div:nth-child(2) {
                            min-height: auto !important;
                            height: auto !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            display: block !important;
                            background: white !important;
                        }
                        
                        .invoice-modal > div:nth-child(2) > div {
                            max-height: none !important;
                            max-width: 100% !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            position: static !important;
                            background: white !important;
                            overflow: visible !important;
                            height: auto !important;
                        }
                        
                        /* Ensure only invoice prints */
                        .print-area {
                            background: white !important;
                        }
                        
                        /* Remove any dark backgrounds */
                        div[class*="bg-"] {
                            background: transparent !important;
                        }
                        
                        .bg-white {
                            background: white !important;
                        }
                    }
                `
            }} />
        </div>
    );
}

type InvoicePrintProps = {
    invoice: Invoice;
};

function InvoicePrint({ invoice }: InvoicePrintProps) {
    return (
        <div className="bg-white text-gray-900">
            <div className="print-area max-w-4xl mx-auto p-2">

                {/* Header */}
                <div className="border-b border-[#D4AF37] pb-2 mb-2">
                    <div className="flex justify-between items-start">
                        <div className="text-center flex-1">
                            <div className="text-[10px] tracking-[0.3em] text-[#8B4513] mb-1">RISTORANTE</div>
                            <h1 className="text-2xl font-serif text-[#1a2332] tracking-wider mb-1">
                                DA SALVATORE
                            </h1>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className="h-px w-8 bg-[#D4AF37]"></div>
                                <div className="text-[10px] tracking-widest text-[#8B4513]">EST. 1987</div>
                                <div className="h-px w-8 bg-[#D4AF37]"></div>
                            </div>
                            <p className="text-[10px] text-gray-600">123 Italian Street, City, State 12345</p>
                            <p className="text-[10px] text-gray-600">Tel: (555) 123-4567 | info@dasalvatore.com</p>
                        </div>
                    </div>

                    <div className="mt-2 text-center">
                        <div className="inline-block border border-[#D4AF37] px-4 py-1">
                            <h2 className="text-lg font-serif text-[#1a2332]">INVOICE</h2>
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="bg-[#F5F5DC] p-2 rounded">
                        <h3 className="font-serif text-xs mb-1 text-[#8B4513] border-b border-[#D4AF37] pb-1">Bill To:</h3>
                        <p className="text-sm font-semibold mb-0.5">{invoice.customer_name}</p>
                        <p className="text-[10px] text-gray-700">Phone: {invoice.phone}</p>
                    </div>
                    <div className="text-right">
                        <div className="space-y-0.5 text-[11px]">
                            <div>
                                <span className="font-serif text-[#8B4513]">Invoice #:</span>{' '}
                                <span className="font-bold">{invoice.invoice_number}</span>
                            </div>
                            <div>
                                <span className="font-serif text-[#8B4513]">Date:</span>{' '}
                                <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="font-serif text-[#8B4513]">Time:</span>{' '}
                                <span>{new Date(invoice.created_at).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-3">
                    <table className="w-full text-[11px]">
                        <thead>
                            <tr className="bg-[#1a2332] text-[#F5F5DC]">
                                <th className="text-left p-1.5 font-serif">#</th>
                                <th className="text-left p-1.5 font-serif">Item Description</th>
                                <th className="text-center p-1.5 font-serif">Qty</th>
                                <th className="text-right p-1.5 font-serif">Unit Price</th>
                                <th className="text-right p-1.5 font-serif">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="p-1.5">{index + 1}</td>
                                    <td className="p-1.5">
                                        <div className="font-serif font-semibold">{item.item_name}</div>
                                    </td>
                                    <td className="p-1.5 text-center font-semibold">{item.quantity}</td>
                                    <td className="p-1.5 text-right">${item.price.toFixed(2)}</td>
                                    <td className="p-1.5 text-right font-semibold">
                                        ${item.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-3">
                    <div className="w-64">
                        <div className="space-y-1 text-[11px]">
                            <div className="flex justify-between py-1 border-b border-gray-300">
                                <span className="font-serif text-gray-700">Subtotal:</span>
                                <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-300">
                                <span className="font-serif text-gray-700">Tax (10%):</span>
                                <span className="font-semibold">${invoice.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#1a2332] px-3 mt-1">
                                <span className="text-sm font-serif font-bold">TOTAL:</span>
                                <span className="text-base font-bold">${invoice.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="mb-3 p-2 bg-[#F5F5DC] rounded">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-serif font-bold text-xs mb-0.5">Payment Status:</h3>
                            <p className="text-[10px] text-gray-600">Method: Cash/Card</p>
                        </div>
                        <div
                            className={`px-3 py-1.5 rounded border text-xs font-bold ${invoice.status.toLowerCase() === 'paid'
                                ? 'bg-green-50 text-green-700 border-green-700'
                                : invoice.status.toLowerCase() === 'pending'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-700'
                                    : 'bg-red-50 text-red-700 border-red-700'
                                }`}
                        >
                            {invoice.status.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#D4AF37] pt-2 mt-3">
                    <div className="text-center space-y-0.5">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="h-px w-8 bg-[#D4AF37]"></div>
                            <svg className="w-4 h-4 text-[#D4AF37]" viewBox="0 0 100 100" fill="currentColor">
                                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
                            </svg>
                            <div className="h-px w-8 bg-[#D4AF37]"></div>
                        </div>
                        <p className="text-sm font-serif text-[#8B4513]">Grazie Mille!</p>
                        <p className="text-xs font-serif text-gray-700">Thank you for your patronage</p>
                        <p className="text-[10px] text-gray-600 italic">
                            &quot;Where every meal is a celebration of authentic Italian tradition&quot;
                        </p>
                        <p className="text-[9px] text-gray-500">
                            Visit us: www.dasalvatore.com | Follow @dasalvatore
                        </p>
                    </div>
                </div>

                {/* Terms */}
                <div className="mt-2 p-2 border border-[#D4AF37]/30 rounded bg-gray-50">
                    <h4 className="font-serif font-bold mb-1 text-[10px] text-[#8B4513]">Terms &amp; Conditions:</h4>
                    <ul className="text-[9px] text-gray-600 space-y-0.5">
                        <li>• All prices include applicable taxes unless otherwise stated.</li>
                        <li>• Please check your order before leaving the premises.</li>
                        <li>• For any inquiries, please contact us within 24 hours of purchase.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
