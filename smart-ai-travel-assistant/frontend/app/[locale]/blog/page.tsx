'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, User, Calendar, Sparkles, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const BLOG_POSTS = [
    {
        id: 1,
        title: "Mimisa Rocks",
        location: "Australia",
        subtitle: "A piece of heaven",
        author: "Arjun Sharma",
        date: "Oct 12, 2025",
        review: "The view from the rocks was simply breathtaking. Truly a piece of heaven on earth.",
        image: "https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Oceania",
        tag: "#Oceania"
    },
    {
        id: 2,
        title: "Himalayan Peaks",
        location: "India",
        subtitle: "Untouched Beauty",
        author: "Sarah D'Souza",
        date: "Sep 28, 2025",
        review: "Waking up to the sunrise over the Himalayas is an experience I'll never forget.",
        image: "https://images.pexels.com/photos/2106037/pexels-photo-2106037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Mountain",
        tag: "#Asia"
    },
    {
        id: 3,
        title: "Varanasi Ghats",
        location: "India",
        subtitle: "Spiritual Awakening",
        author: "Rajesh Iyer",
        date: "Aug 15, 2025",
        review: "The spiritual energy in Varanasi is palpable. A truly transformative journey.",
        image: "https://images.pexels.com/photos/1534057/pexels-photo-1534057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Spirituality",
        tag: "#HolyCity"
    },
    {
        id: 4,
        title: "Machu Picchu",
        location: "Peru",
        subtitle: "Lost Civilization",
        author: "Vikas Khanna",
        date: "Jul 04, 2025",
        review: "Stepping into the ancient world of the Incas was like traveling back in time.",
        image: "https://images.pexels.com/photos/2599629/pexels-photo-2599629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Heritage",
        tag: "#Ancient"
    },
    {
        id: 5,
        title: "Kerala Backwaters",
        location: "India",
        subtitle: "Serene Waters",
        author: "Priya Nair",
        date: "Jun 20, 2025",
        review: "Gliding through the backwaters of Kerala is the definition of tranquility.",
        image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Nature",
        tag: "#SouthIndia"
    }
];

export default function BlogPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [xOffset, setXOffset] = useState(480); // Reduced from 650 for tighter spacing

    useEffect(() => {
        const handleResize = () => {
            // Tighter spacing to remove gaps
            setXOffset(window.innerWidth < 1024 ? 300 : 480);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % BLOG_POSTS.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + BLOG_POSTS.length) % BLOG_POSTS.length);
    };

    return (
        <main className="min-h-screen bg-[#f8fbff] text-[#0f172a] overflow-hidden selection:bg-blue-500/30">
            <Navbar />

            {/* Background Aesthetic */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-blue-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent" />
            </div>

            <section className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col items-center justify-center z-10">

                {/* Header Information */}
                <div className="text-center mb-16 max-w-2xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4"
                    >
                        <Sparkles className="h-4 w-4" />
                        Travel Chronicles
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-[#0f172a]"
                    >
                        Stories Worth Telling.
                    </motion.h1>
                </div>

                {/* 3D Slider Container - Set to full width */}
                <div className="relative w-full h-[600px] flex items-center justify-center pt-10 overflow-visible" style={{ perspective: '2000px' }}>

                    {/* Navigation Arrows */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 md:left-10 z-[100] p-4 rounded-full bg-white border border-blue-100 shadow-xl hover:bg-blue-50 transition-all group lg:scale-125"
                    >
                        <ChevronLeft className="w-8 h-8 text-blue-600 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-4 md:right-10 z-[100] p-4 rounded-full bg-white border border-blue-100 shadow-xl hover:bg-blue-50 transition-all group lg:scale-125"
                    >
                        <ChevronRight className="w-8 h-8 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence initial={false}>
                            {BLOG_POSTS.map((post, index) => {
                                // Calculate position relative to active index
                                let position = index - activeIndex;
                                if (position < -2) position += BLOG_POSTS.length;
                                if (position > 2) position -= BLOG_POSTS.length;

                                // Only show 5 items max for performance and visual clarity
                                if (Math.abs(position) > 2) return null;

                                return (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, x: 0 }}
                                        animate={{
                                            // Reduced spacing to remove gaps between cards
                                            x: position * xOffset,
                                            z: Math.abs(position) === 0 ? 300 : Math.abs(position) === 1 ? 50 : -200, // Adjusted Z for smoother overlap
                                            rotateY: position * -25, // Reduced rotation for wider cards
                                            scale: Math.abs(position) === 0 ? 1 : 0.9,
                                            opacity: 1 - Math.abs(position) * 0.15,
                                            zIndex: 10 - Math.abs(position)
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 25
                                        }}
                                        style={{
                                            transformStyle: 'preserve-3d',
                                        }}
                                        // Dimension change: Wider cards (600px) and Medium height (4:3-ish aspect)
                                        className="absolute w-[380px] md:w-[600px] aspect-[4/3] cursor-pointer rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-white"
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        {/* Card Image */}
                                        <div className="relative w-full h-full group/card">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                            />
                                            {/* Gradient Overlay - Softer for light mode but still allowing text contrast */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 p-12 flex flex-col justify-end items-center text-center">
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: Math.abs(position) === 0 ? 1 : 0 }}
                                                    className="space-y-6"
                                                >
                                                    {/* Review / Testimonial Section */}
                                                    <div className="flex flex-col items-center gap-3 mb-2">
                                                        <Quote className="w-8 h-8 text-blue-400 opacity-60" />
                                                        <p className="text-xl md:text-2xl font-semibold text-slate-100 leading-relaxed max-w-[480px] line-clamp-2 italic tracking-tight">
                                                            "{post.review}"
                                                        </p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <p className="text-blue-300 font-black uppercase tracking-[0.3em] text-[12px] border border-white/20 px-4 py-1.5 rounded-full inline-block backdrop-blur-md bg-white/10">
                                                            {post.tag}
                                                        </p>
                                                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-1 text-white">
                                                            {post.title} <br />
                                                            <span className="text-white/50">— {post.location}</span>
                                                        </h2>
                                                        <div className="w-12 h-0.5 bg-white/30 mx-auto" />
                                                    </div>
                                                </motion.div>
                                            </div>

                                            {/* Author Link */}
                                            <div className="absolute top-10 left-10 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                    <User className="h-4 w-4 text-white" />
                                                </div>
                                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                                                    By {post.author}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Meta */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 flex flex-col items-center gap-4 text-slate-400"
                >
                    <div className="flex gap-10 text-[11px] font-black uppercase tracking-[0.4em]">
                        <span className="flex items-center gap-2 transition-colors hover:text-blue-500"><Calendar className="h-4 w-4" /> Updated Daily</span>
                        <span className="flex items-center gap-2 transition-colors hover:text-blue-500"><Sparkles className="h-4 w-4" /> Curated by Experts</span>
                    </div>
                    <p className="text-sm font-medium opacity-50 tracking-wide">Swipe or click arrows to explore Bharat.</p>
                </motion.div>

            </section>
        </main>
    );
}
