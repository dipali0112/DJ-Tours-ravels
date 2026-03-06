"use client";

import React, { use, useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import {
    MapPin, Star, Calendar, Clock, ArrowLeft, Heart, Share2,
    Sparkles, ArrowRight, ShieldCheck, Quote, Check, Sun,
    Mountain, Utensils, Camera, Compass, Globe, Users, Plane,
    ChevronDown, ChevronUp, Thermometer, CloudRain, Wind,
    Backpack, Wifi, CreditCard, Phone, Map, X, CheckCircle2,
    Award, TrendingUp, Umbrella, Shirt
} from 'lucide-react';
import { trips } from '@/lib/mockData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════
   DYNAMIC DATA MAPS
═══════════════════════════════════════════════════ */

// Itineraries per destination
const itineraries: Record<string, { day: number; title: string; activities: string[]; highlight: string }[]> = {
    'Goa': [
        { day: 1, title: 'Arrival & Beach Sunset', activities: ['Airport pickup & hotel check-in', 'Relax at Calangute Beach', 'Sunset dinner at a shack by the sea'], highlight: 'Golden hour beach walk' },
        { day: 2, title: 'Heritage Walk — Old Goa', activities: ['Basilica of Bom Jesus (UNESCO)', 'Se Cathedral & Church of St. Francis', 'Authentic Goan fish curry lunch'], highlight: 'UNESCO World Heritage Sites' },
        { day: 3, title: 'Water Sports at Baga', activities: ['Parasailing over the Arabian Sea', 'Jet skiing & banana boat rides', 'Night market shopping at Arpora'], highlight: 'Adrenaline-filled day' },
        { day: 4, title: 'Spice Plantation & Dudhsagar', activities: ['Tropical spice plantation tour', 'Elephant bathing experience', 'Jeep safari to Dudhsagar Falls'], highlight: 'Majestic waterfall encounter' },
        { day: 5, title: 'South Goa & Palolem Beach', activities: ['Explore pristine Palolem Beach', 'Kayaking through mangroves', 'Farewell bonfire dinner on the beach'], highlight: 'Peaceful beach paradise' },
        { day: 6, title: 'Departure Day', activities: ['Sunrise yoga on the beach', 'Last-minute souvenir shopping', 'Airport transfer & departure'], highlight: 'Memorable farewell' },
    ],
    'Manali': [
        { day: 1, title: 'Arrival in the Mountains', activities: ['Volvo arrival or Kullu airport pickup', 'Check-in to riverside resort', 'Evening Mall Road stroll'], highlight: 'Mountain fresh air' },
        { day: 2, title: 'Solang Valley Adventure', activities: ['Paragliding over the valley', 'Zorbing & rope course activities', 'Hot chocolate at a valley café'], highlight: 'Thrilling paragliding' },
        { day: 3, title: 'Rohtang Pass Expedition', activities: ['Drive to Rohtang Pass (13,050 ft)', 'Snow play & photography', 'Atal Tunnel exploration'], highlight: 'Snow-capped panorama' },
        { day: 4, title: 'Kullu Rafting & Temples', activities: ['White-water rafting on Beas River', 'Visit Hadimba Devi Temple', 'Traditional Himachali cuisine dinner'], highlight: 'River rafting thrill' },
        { day: 5, title: 'Old Manali Exploration', activities: ['Bohemian cafés & street art walk', 'Visit Vashisht Hot Springs', 'Shopping for Kullu shawls'], highlight: 'Charming old-world vibes' },
        { day: 6, title: 'Naggar Castle & Art', activities: ['Medieval Naggar Castle visit', 'Nicholas Roerich Art Gallery', 'Scenic nature trek through cedar forests'], highlight: 'Art & history immersion' },
        { day: 7, title: 'Departure', activities: ['Sunrise photography', 'Breakfast at resort', 'Transfer to airport/bus station'], highlight: 'Mountain memories' },
    ],
    'Jaipur': [
        { day: 1, title: 'Welcome to the Pink City', activities: ['Airport transfer & heritage hotel check-in', 'Nahargarh Fort panoramic sunset', 'Rajasthani dinner with folk music'], highlight: 'Royal City welcome' },
        { day: 2, title: 'Amber Fort & Hawa Mahal', activities: ['Jeep ride to Amber Fort', 'Mirror Palace & Sheesh Mahal', 'Palace of Winds photography stop'], highlight: 'Iconic Amber Fort' },
        { day: 3, title: 'City Palace & Jantar Mantar', activities: ['Royal City Palace museum tour', 'Astronomical instruments at Jantar Mantar', 'Albert Hall Museum visit'], highlight: 'Royal heritage walk' },
        { day: 4, title: 'Craft & Culture Tours', activities: ['Block printing workshop', 'Sanganer paper-making village', 'Authentic street food trail at Johari Bazaar'], highlight: 'Hands-on craft experience' },
        { day: 5, title: 'Shopping & Royal Cuisine', activities: ['Gem & jewelry shopping', 'Bapu Bazaar textiles exploration', 'Grand Royal Rajasthani thali farewell dinner'], highlight: 'Vibrant bazaar adventure' },
        { day: 6, title: 'Departure', activities: ['Early morning Jal Mahal photography', 'Souvenir packing', 'Airport transfer'], highlight: 'Colors of Rajasthan' },
    ],
};

const defaultItinerary = (dest: string, days: number) => {
    const items = [
        { day: 1, title: `Arrival in ${dest}`, activities: ['Airport/Station pickup', 'Hotel check-in & orientation', 'Local area exploration walk'], highlight: 'Welcome vibes' },
        { day: 2, title: 'Cultural Heritage Day', activities: ['Visit iconic landmarks', 'Local history museum tour', 'Traditional cuisine experience'], highlight: 'Heritage discovery' },
        { day: 3, title: 'Nature & Adventure', activities: ['Guided nature trek', 'Scenic viewpoint visits', 'Outdoor adventure activities'], highlight: 'Natural beauty' },
        { day: 4, title: 'Local Life Experience', activities: ['Visit local markets', 'Cooking class with locals', 'Evening cultural performance'], highlight: 'Authentic immersion' },
        { day: 5, title: 'Hidden Gems & Leisure', activities: ['Off-the-beaten-path exploration', 'Photography at secret spots', 'Relaxation & spa time'], highlight: 'Secret discoveries' },
    ];
    if (days > 6) items.push({ day: 6, title: 'Extended Exploration', activities: ['Day trip to nearby attraction', 'Local craft workshop', 'Sunset ceremony/experience'], highlight: 'Bonus adventure' });
    items.push({ day: items.length + 1, title: 'Farewell & Departure', activities: ['Last sunrise moment', 'Souvenir shopping', 'Airport/Station transfer'], highlight: 'Unforgettable memories' });
    return items;
};

// Gallery per category
const categoryGallery: Record<string, string[]> = {
    'Beach': [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    ],
    'Mountain': [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800',
    ],
    'Heritage': [
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&q=80&w=800',
    ],
    'Nature': [
        'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800',
    ],
    'Spiritual': [
        'https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1591018653367-2d7e4e7a7e3b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1609766857370-77b03e4fdab4?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1602508451921-22e1a1aadac2?auto=format&fit=crop&q=80&w=800',
    ],
    'Adventure': [
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=800',
    ],
};

// Travel tips per category
const travelTips: Record<string, { icon: any; title: string; info: string }[]> = {
    'Beach': [
        { icon: Sun, title: 'Best Time', info: 'October to March' },
        { icon: Thermometer, title: 'Temperature', info: '25°C – 35°C' },
        { icon: Shirt, title: 'What to Wear', info: 'Light cotton, swimwear' },
        { icon: Umbrella, title: 'Monsoon', info: 'June – September' },
    ],
    'Mountain': [
        { icon: Sun, title: 'Best Time', info: 'April to June, Sept–Oct' },
        { icon: Thermometer, title: 'Temperature', info: '-5°C – 20°C' },
        { icon: Shirt, title: 'What to Wear', info: 'Warm layers, jacket' },
        { icon: Wind, title: 'Altitude', info: 'Acclimatize properly' },
    ],
    'Heritage': [
        { icon: Sun, title: 'Best Time', info: 'October to March' },
        { icon: Thermometer, title: 'Temperature', info: '10°C – 30°C' },
        { icon: Shirt, title: 'What to Wear', info: 'Comfortable casuals' },
        { icon: Camera, title: 'Photography', info: 'Sunrise is best' },
    ],
    'Nature': [
        { icon: Sun, title: 'Best Time', info: 'Sept to March' },
        { icon: Thermometer, title: 'Temperature', info: '15°C – 28°C' },
        { icon: Shirt, title: 'What to Wear', info: 'Trek-friendly clothes' },
        { icon: CloudRain, title: 'Rainfall', info: 'Carry rain gear' },
    ],
    'Spiritual': [
        { icon: Sun, title: 'Best Time', info: 'Oct to March' },
        { icon: Thermometer, title: 'Temperature', info: '15°C – 32°C' },
        { icon: Shirt, title: 'What to Wear', info: 'Modest, respectful' },
        { icon: Globe, title: 'Culture', info: 'Observe local customs' },
    ],
    'Adventure': [
        { icon: Sun, title: 'Best Time', info: 'March to June' },
        { icon: Thermometer, title: 'Temperature', info: '5°C – 25°C' },
        { icon: Backpack, title: 'Gear', info: 'Sturdy shoes essential' },
        { icon: ShieldCheck, title: 'Safety', info: 'Insurance recommended' },
    ],
};

/* ═══════════════════════════════════════════════════
   MAIN PAGE 
═══════════════════════════════════════════════════ */
export default function DestinationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const trip = trips.find((t) => t.id === id);
    if (!trip) notFound();
    return <DestinationDetailsContent trip={trip} />;
}

