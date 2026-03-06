'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Banknote, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RefundPage() {
    return (
        <main className="min-h-screen bg-white text-[#0f172a]">
            <Navbar />

            <section className="relative pt-40 pb-20 bg-[#f8fbff]">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-[0.3em] text-[10px] mb-6"
                    >
                        <Banknote className="h-4 w-4" />
                        Customer Protection
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl font-black tracking-tighter leading-none mb-8"
                    >
                        Refund Policy.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[#64748b] font-medium leading-relaxed"
                    >
                        Transparent, fair, and simple. We want you to feel secure when planning your Indian adventure with us.
                    </motion.p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid grid-cols-1 gap-12">
                        {[
                            { title: "24-Hour Grace Period", icon: Clock, desc: "Cancel any booking within 24 hours of purchase for a full, no-questions-asked refund." },
                            { title: "AI Precision Guarantee", icon: CheckCircle2, desc: "If our AI provides significantly inaccurate itinerary data that disrupts your trip, we'll provide service credits." },
                            { title: "Provider Cancellations", icon: AlertCircle, desc: "If a local partner or hotel cancels, we ensure a 100% refund or provide an immediate premium alternative." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 bg-[#f8fbff]/50 rounded-[3rem] border border-blue-50 flex flex-col md:flex-row gap-8 items-start"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                    <item.icon className="h-8 w-8 text-[#0ea5e9]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-[#64748b] font-medium text-lg leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-[#64748b] font-medium mb-8">Need to initiate a refund or have questions?</p>
                        <button className="px-12 py-5 bg-[#0f172a] text-white rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-gray-200">
                            Contact Claims Team
                        </button>
                    </div>
                </div>
            </section>


        </main>
    );
}
