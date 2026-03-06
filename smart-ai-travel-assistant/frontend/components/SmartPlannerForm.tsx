'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Calendar, Clock, Map, Sparkles, Check, ChevronRight } from 'lucide-react';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'Anytime'
];

const TRAVEL_TYPES = [
    { id: 'Adventure', icon: '🏔️', label: 'Adventure' },
    { id: 'Relax', icon: '🏖️', label: 'Relax' },
    { id: 'Family', icon: '👨‍👩‍👧‍👦', label: 'Family' },
    { id: 'Honeymoon', icon: '👩‍❤️‍👨', label: 'Honeymoon' },
    { id: 'Spiritual', icon: '🕉️', label: 'Spiritual' }
];

interface SmartPlannerFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (preferences: any) => void;
    isLoading: boolean;
}

export default function SmartPlannerForm({ isOpen, onClose, onSubmit, isLoading }: SmartPlannerFormProps) {
    const [destination, setDestination] = useState('');
    const [budget, setBudget] = useState(50000);
    const [month, setMonth] = useState('Anytime');
    const [duration, setDuration] = useState(5);
    const [type, setType] = useState('Adventure');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white relative">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Smart Travel Planner</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight leading-tight">
                            Tell us about your <br /> dream getaway
                        </h2>
                    </div>

                    {/* Form Body */}
                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

                        {/* Destination Input */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Map className="h-3 w-3" /> Target Destination (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="Where do you want to go? (e.g. Goa, Paris...)"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>

                        {/* Budget Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Wallet className="h-3 w-3" /> Max Budget (INR)
                                </label>
                                <span className="text-xl font-black text-blue-600">₹{budget.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="150000"
                                step="5000"
                                value={budget}
                                onChange={(e) => setBudget(parseInt(e.target.value))}
                                className="w-full h-2 bg-blue-50 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
                                <span>₹5,000</span>
                                <span>₹150,000+</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Month Picker */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Travel Month
                                </label>
                                <div className="relative">
                                    <select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 appearance-none focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    >
                                        {MONTHS.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronRight className="h-4 w-4 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Duration Stepper */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> Duration (Days)
                                </label>
                                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 border border-gray-100">
                                    <button
                                        onClick={() => setDuration(Math.max(1, duration - 1))}
                                        className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl font-bold hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                    >-</button>
                                    <div className="flex-1 text-center font-black text-lg">{duration}</div>
                                    <button
                                        onClick={() => setDuration(Math.min(15, duration + 1))}
                                        className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl font-bold hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        {/* Travel Type Chips */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Map className="h-3 w-3" /> Travel Style
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {TRAVEL_TYPES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setType(t.id)}
                                        className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${type === t.id
                                            ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-500/10'
                                            : 'border-gray-100 bg-white hover:border-blue-100 hover:bg-blue-50/20'
                                            }`}
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{t.icon}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${type === t.id ? 'text-blue-600' : 'text-gray-400'
                                            }`}>{t.label}</span>
                                        {type === t.id && (
                                            <div className="absolute top-2 right-2 p-1 bg-blue-600 rounded-full text-white">
                                                <Check className="h-2 w-2" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-4 font-bold text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit({ destination, budget, month, duration, type })}
                            disabled={isLoading}
                            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            Generate My Plan
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
