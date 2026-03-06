'use client';

import { ArrowRight, Sparkles, Globe, Target, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function StatsSection() {
    const t = useTranslations('StatsSection');

    const stats = [
        { value: '1000+', label: t('destinations'), icon: Globe },
        { value: '4.8/5', label: t('rating'), icon: Target },
        { value: '24/7', label: t('support'), icon: Zap },
    ];

    const highlights = [
        {
            id: "ind-004",
            country: "Varanasi",
            userName: "Putri",
            rating: 5,
            testimonial: "Spiritual and amazing experience! Sunrise and boats were absolutely stunning.",
            image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: "ind-007",
            country: "Ladakh",
            userName: "Ahmad Fauzi",
            rating: 5,
            testimonial: "Ladakh was incredible and guides were so helpful! Highly recommended!!",
            image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: "ind-015",
            country: "Kerala",
            userName: "Alya Rahman",
            rating: 5,
            testimonial: "Breathtaking backwaters and amazing guides. Truly unforgettable!",
            image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: "ind-003",
            country: "Rajasthan",
            userName: "Rizky Aditya",
            rating: 5,
            testimonial: "Majestic forts and royal treatment. Every moment was magical!",
            image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: "ind-001",
            country: "Goa",
            userName: "Siti Nurhaliza",
            rating: 5,
            testimonial: "Perfect beach vibe and vibrant night markets. Loved every bit of it!",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: "ind-011",
            country: "Agra",
            userName: "Arjun Mehta",
            rating: 5,
            testimonial: "The Taj Mahal at sunrise is a dream. Perfectly organized trip!",
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1000",
        }
    ];

    return (
        <section className="relative pt-32 pb-10 bg-[#f8fbff] text-[#0f172a] overflow-hidden">

            {/* Mesh Gradient Background Blobs */}
            <div className="absolute inset-0 z-0 opacity-40">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-100 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-cyan-50 rounded-full blur-[120px]"
                />
            </div>

            <div className="max-w-[1800px] mx-auto px-12 lg:px-24 relative z-10">

                {/* Header & Stats - Expanded for larger fanned cards */}
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-32 gap-12 text-center lg:text-left px-4 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
                            <Sparkles className="h-3 w-3" />
                            {t('presence')}
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-[1.0] mb-10">
                            {t('titleMain')} <br />
                            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">{t('titleSub')}</span>
                        </h2>
                        <p className="text-[#64748b] text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mt-8">
                            {t('description')}
                        </p>
                    </motion.div>

                    <div className="flex items-center justify-center lg:justify-end gap-10 sm:gap-14">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group min-w-[170px]"
                            >
                                <stat.icon className="h-6 w-6 text-[#0ea5e9] mb-4 mx-auto lg:mx-0 group-hover:scale-110 transition-transform" />
                                <div className="text-3xl font-black tracking-tight mb-1 text-[#0f172a]">{stat.value}</div>
                                <div className="text-[10px] font-black text-[#64748b]/60 uppercase tracking-[0.2em]">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Highlight Cards - Expanded Symmetrical Fanned Layout (SINGLE ROW, FULL WIDTH) */}
                <div className="flex flex-nowrap justify-center items-center mt-32 relative px-4 lg:px-10 pb-10 overflow-visible">
                    {highlights.map((item, idx) => {
                        // Symmetrical rotation logic like the reference image
                        // For 6 items: -12, -7, -2, 2, 7, 12 deg for wider spread
                        const rotations = [-12, -7, -2, 2, 7, 12];
                        const rotation = rotations[idx];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 120, rotate: 0 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    rotate: rotation,
                                    x: (idx - 2.5) * -30 // Reduced overlap to create "spaces" between cards
                                }}
                                whileHover={{
                                    rotate: 0,
                                    scale: 1.15,
                                    zIndex: 100,
                                    y: -60,
                                    transition: { duration: 0.3, type: "spring", stiffness: 300 }
                                }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="relative w-[320px] h-[450px] bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] overflow-hidden cursor-pointer border border-white group flex-shrink-0"
                            >
                                <Link href={`/destinations/${item.id}`} className="flex flex-col h-full">
                                    {/* Top Image Area */}
                                    <div className="h-[220px] w-full relative overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.userName}
                                            fill
                                            unoptimized
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute top-6 left-6 bg-black/20 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-full">
                                            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{item.country}</span>
                                        </div>
                                    </div>

                                    {/* Review Content Area */}
                                    <div className="p-8 flex flex-col flex-1 bg-white relative">
                                        {/* Star Rating Row */}
                                        <div className="flex gap-2 mb-3">
                                            {[...Array(item.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            ))}
                                        </div>

                                        {/* User Info */}
                                        <h4 className="text-lg font-bold text-[#0f172a] mb-2">{item.userName}</h4>

                                        {/* Testimonial Text */}
                                        <p className="text-sm text-[#64748b] font-medium leading-relaxed">
                                            "{item.testimonial}"
                                        </p>

                                        {/* Bottom Arrow Micro-interaction */}
                                        <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-full bg-[#0ea5e9] flex items-center justify-center shadow-xl shadow-sky-500/40">
                                                <ArrowRight className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
