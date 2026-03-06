'use client';

import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Wallet, MapPin, ArrowRight, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const CATEGORIES = ['All', 'Beach', 'Mountain', 'Heritage', 'Nature', 'Spiritual', 'Adventure'];

const isMonthInBestTime = (monthName: string, bestTimeStr: string) => {
    if (!monthName || monthName === 'All') return true;
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const targetIdx = months.indexOf(monthName.toLowerCase());
    if (targetIdx === -1) return false;

    const rangeMatch = bestTimeStr.match(/([A-Za-z]+)\s*(?:to|-)\s*([A-Za-z]+)/i);
    if (rangeMatch) {
        const startIdx = months.indexOf(rangeMatch[1].toLowerCase());
        const endIdx = months.indexOf(rangeMatch[2].toLowerCase());

        if (startIdx !== -1 && endIdx !== -1) {
            if (startIdx <= endIdx) {
                return targetIdx >= startIdx && targetIdx <= endIdx;
            } else {
                return targetIdx >= startIdx || targetIdx <= endIdx;
            }
        }
    }

    return bestTimeStr.toLowerCase().includes(monthName.toLowerCase());
};

export default function SmartRecommendations() {
    const t = useTranslations('Recommendations');
    const [selectedMonth, setSelectedMonth] = useState<string>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    // ... (rest of translation implementation)
    const [budget, setBudget] = useState<number>(50000);
    const [destinations, setDestinations] = useState<any[]>([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await axios.get('https://dj-tours-ravels-production.up.railway.app/api/destinations');
                setDestinations(res.data);
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            }
        };
        fetchDestinations();
    }, []);

    const filteredTrips = useMemo(() => {
        return destinations.filter(dest => {
            const matchesCategory = selectedCategory === 'All' ||
                dest.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                dest.travelType?.toLowerCase() === selectedCategory.toLowerCase();

            const destPrice = parseInt(dest.price.replace(/[^\d]/g, ''));
            const matchesBudget = destPrice <= budget;
            const matchesMonth = isMonthInBestTime(selectedMonth, dest.bestTimeToVisit);

            return matchesCategory && matchesBudget && matchesMonth;
        });
    }, [selectedMonth, selectedCategory, budget, destinations]);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xl"
                    >
                        <div className="inline-flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
                            <Sparkles className="h-3 w-3" />
                            {t('scouting')}
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-[#0f172a] mb-4">
                            {t('titleMain')} <span className="text-blue-600">{t('titleSub')}</span> {t('titleEnd')}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            {t('description')}
                        </p>
                    </motion.div>

                    {/* Month Picker */}
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> {t('when')}
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                            <button
                                onClick={() => setSelectedMonth('All')}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedMonth === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {t('anytime')}
                            </button>
                            {/* Current + next 3 months shortcuts */}
                            {MONTHS.slice(new Date().getMonth(), new Date().getMonth() + 4).map(month => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(month)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedMonth === month ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {month}
                                </button>
                            ))}
                            <select
                                className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-xs font-bold outline-none cursor-pointer hover:bg-gray-200 transition-colors"
                                value={selectedMonth !== 'All' && !MONTHS.slice(new Date().getMonth(), new Date().getMonth() + 4).includes(selectedMonth) ? selectedMonth : 'More'}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="More" disabled>{t('more')}</option>
                                {MONTHS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-center">
                    {/* Category Filter */}
                    <div className="lg:col-span-7 flex flex-wrap gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                    ? 'bg-[#0f172a] text-white shadow-xl shadow-slate-900/20'
                                    : 'bg-white border border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-500'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Budget Slider */}
                    <div className="lg:col-span-5 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest flex items-center gap-2">
                                <Wallet className="h-3 w-3" /> {t('budget')}
                            </span>
                            <span className="text-xl font-black text-blue-600">₹{budget.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="5000"
                            max="100000"
                            step="5000"
                            value={budget}
                            onChange={(e) => setBudget(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[8px] font-black text-blue-900/30 uppercase tracking-widest">
                            <span>₹5,000</span>
                            <span>₹100,000+</span>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredTrips.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredTrips.map((trip) => (
                                    <motion.div
                                        layout
                                        key={trip.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
                                    >
                                        <div className="relative h-64 w-full overflow-hidden">
                                            <Image
                                                src={trip.image}
                                                alt={trip.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-6 left-6 z-10">
                                                <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#0f172a] uppercase tracking-widest shadow-sm">
                                                    {trip.category}
                                                </div>
                                            </div>
                                            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
                                                <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                                    {trip.price}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-black tracking-tight text-[#0f172a] mb-1">{trip.name}</h3>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">India</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs font-bold text-yellow-700">4.8</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 mb-8 text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-blue-400" />
                                                    <span className="text-xs font-bold">5 Days</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-blue-400" />
                                                    <span className="text-xs font-bold">{trip.bestTimeToVisit}</span>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/destinations/${trip.id}`}
                                                className="w-full py-4 rounded-2xl bg-[#f8fbff] text-[#0f172a] font-bold text-sm flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all duration-300 group/btn"
                                            >
                                                {t('view')} <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Sparkles className="h-8 w-8 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No matching trips found</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                    Try adjusting your budget or selecting a different month to see more recommendations.
                                </p>
                                <button
                                    onClick={() => {
                                        setBudget(50000);
                                        setSelectedMonth('All');
                                        setSelectedCategory('All');
                                    }}
                                    className="mt-6 text-blue-600 font-bold text-sm hover:underline"
                                >
                                    Reset selection
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
