import Link from 'next/link';

export default function Header() {
    return (
        <>
            {/* Decorative Top Border */}
            <div className="h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

            {/* Header */}
            <header className="bg-[#0f1419] border-b-2 border-[#D4AF37]/30">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col items-center gap-4">
                        {/* Logo */}
                        <div className="text-center">
                            <div className="text-xs tracking-[0.3em] text-[#D4AF37] mb-2">PIZZERIA</div>
                            <h1 className="text-5xl font-serif text-[#F5F5DC] tracking-wider">
                                DA SALVATORE
                            </h1>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <div className="h-px w-12 bg-[#D4AF37]"></div>
                                <div className="text-xs tracking-widest text-[#D4AF37]">BILLING SYSTEM</div>
                                <div className="h-px w-12 bg-[#D4AF37]"></div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex items-center gap-16 text-base tracking-wider font-serif">
                            <Link href="/" className="text-[#F5F5DC] hover:text-[#D4AF37] transition-colors">
                                HOME
                            </Link>
                            <Link href="/items" className="text-[#F5F5DC] hover:text-[#D4AF37] transition-colors">
                                ITEMS
                            </Link>
                            <Link href="/invoices" className="text-[#F5F5DC] hover:text-[#D4AF37] transition-colors">
                                INVOICES
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
}
