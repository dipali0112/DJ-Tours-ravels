'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function DestinationsSection() {
    const t = useTranslations('Destinations');
    const gridDestinations = [
        {
            id: "ind-001",
            title: "Goa Beaches",
            price: "₹15,000",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: "ind-002",
            title: "Manali Peaks",
            price: "₹12,000",
            image: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: "ind-003",
            title: "Jaipur Palace",
            price: "₹18,000",
            image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: "ind-004",
            title: "Varanasi Ghats",
            price: "₹10,000",
            image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1000&q=80"
        }
    ];

    return (
        <section className="py-32 bg-gradient-to-b from-[#e6f2ff] to-white text-[#0f172a] border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">

                {/* Cinematic Header */}
                <div className="text-center mb-24 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/5 border border-[#0ea5e9]/10 px-4 py-2 rounded-full mb-8">
                        <Sparkles className="h-3 w-3 text-[#0ea5e9]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0ea5e9]">{t('topChoices')}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] mb-8">
                        {t('curated')} <br />
                        <span className="text-[#0f172a]/10">{t('destinations')}.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Featured Large Card */}
                    <Link href="/destinations" className="relative h-[650px] rounded-[3rem] overflow-hidden group border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] block bg-white">
                        <Image
                            src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80"
                            alt="Featured"
                            fill
                            unoptimized
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        <div className="absolute bottom-16 left-16 right-16 z-10">
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-8 leading-[0.85] tracking-tighter">
                                PRIVATE <br />KASHMIR <br /> TRAILS.
                            </h3>
                            <div className="flex items-center gap-6">
                                <span className="text-2xl font-black text-white">{t('starts')} ₹24,999</span>
                                <div className="h-[1px] flex-1 bg-white/20"></div>
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                    <ArrowUpRight className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Secondary Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {gridDestinations.map((dest, idx) => (
                            <Link key={idx} href={`/destinations`} className="relative h-[309px] rounded-[2.5rem] overflow-hidden group border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] block bg-white">
                                <Image
                                    src={dest.image}
                                    alt={dest.title}
                                    fill
                                    unoptimized
                                    className="object-cover transition-all duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-10">
                                    <div>
                                        <h4 className="font-black text-white text-base tracking-tighter mb-2">{dest.title}</h4>
                                        <p className="text-[#38bdf8] text-[10px] font-black uppercase tracking-widest">{dest.price}</p>
                                    </div>
                                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white group-hover:bg-[#0ea5e9] transition-all">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
