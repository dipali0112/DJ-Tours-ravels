'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the background image
    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <section
            ref={containerRef}
            className="relative h-[800px] w-full overflow-hidden bg-[#f8fbff] text-[#0f172a] border-t border-blue-50"
        >
            {/* Parallax Background Image (Lightened & Bright) */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506461883276-59fb2293f0b2?auto=format&fit=crop&q=80&w=2000')" }}
                />
                {/* Light Overlays for Content Focus */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-white/90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white"></div>
            </motion.div>

            {/* Sophisticated Dot Pattern Overlay */}
            <div
                className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            ></div>

            {/* Dynamic Mesh Gradients (Symmetry with other light sections) */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
                <motion.div
                    animate={{
                        x: [-50, 50, -50],
                        y: [-25, 25, -25],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-sky-200/50 rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{
                        x: [50, -50, 50],
                        y: [25, -25, 25],
                        scale: [1.1, 1, 1.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/3 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-[120px]"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6 max-w-7xl mx-auto">

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-[#0f172a] mb-10 tracking-tight leading-[1.05] max-w-4xl"
                >
                    Start your thrilling journey<br />
                    <span className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent italic font-serif pl-4">across Incredible India.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-[#64748b] mb-16 max-w-2xl font-medium leading-[1.8] tracking-wide"
                >
                    Uncover hidden gems from Kerala to Kashmir, plan effortless trips, and create memories that last a lifetime with our personal travel concierge.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href="/destinations"
                        className="group relative inline-flex items-center gap-5 px-10 py-5 bg-[#0f172a] text-white font-bold text-base uppercase tracking-[0.2em] rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_30px_60px_rgba(15,23,42,0.2)]"
                    >
                        {/* Static Text */}
                        <span className="relative z-10">Get Started Now</span>
                        <ArrowRight className="relative z-10 h-5 w-5 group-hover:translate-x-3 transition-transform duration-500" />

                        {/* Hover Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                </motion.div>
            </div>

            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0ea5e9]/20 to-transparent"></div>
        </section>
    );
}
