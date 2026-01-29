import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0a0d12] py-8">
            <div className="container mx-auto px-5">
                <div className="grid md:grid-cols-3 gap-24 max-w-6xl mx-auto mb-6">
                    <div>
                        <h3 className="text-xl font-serif text-[#D4AF37] mb-4">DA SALVATORE</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Professional billing and management system<br />
                            for pizza shops. Est. 1987.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif text-[#F5F5DC] mb-4">Quick Links</h4>
                        <div className="space-y-3 text-sm text-gray-400">
                            <Link href="/" className="block hover:text-[#D4AF37] transition-colors">
                                Home
                            </Link>
                            <Link href="/items" className="block hover:text-[#D4AF37] transition-colors">
                                Item Management
                            </Link>
                            <Link href="/invoices" className="block hover:text-[#D4AF37] transition-colors">
                                Invoice Management
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif text-[#F5F5DC] mb-4">Contact</h4>
                        <div className="space-y-3 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>info@dasalvatore.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>123 Pizza Street</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center border-t border-gray-700 pt-6">
                    <p className="text-xs text-gray-500">© 2026 Da Salvatore Billing System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
