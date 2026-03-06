'use client';

import {
    Search, MapPin, Calendar, Heart, Bookmark,
    ArrowRight, Sparkles, Map, Users, Plane
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trips } from '@/lib/mockData';
import { useTranslations } from 'next-intl';

const SLIDES = [
    {
        id: "s-001",
        title: "KERALA",
        location: "Southern India",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=80",
        thumb: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "s-002",
        title: "LADAKH",
        location: "Himalayan Highlands",
        image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2000&q=80",
        thumb: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "s-003",
        title: "GOA",
        location: "Coastal Paradise",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80",
        thumb: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "s-005",
        title: "JAIPUR",
        location: "The Pink City",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2000&q=80",
        thumb: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80"
    }
];

export default function HeroSection() {
    const t = useTranslations('HeroSection');
    const [activeIndex, setActiveIndex] = useState(0);
    const [heroSearchQuery, setHeroSearchQuery] = useState("");
    const router = useRouter();

    const handleHeroSearch = () => {
        if (heroSearchQuery.trim()) {
            const query = heroSearchQuery.trim().toLowerCase();

            // Try to find exact match in mock data
            const matchedTrip = trips.find(trip =>
                trip.destination.toLowerCase() === query ||
                trip.id.toLowerCase() === query
            );

            if (matchedTrip) {
                router.push(`/destinations/${matchedTrip.id}`);
            } else {
                // Fallback to destinations page with search param
                router.push(`/destinations?search=${encodeURIComponent(heroSearchQuery)}`);
            }
        }
    };

    // Preload images to avoid white flash
    useEffect(() => {
        SLIDES.forEach(slide => {
            const img = new window.Image();
            img.src = slide.image;
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % SLIDES.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-gradient-to-bottom from-[#f8fbff] to-[#e6f2ff]">

            {/* STATIC-MOUNTED BACKGROUND SLIDER (z-index 0) */}
            <div className="absolute inset-0 z-0">
                {SLIDES.map((slide, i) => (
                    <div
                        key={slide.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                            activeIndex === i ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                        style={{
                            backfaceVisibility: 'hidden',
                            willChange: 'opacity'
                        }}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={i === 0}
                        />
                    </div>
                ))}

                {/* Subtle shadow overlay only for text legibility (no white washout) */}
                <div className="absolute inset-0 z-20 bg-black/10"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center justify-between pt-24 pb-32">

                {/* Hero Text Content (z-index 10) */}
                <div className="w-full lg:w-3/5 space-y-10 text-left z-10">
                    <div className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-[0.4em] text-[13px] drop-shadow-md">
                        <MapPin className="h-5 w-5" />
                        {SLIDES[activeIndex].location}
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-[3.5rem] sm:text-6xl md:text-[8rem] font-black tracking-[-0.04em] text-white leading-[0.9] drop-shadow-2xl">
                            {SLIDES[activeIndex].title}
                        </h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link href="/destinations" className="group px-12 py-5 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-500/20 flex items-center gap-4 w-fit">
                            {t('explore')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </motion.div>
                </div>

                {/* Floating Overlapping Cards (z-index 20) */}
                <div className="absolute right-0 lg:right-20 top-1/2 -translate-y-1/2 w-fit h-[500px] hidden lg:flex items-center z-20">
                    <div className="relative w-full h-full min-w-[400px]">
                        {SLIDES.map((slide, i) => {
                            const offset = (i - activeIndex + SLIDES.length) % SLIDES.length;
                            // Pre-render only 3 cards to keep stack clean
                            if (offset > 2) return null;

                            return (
                                <motion.div
                                    key={slide.id}
                                    initial={false}
                                    animate={{
                                        x: offset * 100, // Explicit offset for bigger cards
                                        scale: 1 - offset * 0.1, // Slight scaling for depth
                                        opacity: 1 - offset * 0.2,
                                        zIndex: 30 - offset,
                                    }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className={cn(
                                        "absolute left-0 w-72 h-[420px] rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white group cursor-pointer border border-white/40",
                                        offset === 0 ? "cursor-default" : ""
                                    )}
                                    onClick={() => offset !== 0 && setActiveIndex(i)}
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={slide.thumb}
                                            alt={slide.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Card Header Content */}
                                        <div className="absolute top-6 right-6 z-30">
                                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/40 transition-colors">
                                                <Bookmark className="h-4 w-4" />
                                            </div>
                                        </div>

                                        {/* Bottom Info Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>

                                        <div className="absolute top-6 left-6 z-10">
                                            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-sm mb-0.5">{slide.title}</h2>
                                            <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest">{slide.location}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation Indicator (z-index 30) */}
            <div className="absolute right-12 bottom-12 z-30 flex items-center gap-6">
                <span className="text-white font-black text-4xl">0{activeIndex + 1}</span>
                <div className="flex gap-3">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={cn(
                                "h-1 rounded-full transition-all duration-500",
                                activeIndex === i ? "w-12 bg-[#0ea5e9]" : "w-4 bg-[#0f172a]/10 hover:bg-[#0f172a]/20"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Glassmorphic Search Bar (Overlapping Bottom - z-index 30) */}
            <div className="absolute bottom-12 left-12 z-30">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-blue-100 shadow-[0_20px_40px_rgba(15,23,42,0.1)] p-3 flex items-center gap-3"
                >
                    <div className="flex items-center gap-5 px-6 border-r border-gray-100">
                        <Map className="h-6 w-6 text-[#0ea5e9]" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{t('whereTo')}</span>
                            <input
                                type="text"
                                value={heroSearchQuery}
                                onChange={(e) => setHeroSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleHeroSearch();
                                    }
                                }}
                                placeholder={t('searchPlaceholder')}
                                className="bg-transparent border-none outline-none text-[#0f172a] font-bold text-base placeholder:text-gray-500 w-52 md:w-64 focus:ring-0"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleHeroSearch}
                        className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] p-5 rounded-full text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center"
                    >
                        <Search className="h-6 w-6" />
                    </button>
                </motion.div>
            </div>

        </section>
    );
}
