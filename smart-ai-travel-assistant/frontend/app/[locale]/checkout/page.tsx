'use client';

import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CreditCard, Lock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const planName = searchParams.get('plan') || 'The Nomad';
    const planPrice = searchParams.get('price') || '₹999';

    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('processing');

        try {
            const res = await fetch('https://dj-tours-ravels-production.up.railway.app/api/payment/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: planName,
                    amount: planPrice,
                    userDetails: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone
                    },
                    paymentMethod: {
                        cardNumber: formData.cardNumber
                    }
                })
            });

            if (!res.ok) throw new Error('Payment failed');

            // Success Animation Delay
            setTimeout(() => {
                setStatus('success');
            }, 1000);

        } catch (error) {
            alert('Payment failed. Please try again.');
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <main className="min-h-screen bg-[#f8fbff] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white max-w-md w-full p-8 rounded-[2.5rem] shadow-xl text-center border border-blue-50"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black text-[#0f172a] mb-2">Order Confirmed!</h1>
                    <p className="text-[#64748b] mb-8">
                        Welcome to {planName}. Your journey begins now. A receipt has been sent to {formData.email}.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 bg-[#0ea5e9] text-white font-bold rounded-xl hover:bg-[#0284c7] transition-all"
                    >
                        Start Exploring
                    </button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8fbff] text-[#0f172a]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Form */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-2">Secure Checkout</h1>
                            <p className="text-[#64748b]">Complete your purchase to unlock premium access.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Details */}
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-50">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0ea5e9] flex items-center justify-center text-sm font-black">1</div>
                                    Personal Details
                                </h3>
                                <div className="space-y-4">
                                    <input
                                        required
                                        name="name"
                                        placeholder="Full Name"
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-[#f8fbff] rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-[#f8fbff] rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
                                        />
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-[#f8fbff] rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-50">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0ea5e9] flex items-center justify-center text-sm font-black">2</div>
                                    Payment Method
                                </h3>

                                <div className="p-4 bg-gray-50 rounded-xl mb-6 flex items-center gap-4 border border-gray-100">
                                    <div className="w-12 h-8 bg-white rounded border flex items-center justify-center">
                                        <div className="w-6 h-4 bg-red-500 rounded-sm opacity-80" />
                                    </div>
                                    <div className="w-12 h-8 bg-white rounded border flex items-center justify-center">
                                        <div className="w-6 h-4 bg-blue-500 rounded-sm opacity-80" />
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium ml-auto flex items-center gap-1">
                                        <Lock className="h-3 w-3" /> SSL Secure
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            name="cardNumber"
                                            placeholder="Card Number"
                                            maxLength={19}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-4 bg-[#f8fbff] rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            required
                                            name="expiry"
                                            placeholder="MM / YY"
                                            maxLength={5}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-[#f8fbff] rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
                                        />
                                        <input
                                            required
                                            name="cvc"
                                            placeholder="CVC"
                                            maxLength={3}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-[#f8fbff] rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'processing'}
                                className="w-full py-5 bg-[#0ea5e9] text-white font-bold rounded-2xl text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'processing' ? (
                                    <>Processing <Loader2 className="h-5 w-5 animate-spin" /></>
                                ) : (
                                    <>Pay {planPrice} Now <ArrowRight className="h-5 w-5" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:sticky lg:top-32">
                        <div className="bg-[#0f172a] text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                            <h3 className="text-xl font-bold mb-8 relative z-10">Order Summary</h3>

                            <div className="space-y-6 relative z-10 border-b border-white/10 pb-8 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Plan</span>
                                    <span className="font-bold text-lg">{planName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Billing Cycle</span>
                                    <span className="font-medium">Auto-renewal</span>
                                </div>
                                <div className="flex justify-between items-center text-green-400">
                                    <span>Discount</span>
                                    <span>-₹0.00</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline relative z-10">
                                <span className="text-slate-400 font-medium">Total</span>
                                <span className="text-4xl font-black tracking-tight">{planPrice}</span>
                            </div>

                            <div className="mt-8 p-4 bg-white/5 rounded-xl text-xs text-slate-400 leading-relaxed relative z-10">
                                By confirming your subscription, you allow Bloosm to charge your card for this payment and future payments in accordance with our Terms.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
