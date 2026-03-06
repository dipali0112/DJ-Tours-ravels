"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
    Sparkles, Globe, ThumbsUp, HeartHandshake, ArrowRight, MapPin, Compass
} from 'lucide-react';

/* ─────────────── Animated Counter ─────────────── */
const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        const duration = 2000;
        const startTime = performance.now();

        const step = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * ease));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, target]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─────────────── Stars Background (client-only) ─────────────── */
const StarsBackground = () => {
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        setStars(
            Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2.5 + 1,
                delay: Math.random() * 3,
                duration: Math.random() * 2 + 2,
            }))
        );
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.1, 0.7, 0.1],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

/* ─────────────── Fade-In Wrapper ─────────────── */
const FadeIn = ({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
    >
        {children}
    </motion.div>
);

/* ═══════════════════════════════════════════════════ */
/*                    ABOUT PAGE                       */
/* ═══════════════════════════════════════════════════ */
export default function AboutPage() {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 800], [0, 250]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    const font = 'font-[family-name:var(--font-poppins)]';

    return (
        <div className={`min-h-screen bg-white selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden ${font}`}>
            <Navbar />

            {/* ═══════════════════════════════════════════
                1. HERO SECTION — Premium Cinematic
            ═══════════════════════════════════════════ */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Parallax BG with ken-burns zoom */}
                <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
                    <motion.img
                        src="/hero-mountains.png"
                        alt="Cinematic Travel Landscape"
                        className="w-full h-[120%] object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, ease: 'easeOut' }}
                    />
                    {/* Multi-layer gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/60 via-[#0f172a]/30 to-[#0f172a]/50 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/30 via-transparent to-[#0f172a]/20 z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />
                </motion.div>

                {/* Floating light particles */}
                <div className="absolute inset-0 z-15 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className="absolute w-1 h-1 bg-white/30 rounded-full"
                            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
                            animate={{
                                y: [0, -40, 0],
                                opacity: [0.2, 0.6, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 4 + i * 0.5,
                                delay: i * 0.7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-20 w-full max-w-[1400px] mx-auto px-10 text-center"
                >
                    {/* Animated label badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8"
                    >
                        <span className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 font-medium text-[15px] tracking-widest uppercase">
                            <motion.span
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                ✈️
                            </motion.span>
                            Intelligent Travel Platform
                        </span>
                    </motion.div>

                    {/* Headline with staggered reveal */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[40px] md:text-[58px] lg:text-[72px] font-bold text-white tracking-tight leading-[1.06] mb-8 drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                    >
                        We Don&apos;t Just{' '}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-400 to-sky-400">
                                Plan Trips.
                            </span>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 1.2 }}
                                className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-sky-400 to-teal-400 origin-left rounded-full shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                            />
                        </span>
                        <br />
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            We Design Moments.
                        </motion.span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.8 }}
                        className="text-[20px] md:text-[24px] lg:text-[26px] font-normal text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Personalized, intelligent travel experiences crafted around your passions,
                        pace, and sense of wonder.
                    </motion.p>

                    {/* CTAs with staggered entrance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                            <Link
                                href="/destinations"
                                className="px-11 py-5 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full font-semibold text-[19px] tracking-wide shadow-[0_8px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.45)] transition-all duration-300 flex items-center gap-3 group"
                            >
                                Start Exploring
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                            <Link
                                href="#story"
                                className="px-11 py-5 bg-white/10 backdrop-blur-md border border-white/25 text-white rounded-full font-semibold text-[19px] tracking-wide hover:bg-white/20 transition-all duration-300"
                            >
                                Our Story
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Premium Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
                >
                    <motion.span
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/50 text-[12px] tracking-[0.3em] uppercase font-medium"
                    >
                        Scroll
                    </motion.span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                    >
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <motion.div
                                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                                className="w-1.5 h-1.5 bg-white rounded-full"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════
                2. STORY SECTION — Premium 50/50 Split
            ═══════════════════════════════════════════ */}
            <section id="story" className="py-24 md:py-36 bg-gradient-to-b from-white via-[#f8fbff] to-white relative overflow-hidden">
                {/* Decorative floating blobs */}
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 left-10 w-72 h-72 bg-sky-100/50 rounded-full blur-[100px] pointer-events-none"
                />
                <motion.div
                    animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-20 right-10 w-72 h-72 bg-teal-100/50 rounded-full blur-[100px] pointer-events-none"
                />

                <div className="w-full max-w-[1400px] mx-auto px-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left: Image with decorative elements */}
                        <FadeIn>
                            <div className="relative">
                                <motion.div
                                    animate={{ y: [0, -12, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative"
                                >
                                    {/* Main image */}
                                    <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
                                        <img
                                            src="/story-lake.png"
                                            alt="Lake and Mountains"
                                            className="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Floating badge on image */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                                        viewport={{ once: true }}
                                        className="absolute -bottom-6 -right-6 md:bottom-6 md:right-6 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] px-6 py-4 backdrop-blur-sm border border-gray-100/80"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                                                <Compass className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-bold text-[#0f172a]">Since 2022</p>
                                                <p className="text-[13px] text-[#6b7c93]">Crafting journeys</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Decorative gradient ring behind image */}
                                <div className="absolute -top-6 -left-6 w-full h-full rounded-3xl border-2 border-dashed border-sky-200/60 -z-10" />
                            </div>
                        </FadeIn>

                        {/* Right: Story Text with staggered animations */}
                        <div className="space-y-6">
                            {/* Label badge */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-100 rounded-full text-sky-600 font-semibold text-[14px] uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4" />
                                    Our Story
                                </span>
                            </motion.div>

                            {/* Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="text-[30px] md:text-[38px] lg:text-[44px] font-bold text-[#0f172a] tracking-tight leading-[1.15]"
                            >
                                It Began With a{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-500 relative">
                                    Simple Frustration.
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-sky-400 to-teal-400 origin-left rounded-full"
                                    />
                                </span>
                            </motion.h2>

                            {/* Body text with left accent border */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="space-y-5 text-[#5a6a7e] text-[20px] font-normal leading-[1.85] border-l-[3px] border-sky-200 pl-6"
                            >
                                <p>
                                    Too many tabs open. Too many confusing travel options.
                                    Too many &ldquo;top 10 places&rdquo; blogs. And still… something was missing.
                                </p>
                                <p className="text-[24px] font-semibold text-[#0f172a]">
                                    We realized travel had become{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-500">
                                        unnecessarily complicated.
                                    </span>
                                </p>
                                <p>
                                    It was supposed to be exciting — but planning felt overwhelming.
                                    So we asked:{' '}
                                    <span className="font-medium text-sky-600">
                                        What if travel planning could be intelligent, personal, and effortless?
                                    </span>
                                </p>
                            </motion.div>

                            {/* Quote card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.35 }}
                                className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-2xl p-6 border border-sky-100/60 relative overflow-hidden"
                            >
                                <div className="absolute top-3 left-5 text-sky-200 text-[60px] font-serif leading-none pointer-events-none select-none">&ldquo;</div>
                                <p className="text-[22px] font-semibold text-teal-600 italic relative z-10 pl-4">
                                    That&apos;s how our journey began.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                3. GLOBAL IMPACT — Stat Cards
            ═══════════════════════════════════════════ */}
            <section className="py-20 md:py-28 bg-[#fafcff]">
                <div className="w-full max-w-[1400px] mx-auto px-10">
                    <FadeIn className="text-center mb-14">
                        <span className="text-sky-500 font-semibold text-[15px] uppercase tracking-[0.25em] block mb-3">
                            Driving Change
                        </span>
                        {/* Section heading: 36px */}
                        <h2 className="text-[30px] md:text-[36px] lg:text-[42px] font-bold text-[#0f172a] tracking-tight">
                            Our Global Impact
                        </h2>
                    </FadeIn>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Sparkles, val: 10000, suffix: '+', label: 'Smart Itineraries Created', color: 'text-sky-500', bg: 'bg-sky-50' },
                            { icon: Globe, val: 40, suffix: '+', label: 'Destinations Covered', color: 'text-teal-500', bg: 'bg-teal-50' },
                            { icon: ThumbsUp, val: 98, suffix: '%', label: 'Traveler Satisfaction', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { icon: HeartHandshake, val: 24, suffix: '/7', label: 'Global Support', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        ].map((stat, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <motion.div
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="p-8 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-gray-100/80 text-center group hover:shadow-[0_8px_36px_rgba(0,0,0,0.09)] transition-shadow duration-300 cursor-default"
                                >
                                    <div className={`inline-flex w-13 h-13 rounded-xl items-center justify-center mb-5 ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    {/* Stat number: 40px */}
                                    <h4 className="text-[38px] md:text-[44px] font-bold text-[#0f172a] tracking-tight mb-2">
                                        <AnimatedCounter target={stat.val} suffix={stat.suffix} />
                                    </h4>
                                    <p className="text-[#6b7c93] font-medium text-[17px]">{stat.label}</p>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                4. TIMELINE — Our Evolution
            ═══════════════════════════════════════════ */}
            <section className="py-20 md:py-28 bg-white overflow-hidden">
                <div className="w-full max-w-[1400px] mx-auto px-10">
                    <FadeIn className="mb-14">
                        <span className="text-teal-500 font-semibold text-[15px] uppercase tracking-[0.25em] block mb-3">
                            Milestones
                        </span>
                        <h2 className="text-[30px] md:text-[36px] lg:text-[42px] font-bold text-[#0f172a] tracking-tight">
                            Our Evolution
                        </h2>
                    </FadeIn>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Connecting line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            viewport={{ once: true }}
                            className="absolute top-[48px] left-[8%] right-[8%] h-[3px] bg-gradient-to-r from-sky-300 via-teal-400 to-sky-300 origin-left hidden md:block rounded-full shadow-[0_0_12px_rgba(14,165,233,0.3)]"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-5 relative">
                            {[
                                { year: '2022', title: 'Company Started', emoji: '🔥', desc: 'A vision born from a passion for smarter travel.' },
                                { year: '2023', title: 'Expanded Destinations', emoji: '🌍', desc: 'Grew from 5 to 40+ destinations worldwide.' },
                                { year: '2024', title: 'AI Travel Planning', emoji: '🚀', desc: 'Launched intelligent, personalized itinerary engine.' },
                                { year: 'Future', title: 'Global Expansion', emoji: '✨', desc: 'Redefining travel for millions around the world.' },
                            ].map((item, i) => (
                                <FadeIn key={i} delay={i * 0.12}>
                                    <div className="flex flex-col items-center text-center group">
                                        {/* Circle */}
                                        <motion.div
                                            whileHover={{ scale: 1.12 }}
                                            className="w-[104px] h-[104px] rounded-full bg-white border-[3px] border-sky-400 flex items-center justify-center font-bold text-[19px] text-[#0f172a] shadow-[0_0_20px_rgba(14,165,233,0.12)] group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-teal-500 group-hover:text-white group-hover:border-transparent transition-all duration-400 cursor-pointer z-10 relative mb-5"
                                        >
                                            {item.year}
                                            <div className="absolute inset-0 rounded-full border-2 border-sky-300/0 group-hover:border-sky-300/30 group-hover:scale-[1.3] transition-all duration-500" />
                                        </motion.div>

                                        <h4 className="text-[20px] font-semibold text-[#0f172a] mb-2">
                                            {item.title} {item.emoji}
                                        </h4>
                                        <p className="text-[17px] text-[#6b7c93] font-normal leading-relaxed max-w-[230px]">
                                            {item.desc}
                                        </p>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            {/* ═══════════════════════════════════════════
                6. CALL TO ACTION
            ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-[#fafcff]">
                <div className="w-full max-w-[1400px] mx-auto px-10">
                    <FadeIn>
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#164e63] to-[#0d9488] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.25)]">
                            {/* Dot pattern */}
                            <div className="absolute inset-0 opacity-[0.05]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:26px_26px]" />
                            </div>

                            <div className="relative z-10 py-16 md:py-20 text-center px-8">
                                <h2 className="text-[28px] md:text-[38px] lg:text-[44px] font-bold text-white tracking-tight mb-8 leading-tight">
                                    Your Next Journey <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
                                        Deserves More Than Planning.
                                    </span>
                                </h2>
                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                >
                                    <Link
                                        href="/destinations"
                                        className="inline-flex items-center gap-3 px-10 py-4.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full font-semibold text-[18px] tracking-wide overflow-hidden transition-all duration-300 shadow-lg hover:shadow-sky-500/25 hover:from-sky-400 hover:to-teal-400 group"
                                    >
                                        Start Designing Your Journey
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>


        </div>
    );
}
