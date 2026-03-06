"use client";

import React, { use, useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { trips } from '@/lib/mockData';
import { notFound, useRouter } from 'next/navigation'; // Import useRouter
import { CreditCard, Calendar, User, Mail, Phone, Lock, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx'; // Ensure clsx is imported if you use it, or just use template literals

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const trip = trips.find((t) => t.id === id);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!trip) {
        notFound();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call/payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setLoading(false);
        setSuccess(true);

        // Optional: Redirect after a few seconds
        // setTimeout(() => router.push('/'), 5000);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                        <p className="text-gray-600 mb-8">
                            Thank you for booking your trip to <span className="font-semibold text-gray-900">{trip.destination}</span>.
                            A confirmation email has been sent to your inbox.
                        </p>
                        <Link href="/" className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block w-full">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Link href={`/destinations/${trip.id}`} className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Trip Details
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Booking Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Booking</h1>
                            <p className="text-gray-600">Please fill in your details to secure your spot.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Traveler Details */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Traveler Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">First Name</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input required type="email" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input required type="tel" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="+1 (555) 000-0000" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    Payment Information
                                </h2>

                                <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex items-start gap-3">
                                    <Lock className="h-5 w-5 flex-shrink-0" />
                                    <p>This is a secure 256-bit SSL encrypted payment. Your data is safe.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John Doe" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input required type="text" maxLength={19} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="0000 0000 0000 0000" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                                            <input required type="text" maxLength={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">CVC / CVV</label>
                                            <input required type="text" maxLength={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="123" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        Confirm & Pay ₹{trip.budget.toLocaleString('en-IN')}
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400">
                                By clicking the button, you agree to our Terms & Conditions.
                            </p>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="relative h-48">
                                <Image
                                    src={trip.image}
                                    alt={trip.destination}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-bold text-xl text-shadow-sm">{trip.destination}</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Dates
                                    </span>
                                    <span className="font-medium text-sm">{trip.dates.split(' to ')[0]}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-medium text-sm">{trip.duration}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-600">Guests</span>
                                    <span className="font-medium text-sm">1 Adult</span>
                                </div>

                                <div className="pt-4 mt-2">
                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{trip.budget.toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 text-right">Includes all taxes and fees</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
