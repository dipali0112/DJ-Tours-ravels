'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Calendar, Map, Sparkles, Check, ChevronRight, Compass, Users, Heart, Palmtree, Mountain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import axios from 'axios';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'Anytime'
];

const INTERESTS = [
    { id: 'Adventure', icon: '🏔️', label: 'Adventure' },
    { id: 'Nature', icon: '🌿', label: 'Nature' },
    { id: 'Spiritual', icon: '🕉️', label: 'Spiritual' },
    { id: 'Beaches', icon: '🏖️', label: 'Beaches' },
    { id: 'Heritage', icon: '🏛️', label: 'Heritage' },
    { id: 'Food', icon: '🍜', label: 'Food' },
    { id: 'Wildlife', icon: '🐯', label: 'Wildlife' },
    { id: 'Luxury', icon: '✨', label: 'Luxury' }
];

const TRAVEL_STYLES = [
    { id: 'Solo', icon: <Compass className="h-5 w-5" />, label: 'Solo' },
    { id: 'Family', icon: <Users className="h-5 w-5" />, label: 'Family' },
    { id: 'Friends', icon: <Heart className="h-5 w-5" />, label: 'Friends' },
    { id: 'Honeymoon', icon: <Palmtree className="h-5 w-5" />, label: 'Honeymoon' }
];

interface PreferenceSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PreferenceSetupModal({ isOpen, onClose }: PreferenceSetupModalProps) {
    const { updatePreferences } = useAuth();
    const [step, setStep] = useState(1);
    const [budget, setBudget] = useState(50000);
    const [interests, setInterests] = useState<string[]>([]);
    const [travelType, setTravelType] = useState('Solo');
    const [preferredMonth, setPreferredMonth] = useState('Anytime');
    const [isSaving, setIsSaving] = useState(false);

    const toggleInterest = (id: string) => {
        setInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        setIsSaving(true);
        try {
            await updatePreferences({
                budget,
                interests,
                travelType,
                preferredMonth,
                setupCompleted: true
            });
            onClose();
        } catch (error) {
            console.error("Setup failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100"
                >
                    {/* Liquid Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gray-50 flex">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                    </div>

                    {/* Header */}
                    <div className="p-12 pb-0">
                        <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                            <span className="w-8 h-px bg-blue-200"></span>
                            Step {step} of 4
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-[#0f172a] leading-[1.1] mb-2">
                            {step === 1 && "What's your preferred travel budget?"}
                            {step === 2 && "What are your travel interests?"}
                            {step === 3 && "Who do you usually travel with?"}
                            {step === 4 && "When do you plan to explore?"}
                        </h2>
                        <p className="text-gray-400 font-medium text-sm">
                            {step === 1 && "Adjust the slider to set your maximum spend per trip."}
                            {step === 2 && "Select the vibes that match your personality."}
                            {step === 3 && "This helps us suggest the best accommodation types."}
                            {step === 4 && "Tell us your preferred season for discovery."}
                        </p>
                    </div>

                    {/* Step Content */}
                    <div className="p-12 pt-10 min-h-[380px]">
                        {step === 1 && (
                            <div className="space-y-16 py-4">
                                <div className="text-center relative">
                                    <div className="absolute inset-0 bg-blue-50/50 blur-3xl rounded-full -z-10 scale-150" />
                                    <motion.span
                                        key={budget}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-7xl font-black text-blue-600 inline-block drop-shadow-sm"
                                    >
                                        ₹{budget.toLocaleString()}
                                    </motion.span>
                                    <div className="mt-4 flex flex-col items-center gap-2">
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                                            budget < 50000 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                budget < 150000 ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-purple-50 text-purple-600 border-purple-100"
                                        )}>
                                            {budget < 50000 ? "Budget Friendly" : budget < 150000 ? "Comfort Travel" : "Luxury Experience"}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <input
                                        type="range"
                                        min="10000"
                                        max="300000"
                                        step="5000"
                                        value={budget}
                                        onChange={(e) => setBudget(parseInt(e.target.value))}
                                        className="w-full h-4 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all border-4 border-white shadow-inner"
                                    />
                                    <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        <span>₹10,000</span>
                                        <span>Ultimate Luxury</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid grid-cols-2 gap-4">
                                {INTERESTS.map((t, idx) => (
                                    <motion.button
                                        key={t.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => toggleInterest(t.id)}
                                        className={cn(
                                            "p-6 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-3 relative group overflow-hidden",
                                            interests.includes(t.id)
                                                ? "border-blue-600 bg-blue-50/50"
                                                : "border-gray-50 bg-white hover:border-blue-100 hover:bg-gray-50/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all",
                                            interests.includes(t.id) ? "bg-blue-600 shadow-lg shadow-blue-300" : "bg-white shadow-sm"
                                        )}>
                                            {t.icon}
                                        </div>
                                        <div>
                                            <span className={cn(
                                                "text-xs font-black uppercase tracking-wider block",
                                                interests.includes(t.id) ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"
                                            )}>
                                                {t.label}
                                            </span>
                                        </div>
                                        {interests.includes(t.id) && (
                                            <div className="absolute top-4 right-4 bg-blue-600 rounded-full p-1.5 text-white shadow-md">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid grid-cols-2 gap-5">
                                {TRAVEL_STYLES.map((style, idx) => (
                                    <motion.button
                                        key={style.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => setTravelType(style.id)}
                                        className={cn(
                                            "p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-5 group relative",
                                            travelType === style.id
                                                ? "border-blue-600 bg-blue-50/30"
                                                : "border-gray-50 bg-white hover:border-blue-100"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-5 rounded-3xl transition-all duration-500",
                                            travelType === style.id
                                                ? "bg-blue-600 text-white shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)]"
                                                : "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-400"
                                        )}>
                                            {style.icon}
                                        </div>
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-[0.2em]",
                                            travelType === style.id ? "text-blue-600" : "text-gray-400"
                                        )}>
                                            {style.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="grid grid-cols-3 gap-3">
                                {MONTHS.map((m, idx) => (
                                    <motion.button
                                        key={m}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        onClick={() => setPreferredMonth(m)}
                                        className={cn(
                                            "p-5 rounded-2xl border-2 transition-all text-[11px] font-black uppercase tracking-widest",
                                            preferredMonth === m
                                                ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20 scale-105 z-10"
                                                : "bg-white text-gray-400 border-gray-100 hover:border-blue-100"
                                        )}
                                    >
                                        {m}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Nav */}
                    <div className="p-12 pt-0 flex justify-between gap-4">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-10 py-5 font-black text-gray-400 hover:text-[#0f172a] transition-colors text-[10px] uppercase tracking-[0.2em]"
                            >
                                <span className="flex items-center gap-2">
                                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                                </span>
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 4 ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStep(step + 1)}
                                className="px-12 py-5 bg-[#0f172a] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] hover:bg-[#1e293b] transition-all flex items-center gap-3"
                            >
                                Continue <ChevronRight className="h-4 w-4" />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleComplete}
                                disabled={isSaving}
                                className="px-14 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_20px_40px_-12px_rgba(37,99,235,0.3)] hover:shadow-blue-500/40 transition-all flex items-center gap-3 disabled:opacity-50"
                            >
                                {isSaving ? "Finalizing Experience..." : "Unlock My India"} <Sparkles className="h-4 w-4" />
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