/* ═══════════════════════════════════════════════════
   CONTENT COMPONENT
═══════════════════════════════════════════════════ */
function DestinationDetailsContent({ trip }: { trip: any }) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 600], [0, 200]);
    const [liked, setLiked] = useState(false);
    const [openDay, setOpenDay] = useState<number | null>(0);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [showSticky, setShowSticky] = useState(false);

    const dest = trip.destination;
    const daysNum = parseInt(trip.duration) || 5;
    const journey = itineraries[dest] || defaultItinerary(dest, daysNum);
    const gallery = categoryGallery[trip.category] || categoryGallery['Nature'];
    const tips = travelTips[trip.category] || travelTips['Nature'];

    // Related destinations (same category, different id)
    const related = trips.filter(t => t.category === trip.category && t.id !== trip.id).slice(0, 3);

    // Show sticky bar after scrolling past hero
    useEffect(() => {
        const unsub = scrollY.on('change', (v) => setShowSticky(v > 700));
        return unsub;
    }, [scrollY]);

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <Navbar />

            {/* ══════════════════════════════════════
               STICKY BOOKING BAR
            ══════════════════════════════════════ */}
            <AnimatePresence>
                {showSticky && (
                    <motion.div
                        initial={{ y: -80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -80, opacity: 0 }}
                        className="fixed top-[72px] left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg"
                    >
                        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={trip.image} alt={dest} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-[16px] font-bold text-[#0f172a]">{dest}</h4>
                                    <div className="flex items-center gap-3 text-[12px] text-gray-500">
                                        <span>{trip.duration}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{trip.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:block text-right">
                                    <span className="text-[12px] text-gray-400 block">From</span>
                                    <span className="text-xl font-black text-[#0f172a]">₹{trip.budget.toLocaleString('en-IN')}</span>
                                </div>
                                <Link
                                    href={`/booking/${trip.id}`}
                                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-[14px] hover:shadow-lg hover:shadow-teal-500/25 transition-all"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════
               1. HERO SECTION
            ══════════════════════════════════════ */}
            <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden">
                <motion.div style={{ y }} className="absolute inset-0 z-0">
                    <motion.img
                        src={trip.image}
                        alt={dest}
                        className="w-full h-[120%] object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, ease: 'easeOut' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/50 to-[#0a1628]/10 z-10" />
                </motion.div>

                {/* Back + Actions */}
                <div className="absolute top-24 left-0 right-0 z-20 px-6 lg:px-16 max-w-[1400px] mx-auto flex items-center justify-between">
                    <Link href="/destinations" className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[14px] font-medium hover:bg-white/20 transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                    <div className="flex gap-2">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setLiked(!liked)} className={cn("p-2.5 rounded-full backdrop-blur-md border transition-all", liked ? "bg-red-500/20 border-red-400/40 text-red-400" : "bg-white/10 border-white/20 text-white")}>
                            <Heart className={cn("w-5 h-5", liked && "fill-current")} />
                        </motion.button>
                        <button className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Hero Text */}
                <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:px-16 pb-24">
                    <div className="max-w-[1400px] mx-auto">
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                            <div className="flex flex-wrap gap-2 mb-5">
                                <span className="px-3 py-1 rounded-full bg-teal-500/30 border border-teal-400/40 text-teal-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">{trip.category}</span>
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">{trip.mood || 'Explore'}</span>
                                {trip.isOffbeat && <span className="px-3 py-1 rounded-full bg-orange-500/30 border border-orange-400/40 text-orange-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">Offbeat</span>}
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-4">{dest}</h1>
                            <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-6 font-medium leading-relaxed">{trip.description}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
               FLOATING INFO BAR (overlapping hero)
            ══════════════════════════════════════ */}
            <div className="relative z-30 -mt-16 px-6 lg:px-16 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="max-w-[1200px] mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 p-6 md:p-8"
                >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600"><Clock className="w-5 h-5" /></div>
                            <div><span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold block">Duration</span><span className="text-[16px] font-bold text-[#0f172a]">{trip.duration}</span></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><MapPin className="w-5 h-5" /></div>
                            <div><span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold block">Location</span><span className="text-[16px] font-bold text-[#0f172a]">{dest}, India</span></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600"><Star className="w-5 h-5" /></div>
                            <div><span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold block">Rating</span><span className="text-[16px] font-bold text-[#0f172a]">{trip.rating} <span className="text-gray-400 text-[13px]">({trip.reviews})</span></span></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><CreditCard className="w-5 h-5" /></div>
                            <div><span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold block">Starting At</span><span className="text-[16px] font-bold text-[#0f172a]">₹{trip.budget.toLocaleString('en-IN')}</span></div>
                        </div>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Link href={`/booking/${trip.id}`} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-[15px] shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all group">
                                Book Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* ══════════════════════════════════════
               2. TRIP OVERVIEW — Two Column Layout
            ══════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                        {/* Left: About & Inclusions */}
                        <div className="lg:col-span-2 space-y-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <h2 className="text-3xl md:text-[42px] font-black text-[#0f172a] tracking-tight mb-6">About This Trip</h2>
                                <p className="text-[#64748b] text-[18px] leading-[1.9] mb-4">{trip.description} Immerse yourself in a carefully curated journey designed to give you the most authentic and memorable experience. Every detail from accommodation to local experiences has been thoughtfully planned.</p>
                                {trip.regrets && (
                                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                        <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-[15px] text-amber-800 font-medium"><strong>Good to know:</strong> {trip.regrets}</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* What's Included / Not Included */}
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                    <h3 className="text-xl font-bold text-[#0f172a] mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> What&apos;s Included</h3>
                                    <ul className="space-y-3">
                                        {['Accommodation', 'Daily Breakfast', 'Airport Transfers', 'Sightseeing Tours', 'Local Guide', 'All Entry Tickets'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-[16px] text-gray-700 font-medium">
                                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100">
                                    <h3 className="text-xl font-bold text-[#0f172a] mb-4 flex items-center gap-2"><X className="w-5 h-5 text-red-400" /> Not Included</h3>
                                    <ul className="space-y-3">
                                        {['International Flights', 'Travel Insurance', 'Personal Expenses', 'Lunch & Dinner', 'Visa Fees', 'Tips & Gratuities'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-[16px] text-gray-700 font-medium">
                                                <X className="w-4 h-4 text-red-400 flex-shrink-0" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Travel Essentials Card */}
                        <div className="lg:col-span-1">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="sticky top-32">
                                <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-7 text-white mb-6">
                                    <h3 className="text-xl font-bold mb-5 flex items-center gap-2"><Compass className="w-5 h-5 text-teal-400" /> Travel Essentials</h3>
                                    <div className="space-y-4">
                                        {tips.map((tip, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-teal-400 flex-shrink-0"><tip.icon className="w-4.5 h-4.5" /></div>
                                                <div><span className="text-[12px] text-gray-400 uppercase tracking-wider font-medium block">{tip.title}</span><span className="text-[15px] font-semibold text-white">{tip.info}</span></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Booking Card */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-[34px] font-black text-[#0f172a]">₹{trip.budget.toLocaleString('en-IN')}</span>
                                        <span className="text-gray-400 text-[15px]">/ person</span>
                                    </div>
                                    <p className="text-[14px] text-gray-500 mb-5">{trip.duration} • All inclusive</p>
                                    <Link href={`/booking/${trip.id}`} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-[16px] shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all group">
                                        Book Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <div className="flex items-center justify-center gap-2 mt-4 text-[13px] text-gray-400">
                                        <ShieldCheck className="w-4 h-4" /> Free cancellation up to 48 hours
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
               3. DAY-BY-DAY ITINERARY
            ══════════════════════════════════════ */}
            <section className="py-20 bg-[#f8fbff]">
                <div className="max-w-[1000px] mx-auto px-6 lg:px-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 text-teal-600 font-bold text-[13px] uppercase tracking-[0.2em] mb-3"><Map className="w-4 h-4" /> Detailed Plan</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight">Day-by-Day Itinerary</h2>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-teal-300 via-teal-200 to-gray-100 hidden md:block" />

                        <div className="space-y-5">
                            {journey.map((item, i) => {
                                const isOpen = openDay === i;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div className={cn("relative md:ml-16 rounded-2xl border overflow-hidden transition-all duration-300", isOpen ? "border-teal-200 bg-white shadow-lg shadow-teal-500/5" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm")}>
                                            {/* Circle on timeline */}
                                            <div className={cn("absolute -left-[3.15rem] top-6 w-5 h-5 rounded-full border-[3px] z-10 hidden md:block", isOpen ? "bg-teal-500 border-teal-200" : "bg-white border-gray-200")} />

                                            <button onClick={() => setOpenDay(isOpen ? null : i)} className="w-full flex items-center gap-4 p-5 text-left">
                                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-[17px] transition-all duration-300 flex-shrink-0", isOpen ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md" : "bg-gray-50 text-[#0f172a] border border-gray-100")}>
                                                    {item.day}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className={cn("text-[11px] font-bold uppercase tracking-widest block mb-0.5", isOpen ? "text-teal-500" : "text-gray-400")}>Day {item.day}</span>
                                                    <h4 className="text-[17px] font-bold text-[#0f172a] tracking-tight">{item.title}</h4>
                                                </div>
                                                <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold hidden md:block", isOpen ? "bg-teal-50 text-teal-600" : "bg-gray-50 text-gray-400")}>{item.highlight}</span>
                                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors", isOpen ? "bg-teal-50 text-teal-600" : "bg-gray-50 text-gray-400")}>
                                                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                                                        <div className="px-5 pb-5 pl-[4.5rem]">
                                                            <ul className="space-y-2.5">
                                                                {item.activities.map((act, j) => (
                                                                    <li key={j} className="flex items-start gap-2.5 text-[15px] text-[#64748b] font-medium">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                                                                        {act}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
               4. PHOTO GALLERY
            ══════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-[1300px] mx-auto px-6 lg:px-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 text-orange-500 font-bold text-[13px] uppercase tracking-[0.2em] mb-3"><Camera className="w-4 h-4" /> Visual Story</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight">Photo Gallery</h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {gallery.map((src, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedImg(src)}
                                className={cn("relative overflow-hidden rounded-2xl cursor-pointer group", i === 0 ? "md:col-span-2 md:row-span-2 h-64 md:h-[420px]" : "h-48 md:h-[200px]")}
                            >
                                <img src={src} alt={`${dest} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImg && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImg(null)}
                            className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
                        >
                            <motion.img
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                src={selectedImg}
                                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                            />
                            <button onClick={() => setSelectedImg(null)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ══════════════════════════════════════
               5. TRAVELER REVIEWS
            ══════════════════════════════════════ */}
            <section className="py-20 bg-[#f8fbff]">
                <div className="max-w-[1200px] mx-auto px-6 lg:px-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 text-violet-500 font-bold text-[13px] uppercase tracking-[0.2em] mb-3"><Quote className="w-4 h-4" /> Real Stories</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight">Traveler Reviews</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Arjun S.', role: 'Solo Traveler', text: `${dest} was beyond amazing! Every moment was carefully planned and the local experiences were unforgettable.`, rating: 5 },
                            { name: 'Priya M.', text: 'The best vacation I\'ve ever had. The team took care of everything and the accommodations were superb!', role: 'Couple Trip', rating: 5 },
                            { name: 'Vikram R.', text: 'Incredible value for money. The itinerary was perfectly balanced between activities and relaxation.', role: 'Family Trip', rating: 4 },
                        ].map((rev, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                            >
                                <div className="absolute top-3 right-4 text-gray-100 group-hover:text-teal-50 transition-colors">
                                    <Quote className="h-10 w-10" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-full overflow-hidden bg-teal-100 ring-2 ring-teal-200/50">
                                            <img src={`https://i.pravatar.cc/88?u=dest-rev-${i}`} alt={rev.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-[#0f172a] text-[15px]">{rev.name}</h5>
                                            <span className="text-[12px] text-gray-400 font-medium">{rev.role}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(rev.rating)].map((_, s) => <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                    <p className="text-[#64748b] text-[15px] font-medium leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
               6. RELATED DESTINATIONS
            ══════════════════════════════════════ */}
            {related.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-[1300px] mx-auto px-6 lg:px-16">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
                            <div>
                                <span className="inline-flex items-center gap-2 text-teal-500 font-bold text-[13px] uppercase tracking-[0.2em] mb-3"><Compass className="w-4 h-4" /> Explore More</span>
                                <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight">Similar Destinations</h2>
                            </div>
                            <Link href="/destinations" className="hidden md:flex items-center gap-2 text-teal-600 font-bold text-[14px] hover:gap-3 transition-all">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {related.map((rel, i) => (
                                <motion.div
                                    key={rel.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link href={`/destinations/${rel.id}`} className="group block rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-500">
                                        <div className="relative h-52 overflow-hidden">
                                            <img src={rel.image} alt={rel.destination} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute bottom-3 left-3">
                                                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold text-[#0f172a] uppercase tracking-wider">{rel.category}</span>
                                            </div>
                                            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/20 backdrop-blur text-white text-[12px] font-bold">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {rel.rating}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-[#0f172a] mb-1 group-hover:text-teal-600 transition-colors">{rel.destination}</h3>
                                            <p className="text-[14px] text-gray-500 line-clamp-1 mb-3">{rel.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-black text-[#0f172a]">₹{rel.budget.toLocaleString('en-IN')}</span>
                                                <span className="text-[13px] text-gray-400 font-medium">{rel.duration}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════
               7. CTA BOTTOM
            ══════════════════════════════════════ */}
            <section className="py-20 bg-[#f8fbff]">
                <div className="max-w-[1300px] mx-auto px-6 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-3xl p-10 md:p-14 text-center overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                                Ready to Explore {dest}?
                            </h2>
                            <p className="text-white/60 text-[16px] max-w-lg mx-auto mb-8 font-medium">
                                Book your dream trip today and create memories that last a lifetime. Limited spots available!
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                                <Link href={`/booking/${trip.id}`} className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-teal-500/25 hover:shadow-teal-500/50 transition-all">
                                    Book This Trip <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="flex items-center justify-center gap-6 text-[13px] text-gray-400">
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Cancellation</span>
                                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-yellow-400" /> Best Price Guarantee</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="h-12" />
        </div>
    );
}