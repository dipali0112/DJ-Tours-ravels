'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, Clock } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '@/context/ChatContext';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
    const { setIsChatOpen } = useChat();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <main className="min-h-screen bg-white text-[#0f172a]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden bg-[#f8fbff]">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-[0.3em] text-[10px] mb-6"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Contact Us
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6"
                    >
                        Let’s start your <br />
                        <span className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">next story.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[#64748b] font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Have questions about our AI-curated itineraries? Our experts and AI guides are here to help you plan the perfect journey across India.
                    </motion.p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-black mb-4">Get in touch.</h2>
                                <p className="text-[#64748b] text-base font-medium leading-relaxed">
                                    Whether you're looking for hidden Himalayan trails or serene Kerala backwaters, we're ready to assist.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-xl bg-[#f8fbff] flex items-center justify-center text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-all shadow-sm">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Email Support</p>
                                        <p className="text-lg font-bold">dipali.joshi@futurrizon.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-xl bg-[#f8fbff] flex items-center justify-center text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-all shadow-sm">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Phone Support</p>
                                        <p className="text-lg font-bold">+91 1800-BLOOSM</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-xl bg-[#f8fbff] flex items-center justify-center text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-all shadow-sm">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Our Base</p>
                                        <p className="text-lg font-bold">Ahmedabad, India</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="w-full text-left p-6 bg-blue-600 rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-blue-500/20 hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98] transition-all group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-125" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-12 transition-transform">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base flex items-center gap-2">
                                            AI Planning Agent
                                            <Sparkles className="h-4 w-4 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h4>
                                        <p className="text-white/60 text-xs font-medium">Get instant itineraries & travel support</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-blue-50 shadow-xl relative">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                                        <Send className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Message Sent!</h3>
                                    <p className="text-[#64748b] text-lg font-medium">We'll get back to you shortly.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Full Name</label>
                                                <input required className="w-full px-6 py-3.5 bg-[#f8fbff] rounded-2xl border border-blue-100 focus:ring-2 focus:ring-[#0ea5e9]/20 outline-none transition-all font-medium text-sm" placeholder="Ex: Rahul Sharma" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Email Address</label>
                                                <input type="email" required className="w-full px-6 py-3.5 bg-[#f8fbff] rounded-2xl border border-blue-100 focus:ring-2 focus:ring-[#0ea5e9]/20 outline-none transition-all font-medium text-sm" placeholder="Ex: rahul@email.com" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Subject</label>
                                            <input required className="w-full px-6 py-3.5 bg-[#f8fbff] rounded-2xl border border-blue-100 focus:ring-2 focus:ring-[#0ea5e9]/20 outline-none transition-all font-medium text-sm" placeholder="How can we help?" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Message</label>
                                            <textarea required rows={4} className="w-full px-6 py-3.5 bg-[#f8fbff] rounded-[1.5rem] border border-blue-100 focus:ring-2 focus:ring-[#0ea5e9]/20 outline-none transition-all font-medium text-sm resize-none" placeholder="Tell us about your dream trip..."></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-98 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {status === 'sending' ? 'Sending Magic...' : (
                                            <>Send Message <Sparkles className="h-4 w-4" /></>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
