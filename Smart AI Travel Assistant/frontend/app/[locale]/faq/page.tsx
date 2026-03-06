'use client';

import Navbar from '@/components/Navbar';
import FAQSection from '@/components/FAQSection';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-white text-[#0f172a]">
            <Navbar />

            <section className="relative pt-40 pb-10 bg-[#f8fbff]">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-[0.3em] text-[10px] mb-6"
                    >
                        <HelpCircle className="h-4 w-4" />
                        Support Center
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8"
                    >
                        How can we <br />
                        <span className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">help you?</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[#64748b] font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Everything you need to know about planning, booking, and exploring India with our AI travel assistant.
                    </motion.p>
                </div>
            </section>

            {/* Standalone FAQ Section */}
            <div className="py-20 -mt-20">
                <FAQSection />
            </div>

            {/* Additional Contact Callout */}
            <section className="pb-32">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="p-16 bg-[#f8fbff] rounded-[4rem] border border-blue-50">
                        <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
                        <p className="text-[#64748b] text-lg mb-10 font-medium">
                            If you can't find the answer you're looking for, our human guides are happy to assist.
                        </p>
                        <button className="px-10 py-5 bg-[#0f172a] text-white rounded-full font-bold hover:scale-105 transition-transform">
                            Contact Support
                        </button>
                    </div>
                </div>
            </section>

        </main>
    );
}
