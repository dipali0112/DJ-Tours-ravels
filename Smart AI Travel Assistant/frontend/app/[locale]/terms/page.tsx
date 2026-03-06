'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, ScrollText } from 'lucide-react';

export default function TermsPage() {
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
                        <Shield className="h-4 w-4" />
                        Legal Policy
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl font-black tracking-tighter leading-none mb-8"
                    >
                        Terms of Service.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[#64748b] font-medium leading-relaxed"
                    >
                        Last updated: February 2026. Please read these terms carefully before using our AI travel services.
                    </motion.p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-16">
                        {[
                            { title: "Acceptance of Terms", icon: ScrollText, desc: "By accessing Bloosm, you agree to bound by these Terms of Service and all applicable laws and regulations in Bharat." },
                            { title: "Usage License", icon: Scale, desc: "Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only." },
                            { title: "AI Disclaimer", icon: FileText, desc: "Our AI provides travel recommendations based on available data. While we strive for accuracy, users should verify critical travel details independently." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-8 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#0ea5e9] group-hover:text-white transition-all">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-[#64748b] leading-relaxed font-medium text-lg">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 bg-gray-50 rounded-[3rem] border border-gray-100">
                        <p className="text-[#64748b] font-medium leading-relaxed italic">
                            Detailed legal documentation is currently being finalized. For urgent legal inquiries, please contact our support team at legal@bloosm.com.
                        </p>
                    </div>
                </div>
            </section>


        </main>
    );
}
