'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import {
    ArrowRight, MapPin, Sparkles, Star, Clock, Heart,
    Sun, CloudRain, Snowflake, Flower2,
    Search, ChevronDown, Calendar, TrendingUp, X,
    Plane, Compass, Target
} from 'lucide-react';
import { trips } from '@/lib/mockData';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════ */
const seasons = [
    { id: 'All', label: 'All Packages', icon: Sparkles, color: 'bg-teal-500' },
    { id: 'Summer Special', label: 'Summer', icon: Sun, color: 'bg-orange-500' },
    { id: 'Monsoon Special', label: 'Monsoon', icon: CloudRain, color: 'bg-indigo-500' },
    { id: 'Winter Special', label: 'Winter', icon: Snowflake, color: 'bg-sky-500' },
    { id: 'Spring Special', label: 'Spring', icon: Flower2, color: 'bg-emerald-500' },
];

const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
];

/* ═══════════════════════════════════════ */
function PackagesContent() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'en';

    const [searchTerm, setSearchTerm] = useState('');
    const [activeSeason, setActiveSeason] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [likedTrips, setLikedTrips] = useState<Set<string>>(new Set());

    useEffect(() => {
        const search = searchParams.get('search');
        if (search) setSearchTerm(search);
    }, [searchParams]);

    const filteredDestinations = useMemo(() => {
        let results = [...trips].filter(dest => {
            const matchesSearch = dest.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSeason = activeSeason === 'All' || dest.season === activeSeason;
            return matchesSearch && matchesSeason;
        });
        switch (sortBy) {
            case 'price-low': results.sort((a, b) => a.budget - b.budget); break;
            case 'price-high': results.sort((a, b) => b.budget - a.budget); break;
            case 'rating': results.sort((a, b) => b.rating - a.rating); break;
        }
        return results;
    }, [searchTerm, activeSeason, sortBy]);

    const toggleLike = (id: string) => {
        setLikedTrips(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const seasonCounts = useMemo(() => {
        const counts: Record<string, number> = { 'All': trips.length };
        trips.forEach(t => { counts[t.season] = (counts[t.season] || 0) + 1; });
        return counts;
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* ── SECTION 2: WHY CHOOSE US (Image 2 Style) ── */}
            <section className="pt-32 pb-24 overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Overlapping Images */}
                        <div className="relative h-[500px] md:h-[600px]">
                            {/* Plane path animation artifact */}
                            <div className="absolute top-1/4 right-[20%] w-40 h-40 opacity-20 pointer-events-none">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-teal-600">
                                    <path d="M10,80 Q50,10 90,80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                                    <motion.circle r="3" fill="currentColor" animate={{ offsetDistance: ["0%", "100%"] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ motionPath: "path('M10,80 Q50,10 90,80')" }} />
                                </svg>
                                <Plane className="absolute top-0 right-0 w-6 h-6 text-gray-400 -rotate-12 translate-x-1/2 -translate-y-1/2" />
                            </div>

                            {/* Image 1: Main back */}
                            {/* Image 1: Main back */}
                            {/* Image 1: Main back */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="absolute left-0 top-0 w-[75%] h-[75%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10 -rotate-6"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80"
                                    alt="Heritage India"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* Image 2: Overlap front */}
                            <motion.div
                                initial={{ opacity: 0, x: 50, y: 50 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="absolute right-0 bottom-0 w-[65%] h-[65%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20 rotate-12"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80"
                                    alt="Travel Happy"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-teal-600 text-[14px] font-black uppercase tracking-[0.2em] mb-4 block">Our Excellence</span>
                            <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-[1.15] mb-8">
                                Ultimate Luxury <br /> Travel Experiences
                            </h2>
                            <p className="text-gray-500 text-[16px] leading-relaxed mb-10 max-w-xl">
                                Discover handpicked premium vacation packages designed for the modern explorer. From serene spiritual retreats to high-altitude adventures, every journey is a masterpiece.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600 shadow-sm shadow-teal-100">
                                        <Target className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-[19px] font-black text-[#0f172a] mb-1">Tailored Itineraries</h4>
                                        <p className="text-gray-400 text-[14px]">Every package is custom-tuned to offer the perfect balance of adventure and relaxation.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm shadow-blue-100">
                                        <Compass className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-[19px] font-black text-[#0f172a] mb-1">Premium Accommodations</h4>
                                        <p className="text-gray-400 text-[14px]">We partner with the finest hotels and resorts to ensure your stay is as memorable as the view.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: FILTERS (Button Style) ── */}
            <section className="py-12 bg-gray-50/50 border-y border-gray-100">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-wrap items-center gap-3">
                        {seasons.map((s) => {
                            const isActive = activeSeason === s.id;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSeason(s.id)}
                                    className={`px-8 py-3.5 rounded-full text-[15px] font-black transition-all duration-300 border-2 ${isActive
                                        ? `${s.color} text-white border-transparent shadow-lg shadow-${s.color.split('-')[1]}-500/25`
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-teal-200 hover:text-teal-600'
                                        }`}
                                >
                                    {s.label}
                                    <span className={`ml-3 text-[12px] opacity-60 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                        {seasonCounts[s.id] || 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative min-w-[200px]">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="w-full flex items-center justify-between gap-4 px-6 py-3.5 bg-white rounded-2xl border-2 border-gray-100 text-[15px] font-bold text-[#0f172a] hover:border-teal-200 transition-all"
                        >
                            <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-teal-600" /> {sortOptions.find(o => o.id === sortBy)?.label}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortMenu ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {showSortMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-3 bg-white rounded-2xl border-2 border-gray-50 shadow-2xl py-2 z-50 min-w-full overflow-hidden"
                                >
                                    {sortOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                                            className={`w-full text-left px-6 py-3 text-[14px] font-bold transition-colors ${sortBy === opt.id ? 'text-teal-600 bg-teal-50' : 'text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: PACKAGE CARDS (Image 3 Style) ── */}
            <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-16">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-teal-600 text-[14px] font-black uppercase tracking-[0.2em] mb-4 block">Our Destinations</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight">
                            Our Top Location For <br /> You Travel
                        </h2>
                    </div>
                    <Link href={`/${currentLocale}/destinations`} className="px-10 py-4 bg-teal-500 text-white rounded-full font-black text-[15px] hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/20">
                        Explore All
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    {filteredDestinations.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8">
                                <Search className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0f172a] mb-3">No packages found</h3>
                            <p className="text-gray-400 text-[16px] mb-8">Try a different search or filter category</p>
                            <button onClick={() => { setSearchTerm(''); setActiveSeason('All'); }} className="px-10 py-3.5 bg-teal-500 text-white rounded-full font-black text-[15px]">Reset Filters</button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeSeason + sortBy}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {filteredDestinations.map((trip) => (
                                <Link key={trip.id} href={`/${currentLocale}/destinations/${trip.id}`} className="group relative h-[450px] rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                                    <Image
                                        src={trip.image}
                                        alt={trip.destination}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Top Rating Pill */}
                                    <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-[13px] font-black text-white">{trip.rating}</span>
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{trip.destination}</h3>
                                        <div className="flex items-center gap-1.5 text-white/70 text-[14px]">
                                            <MapPin className="w-3.5 h-3.5" /> India
                                        </div>
                                    </div>

                                    {/* Circular Action Button */}
                                    <div className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#0f172a] shadow-xl group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>

                                    {/* Like toggle */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); toggleLike(trip.id); }}
                                        className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${likedTrips.has(trip.id)
                                            ? 'bg-red-500 border-transparent text-white'
                                            : 'bg-white/10 border-white/20 text-white'
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${likedTrips.has(trip.id) ? 'fill-current' : ''}`} />
                                    </button>

                                    {/* Price tag */}
                                    <div className="absolute top-[40%] right-0 translate-x-[calc(100%-40px)] group-hover:translate-x-0 transition-transform duration-500">
                                        <div className="bg-teal-500 py-2 px-5 rounded-l-2xl text-white font-black shadow-xl">
                                            ₹{(trip.budget / 1000).toFixed(0)}k
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ── FOOTER CTA ── */}
            <section className="pb-32">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-[#0f172a] rounded-[48px] p-12 md:p-24 overflow-hidden text-center"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                                Ready to Explore The <br /> <span className="text-teal-400">Natural World?</span>
                            </h2>
                            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                                Join over 50,000+ travelers already exploring the finest destinations in India with DJ Tour & Travels.
                            </p>
                            <Link href={`/${currentLocale}/contact`} className="inline-flex items-center gap-3 px-12 py-5 bg-teal-500 text-white rounded-full font-black text-[18px] hover:bg-teal-600 transition-all shadow-2xl shadow-teal-500/20">
                                Book Your Trip Now <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default function PackagesPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />
            <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                <PackagesContent />
            </Suspense>
        </div>
    );
}