'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Sparkles, Navigation, Info } from 'lucide-react';
import Image from 'next/image';

interface PlanDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: any;
    onClaim?: (plan: any) => Promise<void>;
}

export default function PlanDetailsModal({ isOpen, onClose, plan, onClaim }: PlanDetailsModalProps) {
    const [isClaiming, setIsClaiming] = useState(false);

    if (!isOpen || !plan) return null;

    const basePrice = plan.budget || parseInt(plan.price?.replace(/[^\d]/g, '') || '0');

    const handleClaim = async () => {
        if (!onClaim) return;
        setIsClaiming(true);
        try {
            await onClaim(plan);
            onClose();
        } catch (error) {
            console.error("Failed to claim plan:", error);
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all shadow-lg"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Left Side: Destination Visual */}
                <div className="md:w-5/12 relative h-64 md:h-full bg-gray-900">
                    <Image
                        src={plan.image}
                        alt={plan.name || plan.destination || 'Travel Destination'}
                        fill
                        className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <div className="inline-flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <Sparkles className="h-3 w-3" /> Recommended For You
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">{plan.name || plan.destination}</h2>
                        <div className="flex items-center gap-2 text-white/70 mb-6">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-bold uppercase tracking-widest">{plan.category} • India</span>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Package Price</div>
                            <div className="text-2xl font-black text-white">₹{basePrice.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Itinerary */}
                <div className="md:w-7/12 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight text-[#0f172a]">AI Generated Itinerary</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personalized daily schedule</p>
                        </div>
                    </div>

                    <div className="space-y-10 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-blue-50">
                        {plan.aiItinerary && plan.aiItinerary.length > 0 ? plan.aiItinerary.map((day: any) => (
                            <div key={day.day} className="relative pl-12">
                                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-blue-600 border-4 border-white shadow-lg shadow-blue-500/20 flex items-center justify-center text-white text-xs font-black z-10">
                                    {day.day}
                                </div>
                                <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 hover:border-blue-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 group">
                                    <h4 className="text-lg font-black text-[#0f172a] mb-2 group-hover:text-blue-600 transition-colors">
                                        {day.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                        {day.activities}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                                <Sparkles className="h-12 w-12 text-blue-200 mx-auto mb-6 animate-pulse" />
                                <h4 className="text-lg font-black text-[#0f172a] mb-2">No itinerary found</h4>
                                <p className="text-sm text-gray-400 font-bold mb-8 max-w-xs mx-auto">This plan doesn't have a schedule yet. Would you like AI to dream one up for you?</p>
                                <button className="px-8 py-4 bg-white text-[#0f172a] border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
                                    Generate AI Schedule
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                <Navigation className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-[#0f172a]">Ready to fly?</h4>
                                <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest">Book your slot now</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClaim}
                            disabled={isClaiming}
                            className={`w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 ${isClaiming ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isClaiming ? (
                                <>
                                    <Sparkles className="h-4 w-4 animate-spin" /> Claiming...
                                </>
                            ) : (
                                'Claim This Plan'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
