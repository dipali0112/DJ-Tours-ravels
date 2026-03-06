'use client';

import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Send, Bell, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function NewsletterPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('https://dj-tours-ravels-production.up.railway.app/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Something went wrong');

            setStatus('success');
            setMessage(data.message);
            setEmail('');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message);
        }
    };

    return (
        <main className="min-h-screen bg-white text-[#0f172a]">
            <Navbar />

            <section className="relative pt-40 pb-32 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-sky-100 rounded-full blur-[140px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-[0.3em] text-[10px] mb-8"
                    >
                        <Bell className="h-4 w-4" />
                        Stay Updated
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10"
                    >
                        The Indian <br />
                        <span className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">Traveler’s Digest.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[#64748b] font-medium mb-16 max-w-2xl mx-auto leading-relaxed"
                    >
                        Get monthly curated itineraries, secret destination reveals, and exclusive early access to AI travel tools—directly in your inbox.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-4 md:p-6 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(14,165,233,0.15)] border border-blue-50 max-w-2xl mx-auto relative overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center justify-center text-center p-6"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 mx-auto">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#0f172a] mb-2">You're on the list!</h3>
                                    <p className="text-[#64748b] font-medium mb-6 max-w-md mx-auto">{message}</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="text-sm font-bold text-[#0ea5e9] hover:underline"
                                    >
                                        Subscribe another email
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubscribe}
                                    className="flex flex-col md:flex-row gap-4 relative z-10"
                                >
                                    <div className="flex-1 relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            disabled={status === 'loading'}
                                            className={`w-full px-8 py-5 bg-[#f8fbff] rounded-full border focus:outline-none focus:ring-2 font-medium transition-all
                                                ${status === 'error'
                                                    ? 'border-red-200 focus:ring-red-500/20 text-red-900 placeholder:text-red-300'
                                                    : 'border-blue-100/50 focus:ring-[#0ea5e9]/20 text-[#0f172a]'
                                                }
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                            `}
                                        />
                                        {status === 'error' && (
                                            <div className="absolute top-1/2 -translate-y-1/2 right-6 text-red-500 animate-pulse">
                                                <AlertCircle className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="px-10 py-5 bg-[#0ea5e9] text-white font-bold rounded-full flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed min-w-[160px]"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>Subscribe <Send className="h-4 w-4" /></>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Error Message Toast */}
                        <AnimatePresence>
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-sm font-bold text-left px-8 mt-2"
                                >
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <AnimatePresence>
                        {status !== 'success' && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8 text-sm text-[#64748b]/60 font-medium"
                            >
                                Join 50,000+ explorers already on the list. No spam, only magic.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Newsletter Perks */}
            <section className="pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Exclusive Deals", desc: "Unlock special discounts with our partner hotels and guides across Bharat." },
                            { title: "Hidden Gems", desc: "First look at off-beat locations before they become mainstream." },
                            { title: "AI Pro Tips", desc: "Master our travel AI with weekly prompts and advanced planning techniques." }
                        ].map((perk, idx) => (
                            <div key={idx} className="p-10 border border-blue-50 rounded-[2.5rem] bg-gradient-to-b from-white to-[#f8fbff] hover:border-[#0ea5e9]/20 transition-all">
                                <Sparkles className="h-6 w-6 text-[#0ea5e9] mb-6" />
                                <h4 className="text-xl font-bold mb-4">{perk.title}</h4>
                                <p className="text-[#64748b] leading-relaxed font-medium">{perk.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </main>
    );
}
