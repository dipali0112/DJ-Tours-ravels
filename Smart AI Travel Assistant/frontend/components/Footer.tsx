'use client';

import Link from 'next/link';
import { ArrowUp, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');
    const nt = useTranslations('Navbar');

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#f8fbff] pt-32 pb-20 text-[#0f172a] font-sans selection:bg-[#0ea5e9] selection:text-white border-t border-blue-50">
            <div className="max-w-[1800px] mx-auto px-6 lg:px-24">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-16 lg:gap-40 mb-32 text-center lg:text-left">

                    {/* Left Side: Geometric Logo Pattern in Brand Colors */}
                    <div className="grid grid-cols-3 gap-5 w-fit">
                        {/* Row 1 */}
                        <div className="w-10 h-10 bg-[#0f172a]"></div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] rotate-45 scale-[0.7]"></div>
                        <div className="w-10 h-10 bg-[#0f172a]"></div>

                        {/* Row 2 */}
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] rotate-45 scale-[0.7]"></div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] rotate-45 scale-[0.7]"></div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] rotate-45 scale-[0.7]"></div>

                        {/* Row 3 */}
                        <div className="w-10 h-10 bg-[#0f172a]"></div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] rotate-45 scale-[0.7]"></div>
                        <div className="w-10 h-10 bg-[#0f172a]"></div>
                    </div>

                    {/* Middle Section: Brand & Links */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                            {/* Brand Name - Large Serif with Gradient */}
                            <div className="mb-0">
                                <h2 className="text-5xl md:text-6xl font-serif tracking-tight leading-none mb-0 bg-gradient-to-br from-[#0f172a] to-[#0ea5e9] bg-clip-text text-transparent">
                                    DJ Tour & Travels.
                                </h2>
                                <p className="mt-5 text-[#64748b] font-medium tracking-wide text-base max-w-[360px]">{t('description')}</p>
                            </div>

                            {/* Link Columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16 lg:gap-24 text-[#0f172a] w-full md:w-auto">
                                <div>
                                    <h4 className="font-black text-xl mb-10">{nt('about')}</h4>
                                    <ul className="space-y-5 font-medium text-[15px]">
                                        <li><Link href="/about" className="hover:text-[#0ea5e9] transition-colors">Mission</Link></li>
                                        <li><Link href="/team" className="hover:text-[#0ea5e9] transition-colors">Team</Link></li>
                                        <li><Link href="/newsletter" className="hover:text-[#0ea5e9] transition-colors">Newsletter</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-black text-xl mb-10">Support</h4>
                                    <ul className="space-y-5 font-medium text-[15px]">
                                        <li><Link href="/contact" className="hover:text-[#0ea5e9] transition-colors">{nt('contact')}</Link></li>
                                        <li><Link href="/refund" className="hover:text-[#0ea5e9] transition-colors">Refund Policy</Link></li>
                                        <li><Link href="/faq" className="hover:text-[#0ea5e9] transition-colors">FAQ's</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-black text-xl mb-10">Social</h4>
                                    <ul className="space-y-5 font-medium text-[15px]">
                                        <li>
                                            <Link href="https://instagram.com" className="hover:text-[#0ea5e9] transition-colors flex items-center gap-2 group">
                                                Instagram
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="https://linkedin.com" className="hover:text-[#0ea5e9] transition-colors flex items-center gap-2 group">
                                                LinkedIn
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="https://youtube.com" className="hover:text-[#0ea5e9] transition-colors flex items-center gap-2 group">
                                                YouTube
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-blue-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex gap-12 text-[13px] font-semibold text-[#64748b]/80 uppercase tracking-widest">
                            <span>© 2026 DJ Tour & Travels.</span>
                            <Link href="/terms" className="hover:text-[#0ea5e9] transition-colors">Terms of Service</Link>
                        </div>

                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-4 group text-sm font-black uppercase tracking-[0.2em] text-[#0f172a]"
                        >
                            Back to top
                            <div className="w-12 h-12 border border-black/10 rounded-xl flex items-center justify-center bg-white shadow-sm group-hover:bg-[#0f172a] group-hover:text-white transition-all">
                                <ArrowUp className="w-5 h-5" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
