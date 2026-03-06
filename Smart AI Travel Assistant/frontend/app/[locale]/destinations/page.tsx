'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { MapPin, Star, Search, Filter, Calendar, Clock, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { trips } from '@/lib/mockData';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Beach', 'Mountain', 'Heritage', 'Nature', 'Spiritual', 'Adventure'];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function DestinationsContent() {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Popularity');
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        const search = searchParams.get('search');
        if (search) {
            setSearchTerm(search);
        }
    }, [searchParams]);

    const filteredDestinations = useMemo(() => {
        let result = [...trips].filter(dest => {
            const matchesSearch = dest.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
            return matchesSearch && matchesCategory;
        });

        // Functional Sorting
        if (sortBy === 'Price (Low to High)') {
            result.sort((a, b) => a.budget - b.budget);
        } else if (sortBy === 'Price (High to Low)') {
            result.sort((a, b) => b.budget - a.budget);
        } else if (sortBy === 'Rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [searchTerm, activeCategory, sortBy]);

    return (
        <div className="relative z-20">
            {/* Search & Filter Bar (Glassmorphic & Overlapping) */}
            <div className="max-w-7xl mx-auto px-6 -mt-20 mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_80px_rgba(15,23,42,0.12)] border border-white p-4 md:p-6"
                >
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="relative w-full lg:w-[45%] translate-z-0">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-500" />
                            <input
                                type="text"
                                placeholder="Search destinations, experiences, or states..."
                                className="w-full pl-16 pr-8 py-5 bg-gray-50/50 border-none outline-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:bg-white transition-all text-gray-900 text-base font-medium placeholder:text-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative flex-1 w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-[#0f172a] text-white shadow-2xl shadow-slate-900/40'
                                        : 'bg-white border border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50/30'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                            <div className="sticky right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#0f172a]">Discovery <span className="text-blue-600">Results</span></h2>
                        <p className="text-gray-500 text-base font-medium mt-2">Found {filteredDestinations.length} matching destinations</p>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-100 via-gray-100 to-transparent mx-10 hidden lg:block" />
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Sort by:</span>
                        <div className="relative group">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-3 bg-white/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-slate-100/50 text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                {sortBy}
                                <ChevronDown className={`h-3 w-3 transition-transform duration-500 ${isSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-[60]"
                                            onClick={() => setIsSortOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                            className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 p-2 z-[70] overflow-hidden"
                                        >
                                            {['Popularity', 'Price (Low to High)', 'Price (High to Low)', 'Rating'].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setSortBy(option);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${sortBy === option
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                        : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`${activeCategory}-${searchTerm}-${sortBy}-${filteredDestinations.length}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        {filteredDestinations.length > 0 ? (
                            filteredDestinations.map((trip) => (
                                <motion.div
                                    layout
                                    variants={itemVariants}
                                    key={trip.id}
                                    className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
                                >
                                    <div className="relative h-80 w-full overflow-hidden">
                                        <Image
                                            src={trip.image}
                                            alt={trip.destination}
                                            fill
                                            unoptimized
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-6 left-6 z-10 flex gap-2">
                                            <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[11px] font-black text-[#0f172a] uppercase tracking-widest shadow-sm">
                                                {trip.category}
                                            </div>
                                        </div>
                                        <div className="absolute top-6 right-6 z-10">
                                            <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white shadow-sm border border-white/20">
                                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-bold">{trip.rating}</span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 left-6 z-10">
                                            <div className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-[15px] font-bold shadow-lg">
                                                ₹{trip.budget.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-9">
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <MapPin className="h-3 w-3 text-blue-400" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{trip.destination}, India</span>
                                        </div>
                                        <h3 className="text-[26px] font-black tracking-tight text-[#0f172a] mb-3">{trip.destination}</h3>
                                        <p className="text-gray-500 text-[15px] font-medium leading-relaxed mb-8 line-clamp-2">{trip.description}</p>

                                        <div className="flex items-center gap-4 mb-8 text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4 text-gray-300" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest">5 Days</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4 text-gray-300" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest">Year Round</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/destinations/${trip.id}`}
                                            className="w-full py-4.5 rounded-2xl bg-[#f8fbff] text-[#0f172a] font-bold text-[15px] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all duration-300 group/btn"
                                        >
                                            View Itinerary <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="col-span-full flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200"
                            >
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                                    <Search className="h-10 w-10 text-gray-200" />
                                </div>
                                <h3 className="text-2xl font-black text-[#0f172a] mb-3">No matching destinations found</h3>
                                <p className="text-gray-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                                    We couldn't find anything matching your search. Try different keywords or browse our categories.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(''); setActiveCategory('All'); setSortBy('Popularity'); }}
                                    className="mt-8 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline px-8 py-3 rounded-full hover:bg-blue-50 transition-all"
                                >
                                    Clear all
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}



export default function DestinationsPage() {
    return (
        <div className="min-h-screen bg-[#f8fbff]">
            <Navbar />

            {/* Hero Section - Immersive Cinematic */}
            <div className="relative h-[80vh] w-full overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000"
                        alt="Taj Mahal, India"
                        fill
                        unoptimized
                        className="object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f8fbff] via-transparent to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.4em] text-[12px] mb-8 drop-shadow-lg">
                            <Sparkles className="h-4 w-4" />
                            India Explorer
                        </div>
                        <h1 className="text-6xl md:text-[9.5rem] font-black text-white tracking-tighter leading-[0.85] mb-10 drop-shadow-2xl">
                            Incredible <span className="text-blue-500">India</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                            From the mystic Himalayas to the serene backwaters of Kerala, discover a land of eternal magic and vibrant colors.
                        </p>
                    </motion.div>
                </div>
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Destinations...</p>
                </div>
            }>
                <DestinationsContent />
            </Suspense>
        </div>
    );
}
