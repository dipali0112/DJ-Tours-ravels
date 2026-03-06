'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Zap, Music, Ghost, GitCompare, Shuffle, History, AlertTriangle, ChevronRight, X, ArrowRight, CloudSun, Wallet, Users, Sparkles, Calendar, BookOpen, MessageCircle, Map as MapIcon, Trophy, Plane, MapPin, Heart, Clock, TrendingUp, CheckCircle, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { trips as ALL_DESTINATIONS } from '@/lib/mockData';

// MOOD SELECTOR
export function MoodSelector({ onMoodSelect, activeMoods }: { onMoodSelect: (mood: string) => void, activeMoods: string[] }) {
    const moods = [
        { id: 'Relax', icon: <Smile className="h-5 w-5" />, label: 'Relax', color: 'text-blue-600', bg: 'bg-blue-600', ring: 'ring-blue-100', softBg: 'bg-blue-50' },
        { id: 'Adventure', icon: <Zap className="h-5 w-5" />, label: 'Adventure', color: 'text-orange-600', bg: 'bg-orange-600', ring: 'ring-orange-100', softBg: 'bg-orange-50' },
        { id: 'Party', icon: <Music className="h-5 w-5" />, label: 'Party', color: 'text-purple-600', bg: 'bg-purple-600', ring: 'ring-purple-100', softBg: 'bg-purple-50' },
        { id: 'Peace', icon: <Ghost className="h-5 w-5" />, label: 'Peace', color: 'text-emerald-600', bg: 'bg-emerald-600', ring: 'ring-emerald-100', softBg: 'bg-emerald-50' },
        { id: 'Trending', icon: <Zap className="h-5 w-5" />, label: 'Trending', color: 'text-rose-600', bg: 'bg-rose-600', ring: 'ring-rose-100', softBg: 'bg-rose-50' }
    ];

    return (
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide no-scrollbar -mx-2 px-2">
            {moods.map((mood) => {
                const isActive = activeMoods.includes(mood.id);
                return (
                    <motion.button
                        key={mood.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onMoodSelect(mood.id)}
                        className={`group relative flex flex-col items-center gap-3 min-w-[100px] p-5 rounded-[2.5rem] transition-all duration-500 ${isActive
                            ? `bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] ring-1 ${mood.ring} scale-105`
                            : 'bg-white/40 backdrop-blur-md hover:bg-white/60 hover:shadow-xl hover:shadow-gray-100/50 border border-white/50'
                            }`}
                    >
                        {/* Interactive Background Glow */}
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    layoutId="moodBgGlow"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className={`absolute inset-0 opacity-[0.03] rounded-[2.5rem] ${mood.bg}`}
                                />
                            )}
                        </AnimatePresence>

                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-sm ${isActive ? `${mood.softBg} ${mood.color} rotate-6` : 'bg-white/80 text-gray-400 group-hover:scale-110 group-hover:bg-gray-50'}`}>
                            {mood.icon}
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className={`font-black text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-[#0f172a]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                {mood.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeDot"
                                    className={`w-1 h-1 rounded-full ${mood.bg}`}
                                />
                            )}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}


// DECISION HELPER
export function DecisionHelper({ destinations, onCompare }: { destinations: any[], onCompare: (dest1: string, dest2: string) => void }) {
    const [selection, setSelection] = useState<string[]>([]);

    const toggleSelection = (name: string) => {
        if (selection.includes(name)) {
            setSelection(selection.filter(n => n !== name));
        } else if (selection.length < 2) {
            setSelection([...selection, name]);
        }
    };

    return (
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                <GitCompare className="h-3 w-3" /> Decision Helper
            </div>
            <h3 className="text-2xl font-black text-[#0f172a] mb-6">Can't decide? Compare them!</h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
                {destinations.slice(0, 4).map(dest => (
                    <button
                        key={dest.destination}
                        onClick={() => toggleSelection(dest.destination)}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${selection.includes(dest.destination) ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'
                            }`}
                    >
                        <div className="w-10 h-10 rounded-xl overflow-hidden">
                            <img src={dest.image} alt={dest.destination} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-xs">{dest.destination}</span>
                    </button>
                ))}
            </div>

            <button
                disabled={selection.length < 2}
                onClick={() => onCompare(selection[0], selection[1])}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                Start Comparison <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}

// SMART PACKING CHECKLIST
export function PackingChecklist({ category }: { category?: string }) {
    const defaultChecklist = [
        { id: 1, item: 'Universal Power Adapter', description: 'Essential for electronics', category: 'General' },
        { id: 2, item: 'Compact Power Bank', description: 'Keep your phone charged', category: 'General' },
        { id: 3, item: 'Basic First Aid Kit', description: 'Band-aids & pain killers', category: 'General' },
        { id: 4, item: 'Lightweight Jacket', description: 'For transit & weather changes', category: 'General' },
    ];

    const categorySpecific: { [key: string]: { item: string, description: string }[] } = {
        'Beach': [
            { item: 'Sunscreen (SPF 50+)', description: 'Protect your skin from UV' },
            { item: 'Quick-dry Towel', description: 'Perfect for the sand' },
            { item: 'Waterproof Phone Pouch', description: 'Capture underwater memories' }
        ],
        'Mountains': [
            { item: 'Sturdy Hiking Boots', description: 'Support for uneven trails' },
            { item: 'Thermal Innerwear', description: 'Stay warm in high altitudes' },
            { item: 'UV Protection Sunglasses', description: 'High-altitude glare protection' }
        ],
        'Adventure': [
            { item: 'Outdoor Headlamp', description: 'Hands-free navigation at night' },
            { item: 'Reusable Water Bottle', description: 'Stay hydrated on the go' },
            { item: 'Emergency Whistle', description: 'Safety first for hikers' }
        ]
    };

    const [items, setItems] = useState(() => {
        const extra = categorySpecific[category || 'General'] || [];
        return [...defaultChecklist, ...extra.map((e, idx) => ({ ...e, id: 10 + idx, category: category || 'Specific' }))].map(item => ({ ...item, checked: false }));
    });

    const toggleItem = (id: number) => {
        setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

    return (
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                        <History className="h-3 w-3" /> Smart Checklist
                    </div>
                    <h3 className="text-2xl font-black text-[#0f172a]">Ready for {category || 'Bharat'}?</h3>
                </div>

                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="transparent" stroke="#e5e7eb" strokeWidth="4" />
                            <circle cx="32" cy="32" r="28" fill="transparent" stroke="#2563eb" strokeWidth="4" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * progress / 100)} strokeLinecap="round" className="transition-all duration-1000" />
                        </svg>
                        <span className="absolute text-[10px] font-black text-blue-600">{progress}%</span>
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Packing Status</div>
                        <div className="text-sm font-black text-[#0f172a]">{items.filter(i => i.checked).length} of {items.length} items</div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${item.checked ? 'bg-blue-50/30 border-blue-100 opacity-60' : 'bg-white border-gray-50 hover:border-gray-100'}`}
                    >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${item.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 bg-gray-50'}`}>
                            {item.checked && <Check className="h-4 w-4 stroke-[4px]" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className={`font-black text-sm transition-all ${item.checked ? 'text-gray-400 line-through' : 'text-[#0f172a]'}`}>{item.item}</span>
                                <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black text-gray-400 rounded-full uppercase tracking-widest">{item.category}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">{item.description}</p>
                        </div>
                        {!item.checked && <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-4 w-4" /></div>}
                    </button>
                ))}
            </div>

            {progress === 100 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-emerald-700 font-black text-xs uppercase tracking-widest">🎉 You're fully equipped! Bon Voyage.</p>
                </motion.div>
            )}
        </div>
    );
}

const Check = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);

// REGRET PREDICTOR MODAL
export function RegretPredictor({ destination, regrets, isOpen, onClose }: { destination: string, regrets: string, isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <AlertTriangle className="w-32 h-32 text-orange-600" />
                    </div>
                    <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] mb-6">
                        <AlertTriangle className="h-3 w-3" /> Regret Predictor
                    </div>
                    <h3 className="text-3xl font-black text-[#0f172a] mb-6">Know before you go: <span className="text-blue-600">{destination}</span></h3>
                    <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 mb-8">
                        <p className="text-orange-900 font-bold leading-relaxed italic">"{regrets}"</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                    >
                        Got it, I'll plan around this
                    </button>
                    <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

// DECISION MODAL (COMPARISON)
export function ComparisonModal({ dest1, dest2, isOpen, onClose }: { dest1: any, dest2: any, isOpen: boolean, onClose: () => void }) {
    if (!isOpen || !dest1 || !dest2) return null;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white rounded-[3rem] p-10 max-w-5xl w-full shadow-2xl relative overflow-hidden max-h-[95vh] overflow-y-auto no-scrollbar"
                >
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                                <GitCompare className="h-3 w-3" /> Comparison Mode
                            </div>
                            <h2 className="text-3xl font-black text-[#0f172a]">The Ultimate Showdown</h2>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-12 relative">
                        <div className="absolute left-1/2 top-10 bottom-10 w-px bg-gray-100 -translate-x-1/2 md:block hidden" />

                        {[dest1, dest2].map((dest, i) => (
                            <div key={i} className="bg-gray-50/50 rounded-[2.5rem] p-8 space-y-8 border border-gray-100 flex flex-col">
                                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg">
                                    <img src={dest.image} alt={dest.destination} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                                        <Smile className="h-3 w-3 text-orange-500 fill-current" />
                                        <span className="text-[10px] font-black text-[#0f172a]">{dest.rating || '4.5'}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-[#0f172a] mb-1">{dest.destination}</h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">{dest.category}</span>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Wallet className="h-4 w-4 text-gray-400" />
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Est. Cost</span>
                                        </div>
                                        <span className="font-black text-blue-600">₹{dest.budget ? dest.budget.toLocaleString() : (dest.price || '0')}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <CloudSun className="h-4 w-4 text-gray-400" />
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Best Time</span>
                                        </div>
                                        <span className="font-bold text-xs text-[#0f172a]">March - May</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Zap className="h-4 w-4 text-gray-400" />
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Vibe</span>
                                        </div>
                                        <span className="font-bold text-xs text-[#0f172a]">High Intensity</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-2xl shadow-blue-500/20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <Sparkles className="w-40 h-40" />
                        </div>
                        <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">AI Verdict</h4>
                        <p className="text-blue-100 font-bold italic text-lg">
                            "Looking at your explorer personality, **{dest1.rating > dest2.rating ? dest1.destination : dest2.destination}** offers a more authentic {dest1.rating > dest2.rating ? dest1.category : dest2.category} experience with better budget alignment."
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
// QUICK ACTION BAR
export function QuickActionBar() {
    const actions = [
        { label: 'Book Trip', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Compare Trips', icon: GitCompare, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Ask AI', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'My Bookings', icon: MapIcon, color: 'text-orange-600', bg: 'bg-orange-50' }
    ];

    return (
        <div className="flex flex-wrap gap-4 mb-10">
            {actions.map((action, idx) => (
                <motion.button
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                >
                    <div className={`p-2 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black text-[#0f172a] uppercase tracking-widest">{action.label}</span>
                </motion.button>
            ))}
        </div>
    );
}

// CREDIT SYSTEM CARD
export function CreditSystemCard({
    onApplyCredit,
    isApplied,
    creditAmount = 1000
}: {
    onApplyCredit: () => void,
    isApplied: boolean,
    creditAmount?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-[3rem] border-2 transition-all relative overflow-hidden group ${isApplied
                    ? 'border-emerald-100 bg-emerald-50/30'
                    : 'border-blue-100 bg-white hover:border-blue-200'
                }`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">
                    <Wallet className="h-3 w-3" /> Wallet & Credits
                </div>
                {isApplied && (
                    <span className="flex items-center gap-1 text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-1 rounded-full">
                        <CheckCircle className="h-2 w-2" /> Active
                    </span>
                )}
            </div>

            <div className="flex items-center gap-6 mb-8">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner ${isApplied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                    ₹
                </div>
                <div>
                    <h4 className="text-3xl font-black text-[#0f172a]">
                        ₹{creditAmount.toLocaleString()}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {isApplied ? 'Credit Applied Successfully' : 'Available Travel Credit'}
                    </p>
                </div>
            </div>

            <button
                disabled={isApplied}
                onClick={onApplyCredit}
                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all ${isApplied
                        ? 'bg-emerald-100 text-emerald-600 cursor-default'
                        : 'bg-gray-900 text-white hover:bg-black shadow-xl shadow-gray-200'
                    }`}
            >
                {isApplied ? 'Credit Redeemed' : 'Apply ₹1,000 Credit'}
            </button>

            {!isApplied && (
                <p className="text-center mt-4 text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">
                    * Applicable on any package. One-time use only.
                </p>
            )}
        </motion.div>
    );
}

// AI TRIP PLANNER CARD
export function AITripPlannerCard({ onGenerate }: { onGenerate: (prefs: any) => void }) {
    const [budget, setBudget] = useState(25000);
    const [days, setDays] = useState(5);
    const [type, setType] = useState('Relax');

    return (
        <div className="bg-[#0f172a] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Sparkles className="w-48 h-48 text-blue-400" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                    <Wand2 className="h-3 w-3" /> AI Itinerary Generator
                </div>

                <h3 className="text-3xl font-black text-white mb-8 leading-tight">
                    Where should we <span className="text-blue-400 italic underline decoration-blue-400/30 underline-offset-8">explore</span> next?
                </h3>

                <div className="space-y-6 mb-10">
                    <div>
                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                            <span>Budget</span>
                            <span className="text-blue-400">₹{budget.toLocaleString()}</span>
                        </div>
                        <input
                            type="range" min="5000" max="100000" step="5000" value={budget}
                            onChange={(e) => setBudget(parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Duration</label>
                            <select
                                value={days} onChange={(e) => setDays(parseInt(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-blue-400 transition-all"
                            >
                                {[3, 5, 7, 10, 14].map(d => <option key={d} value={d} className="bg-[#0f172a]">{d} Days</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Vibe</label>
                            <select
                                value={type} onChange={(e) => setType(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-blue-400 transition-all"
                            >
                                {['Relax', 'Adventure', 'Party', 'Spiritual'].map(v => <option key={v} value={v} className="bg-[#0f172a]">{v}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onGenerate({ budget, days, type })}
                    className="w-full py-4 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    ✨ Generate My Plan
                </button>
            </div>
        </div>
    );
}

// TRAVEL PERSONALITY CARD
export function TravelPersonalityCard({ user }: { user: any }) {
    const personality = {
        title: "Explorer Traveler",
        desc: "You thrive on discovering hidden gems and local cultures. Your style is authentic and adventurous.",
        stats: [
            { label: 'Adventure', value: 85, color: 'bg-blue-600' },
            { label: 'Relax', value: 15, color: 'bg-blue-200' }
        ]
    };

    return (
        <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group h-full">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <MapIcon className="w-40 h-40" />
            </div>

            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                <Users className="h-3 w-3" /> AI Travel Personality
            </div>

            <div className="relative z-10">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-2xl font-black text-[#0f172a] mb-2 leading-tight">
                    You are an <span className="text-blue-600 italic">{personality.title}</span>
                </h3>
                <p className="text-xs text-gray-400 font-bold leading-relaxed mb-6">
                    {personality.desc}
                </p>

                <div className="space-y-4">
                    {personality.stats.map((stat, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                <span className="text-gray-400">{stat.label}</span>
                                <span className="text-[#0f172a]">{stat.value}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.value}%` }}
                                    className={`h-full ${stat.color}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// GAMIFICATION STATS
export function GamificationStats() {
    const stats = [
        { label: 'Trips Done', value: '04', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Cities', value: '12', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Rewards', value: '08', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-50' }
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm text-center group hover:border-blue-100 transition-colors">
                    <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon className="h-4 w-4" />
                    </div>
                    <div className="text-xl font-black text-[#0f172a] mb-1">{stat.value}</div>
                    <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
