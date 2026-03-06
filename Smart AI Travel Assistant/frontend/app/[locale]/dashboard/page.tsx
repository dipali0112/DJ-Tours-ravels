'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Plus, Heart, MessageSquare, Map as MapIcon, User as UserIcon, CreditCard, CheckCircle2, AlertCircle, Sparkles, Wand2, ChevronRight, Users, Clock, CloudSun, Gem, Shuffle, History, AlertTriangle, X, Wallet, GitCompare, Zap, Calendar } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TripCard from '@/components/TripCard';
import SmartPlannerForm from '@/components/SmartPlannerForm';
import PlanDetailsModal from '@/components/PlanDetailsModal';
import PreferenceSetupModal from '@/components/PreferenceSetupModal';
import { MoodSelector, DecisionHelper, PackingChecklist, RegretPredictor, ComparisonModal, QuickActionBar, CreditSystemCard, AITripPlannerCard, TravelPersonalityCard, GamificationStats } from '@/components/DashboardWidgets';

import { trips as ALL_DESTINATIONS } from '@/lib/mockData';

interface Trip {
    id: string;
    destination: string;
    dates: string;
    budget: number;
    originalBudget?: number;
    image: string;
    status: string;
    isOffbeat?: boolean;
    regrets?: string;
    mood?: string;
    category: string;
}

interface AIPlan {
    id: string;
    name?: string;
    destination?: string;
    category: string;
    description: string;
    image: string;
    price?: string;
    budget?: number;
    aiItinerary: any[];
}

interface Session {
    sessionId: string;
    title: string;
    lastMessage: string;
    timestamp: string;
}

interface UserProfile {
    name: string;
    email: string;
    avatar?: string;
}

const WELCOME_QUOTES = [
    "The world is a book and those who do not travel read only one page.",
    "Travel is the only thing you buy that makes you richer.",
    "To travel is to live.",
    "Adventure is worthwhile.",
    "Traveling – it leaves you speechless, then turns you into a storyteller."
];

export default function Dashboard() {
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();

    // Core Data State
    const [trips, setTrips] = useState<Trip[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [aiPlans, setAiPlans] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // UI State
    const [activeTab, setActiveTab] = useState<'trips' | 'ai-plans' | 'checklist'>('trips');
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

    // Feature Specific State
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
    const [budgetRange, setBudgetRange] = useState<number>(100000);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [travelCredits, setTravelCredits] = useState(2500);
    const [loyaltyPoints, setLoyaltyPoints] = useState(7500); // Out of 10000
    const [comparisonDests, setComparisonDests] = useState<any[]>([]);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);
    const [activePredictorDest, setActivePredictorDest] = useState<any>(null);
    const [welcomeQuote, setWelcomeQuote] = useState("");
    const [isChatAssistantOpen, setIsChatAssistantOpen] = useState(false);
    const [hasClaimedDiscount, setHasClaimedDiscount] = useState(false);
    const [isOffbeatCreditUsed, setIsOffbeatCreditUsed] = useState(false);
    const [isStandardCreditUsed, setIsStandardCreditUsed] = useState(false);
    const [showRewardDiscovery, setShowRewardDiscovery] = useState(false);
    const [userPreferences, setUserPreferences] = useState<any>(null);
    const [isCreditApplied, setIsCreditApplied] = useState(false);
    const [aiItinerary, setAiItinerary] = useState<any | null>(null);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    // Sync budget range with user preferences when user data loads
    useEffect(() => {
        if (user?.travelPreferences) {
            setUserPreferences(user.travelPreferences);
            if (user.travelPreferences.budget) {
                setBudgetRange(user.travelPreferences.budget);
            }
        }
    }, [user]);

    const isMonthMatch = (tripDate: string, preferredMonth: string) => {
        if (!preferredMonth || preferredMonth === 'Anytime') return true;

        const monthMap: { [key: string]: string[] } = {
            'January': ['01', 'Jan'],
            'February': ['02', 'Feb'],
            'March': ['03', 'Mar'],
            'April': ['04', 'Apr'],
            'May': ['05', 'May'],
            'June': ['06', 'Jun'],
            'July': ['07', 'Jul'],
            'August': ['08', 'Aug'],
            'September': ['09', 'Sep'],
            'October': ['10', 'Oct'],
            'November': ['11', 'Nov'],
            'December': ['12', 'Dec']
        };

        const searchTerms = monthMap[preferredMonth] || [preferredMonth];
        return searchTerms.some(term => tripDate.toLowerCase().includes(term.toLowerCase()));
    };

    const toggleMood = (mood: string) => {
        setSelectedMoods(prev =>
            prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
        );
    };

    const toggleWishlist = (destId: string) => {
        setWishlist(prev =>
            prev.includes(destId) ? prev.filter(id => id !== destId) : [...prev, destId]
        );
    };

    // Auth & Navigation Guard
    useEffect(() => {
        setWelcomeQuote(WELCOME_QUOTES[Math.floor(Math.random() * WELCOME_QUOTES.length)]);

        // Load persistent reward states
        const offbeatUsed = localStorage.getItem('travel_assistant_offbeat_used') === 'true';
        const standardUsed = localStorage.getItem('travel_assistant_standard_used') === 'true';
        const discountClaimed = localStorage.getItem('travel_assistant_discount_claimed') === 'true';

        setIsOffbeatCreditUsed(offbeatUsed);
        setIsStandardCreditUsed(standardUsed);
        setHasClaimedDiscount(discountClaimed);
    }, []);

    // Persist reward states on change
    useEffect(() => {
        localStorage.setItem('travel_assistant_offbeat_used', isOffbeatCreditUsed.toString());
    }, [isOffbeatCreditUsed]);

    useEffect(() => {
        localStorage.setItem('travel_assistant_standard_used', isStandardCreditUsed.toString());
    }, [isStandardCreditUsed]);

    useEffect(() => {
        localStorage.setItem('travel_assistant_discount_claimed', hasClaimedDiscount.toString());
    }, [hasClaimedDiscount]);

    useEffect(() => {
        if (!authLoading && !token) {
            router.push('/login');
        }
    }, [authLoading, token, router]);

    // Preference Check
    useEffect(() => {
        if (user && !(user as any).travelPreferences?.setupCompleted) {
            setIsPreferenceModalOpen(true);
        }
    }, [user]);

    // Data Fetching
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [tripsRes, aiRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trips`, config),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trips/recommendations`, config)
                ]);

                // Load locally saved "Upcoming" trips to persist claims
                const localTripsJson = localStorage.getItem('travel_assistant_booked_trips');
                const localTrips = localTripsJson ? JSON.parse(localTripsJson) : [];

                // Filter out local trips that might already exist in tripsRes (if any)
                const apiTripIds = new Set(tripsRes.data.map((t: any) => t.id));
                const uniqueLocalTrips = localTrips.filter((t: any) => !apiTripIds.has(t.id));

                setTrips([
                    ...uniqueLocalTrips,
                    ...tripsRes.data,
                    {
                        id: 'hist-1',
                        destination: 'Varanasi',
                        dates: '2025-10-10 to 2025-10-15',
                        budget: 12000,
                        image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&q=80&w=1000',
                        status: 'completed',
                        category: 'Spiritual'
                    },
                    {
                        id: 'hist-2',
                        destination: 'Munnar',
                        dates: '2025-05-05 to 2025-05-10',
                        budget: 15000,
                        image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=1000',
                        status: 'completed',
                        category: 'Nature'
                    },
                    {
                        id: 'hist-3',
                        destination: 'Agra',
                        dates: '2024-12-20 to 2024-12-25',
                        budget: 8000,
                        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1000',
                        status: 'completed',
                        category: 'Heritage'
                    }
                ]);
                setAiPlans(aiRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);

                // Fallback to mock data + local storage for demo
                const localTripsJson = localStorage.getItem('travel_assistant_booked_trips');
                const localTrips = localTripsJson ? JSON.parse(localTripsJson) : [];

                const demoTrips: Trip[] = [
                    ...localTrips,
                    ...ALL_DESTINATIONS.slice(0, 2) as any,
                    {
                        id: 'hist-1',
                        destination: 'Varanasi',
                        dates: '2025-10-10 to 2025-10-15',
                        budget: 12000,
                        image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&q=80&w=1000',
                        status: 'completed',
                        category: 'Spiritual'
                    },
                    {
                        id: 'hist-2',
                        destination: 'Munnar',
                        dates: '2025-05-05 to 2025-05-10',
                        budget: 15000,
                        image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=1000',
                        status: 'completed',
                        category: 'Nature'
                    }
                ];
                setTrips(demoTrips);
                setAiPlans(ALL_DESTINATIONS.slice(2, 5));
            } finally {
                setDataLoading(false);
            }
        };

        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    // Persist new upcoming trips to localStorage
    useEffect(() => {
        if (trips.length > 0) {
            const upcomingTrips = trips.filter(t => t.id.startsWith('trip-') && t.status === 'upcoming');
            localStorage.setItem('travel_assistant_booked_trips', JSON.stringify(upcomingTrips));
        }
    }, [trips]);

    const handleApplyCredit = () => {
        if (!isCreditApplied) {
            setIsCreditApplied(true);
            // In a real app, this would update the backend
        }
    };

    const handleGeneratePlan = async (prefs: any) => {
        setIsGeneratingPlan(true);
        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const generatedPlan = {
            id: `ai-gen-${Date.now()}`,
            destination: prefs.type === 'Adventure' ? 'Leh Ladakh' : prefs.type === 'Relax' ? 'Goa' : 'Hampi',
            category: prefs.type,
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000',
            price: prefs.budget,
            duration: `${prefs.days} Days`,
            aiItinerary: Array.from({ length: prefs.days }).map((_, i) => ({
                day: i + 1,
                title: `Day ${i + 1}: ${prefs.type} Experience`,
                description: `Explore the best of ${prefs.type} vibes in this curated destination.`
            }))
        };

        setAiItinerary(generatedPlan);
        setIsGeneratingPlan(false);
        setSelectedPlan(generatedPlan);
    };

    const handleCompare = (d1Name: string, d2Name: string) => {
        const d1 = ALL_DESTINATIONS.find(d => d.destination === d1Name);
        const d2 = ALL_DESTINATIONS.find(d => d.destination === d2Name);
        if (d1 && d2) {
            setComparisonDests([d1, d2]);
            setIsComparisonOpen(true);
        }
    };


    const handleQuickCompare = (dest: any) => {
        if (comparisonDests.find(item => item.id === dest.id)) {
            setComparisonDests(comparisonDests.filter(item => item.id !== dest.id));
        } else if (comparisonDests.length < 2) {
            setComparisonDests([...comparisonDests, dest]);
        }
    };

    const handleClaimDiscount = () => {
        setHasClaimedDiscount(true);
        // Maybe show a toast or notification in the future
    };

    const handleClaimPlan = async (plan: any) => {
        // Simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Tiered Discount Logic:
        // 1. Hidden Gems (Offbeat) get ₹3,000 AUTOMATICALLY if credit is unused.
        // 2. Standard packages get ₹1,000 ONLY if user manually clicked "Claim Reward".
        const category = ((plan.category || '').toLowerCase());
        const mood = ((plan.mood || '').toLowerCase());
        const isOffbeat = (plan as any).isOffbeat === true ||
            category.includes('offbeat') ||
            category.includes('hidden gem') ||
            mood.includes('offbeat');

        const basePrice = plan.budget || parseInt(plan.price?.replace(/[^\d]/g, '') || '0');

        // AUTO-APPLY for Hidden Gems, MANUAL for others
        const creditUsed = isOffbeat ? isOffbeatCreditUsed : isStandardCreditUsed;
        const canApplyDiscount = !creditUsed && (isOffbeat || hasClaimedDiscount);
        const discountAmount = isOffbeat ? 3000 : 1000;

        const finalPrice = canApplyDiscount
            ? Math.max(0, basePrice - discountAmount)
            : isCreditApplied
                ? Math.max(0, basePrice - 1000)
                : basePrice;

        if (isCreditApplied && !canApplyDiscount) {
            setIsCreditApplied(false); // Consume the one-time credit
        }

        const newTrip: Trip = {
            id: `trip-${Date.now()}`,
            destination: plan.destination || plan.name,
            dates: plan.dates || 'Upcoming',
            budget: finalPrice,
            originalBudget: basePrice,
            image: plan.image,
            status: 'upcoming',
            category: plan.category
        };

        setTrips(prev => [newTrip, ...prev]);
        setActiveTab('ai-plans'); // Changed from 'trips' to 'ai-plans'
        // Consume credit after one-time use
        if (canApplyDiscount) {
            setHasClaimedDiscount(false);
            if (isOffbeat) {
                setIsOffbeatCreditUsed(true);
            } else {
                setIsStandardCreditUsed(true);
            }
            setTravelCredits(prev => Math.max(0, prev - discountAmount));
        }

        // Scroll to content area after a small delay
        setTimeout(() => {
            const el = document.getElementById('content-area');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    const openPredictor = (e: React.MouseEvent, dest: any) => {
        e.stopPropagation();
        setActivePredictorDest(dest);
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 1. TOP SECTION: Greeting & Quick Actions */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-10 pt-10 border-b border-gray-100 pb-12">
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                            >
                                ✨ Plan My Trip with AI • Discover Bharat
                            </motion.div>
                            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] leading-tight mb-4">
                                Hello, <span className="text-blue-600 italic">{(user?.name || 'Explorer').split(' ')[0]}</span> 👋
                            </h1>
                            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-8">
                                Recommended for your budget <span className="text-[#0f172a]">₹{(userPreferences?.budget || 20000).toLocaleString()}</span>
                            </p>
                            <button
                                onClick={() => setIsPlannerOpen(true)}
                                className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                            >
                                🗺️ Plan My Trip with AI
                            </button>
                        </div>

                        <div className="hidden lg:block w-[300px]">
                            <GamificationStats />
                        </div>
                    </div>

                    <QuickActionBar />
                </div>

                {/* 2. Structured 2-Column Responsive Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">

                    {/* LEFT COLUMN (Sidebar-like focus) */}
                    <div className="xl:col-span-4 space-y-8">
                        <AITripPlannerCard onGenerate={handleGeneratePlan} />

                        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                                <Shuffle className="h-3 w-3" /> Explore Categories
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {['Adventure', 'Beach', 'Mountain', 'Heritage', 'Nature', 'Spiritual'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleMood(cat)}
                                        className={`p-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${selectedMoods.includes(cat) ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-blue-200'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Main Stats & Controls) */}
                    <div className="xl:col-span-4 space-y-8">
                        <TravelPersonalityCard user={user} />

                        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">
                                    <Wallet className="h-3 w-3" /> Budget Range
                                </div>
                                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black italic border border-blue-100">
                                    ₹{budgetRange.toLocaleString()}
                                </div>
                            </div>
                            <div className="relative h-2 flex items-center mb-6 group/slider">
                                <div className="absolute inset-x-0 h-1.5 bg-gray-50 rounded-full" />
                                <div
                                    className="absolute left-0 h-1.5 bg-blue-600 rounded-full z-10"
                                    style={{ width: `${((budgetRange - 5000) / 95000) * 100}%` }}
                                />
                                <input
                                    type="range" min="5000" max="100000" step="5000" value={budgetRange}
                                    onChange={(e) => setBudgetRange(parseInt(e.target.value))}
                                    className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer z-30"
                                />
                                <div className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-lg z-20 pointer-events-none" style={{ left: `calc(${((budgetRange - 5000) / 95000) * 100}% - 10px)` }} />
                            </div>
                            <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest italic">
                                <span>₹5k</span>
                                <span>MAX: ₹1 LAC</span>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE SECTION (Dynamic Content) */}
                    <div className="xl:col-span-8 space-y-12">
                        {/* 1. Continue Planning (Contextual) */}
                        {trips.some(t => t.status === 'upcoming') && (
                            <div className="p-8 rounded-[3rem] bg-indigo-50 border border-indigo-100 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <MapIcon className="w-40 h-40" />
                                </div>
                                <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                                    <History className="h-3 w-3" /> Continue Planning
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                                            <img src={trips.find(t => t.status === 'upcoming')?.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-[#0f172a]">{trips.find(t => t.status === 'upcoming')?.destination}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">40% Complete</p>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 h-12 bg-white rounded-2xl p-4 flex items-center shadow-inner">
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} className="h-full bg-indigo-600" />
                                        </div>
                                    </div>
                                    <button className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
                                        Continue Planning
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 2. Recommended For You */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2 text-[#0f172a] font-black uppercase tracking-[0.2em] text-[10px]">
                                    <Sparkles className="h-3 w-3 text-blue-600" /> Recommended For You
                                </div>
                                <Link href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2">View All Destinations</Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {ALL_DESTINATIONS.filter(d => {
                                    const matchesMood = selectedMoods.length === 0 || selectedMoods.includes(d.category);
                                    const matchesBudget = d.budget <= budgetRange;
                                    return matchesMood && matchesBudget;
                                }).slice(0, 4).map(dest => (
                                    <motion.div
                                        key={dest.id}
                                        whileHover={{ y: -8 }}
                                        className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => setSelectedPlan(dest)}>
                                            <img src={dest.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                                                <Heart className={`h-3 w-3 transition-colors ${wishlist.includes(dest.id) ? 'text-red-500 fill-current' : 'text-gray-300'}`} onClick={(e) => { e.stopPropagation(); toggleWishlist(dest.id); }} />
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <div className="flex justify-between items-end mb-4">
                                                <div>
                                                    <h4 className="text-xl font-black text-[#0f172a]">{dest.destination}</h4>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{dest.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Est. Cost</p>
                                                    <p className="text-lg font-black text-blue-600">₹{dest.budget.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedPlan(dest)}
                                                className="w-full py-4 bg-gray-50 text-[#0f172a] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all"
                                            >
                                                Quick Book
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Wishlist Section */}
                        {wishlist.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                                    <Heart className="h-3 w-3 fill-current" /> My Wishlist
                                </div>
                                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
                                    {wishlist.map(id => {
                                        const dest = ALL_DESTINATIONS.find(d => d.id === id);
                                        if (!dest) return null;
                                        return (
                                            <div key={id} className="min-w-[200px] group cursor-pointer" onClick={() => setSelectedPlan(dest)}>
                                                <div className="aspect-square rounded-3xl overflow-hidden mb-3 shadow-md">
                                                    <img src={dest.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <p className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">{dest.destination}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="mt-20 pt-20 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                            <Gem className="h-3 w-3" /> Rewards & Benefits
                        </div>
                        <CreditSystemCard onApplyCredit={handleApplyCredit} isApplied={isCreditApplied} />
                    </div>

                    <div className="lg:col-span-4 self-stretch">
                        <DecisionHelper destinations={ALL_DESTINATIONS} onCompare={handleCompare} />
                    </div>
                </div>

                {/* 4. RECENT ACTIVITY & SUGGESTIONS */}
                <div className="mt-20">
                    <div className="flex items-center gap-2 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                        <History className="h-3 w-3" /> Recent Activity & Suggested Trips
                    </div>
                    {trips.filter(t => t.status === 'completed').length > 0 ? (
                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
                            {trips.filter(t => t.status === 'completed').slice(0, 5).map(trip => (
                                <div key={trip.id} className="min-w-[200px] bg-white p-4 rounded-3xl border border-gray-100 shadow-sm group">
                                    <div className="relative h-24 rounded-2xl overflow-hidden mb-3">
                                        <img src={trip.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h5 className="font-bold text-xs text-[#0f172a]">{trip.destination}</h5>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Visited {trip.dates.split(' to ')[0].split('-')[0]}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-[3rem] border border-gray-100 text-center">
                            <p className="text-gray-300 font-bold text-xs uppercase tracking-widest">No recent activity yet. Start exploring Bharat!</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating AI Assistant */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isChatAssistantOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 w-80 mb-4"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-black text-[#0f172a] text-sm">AI Assistant</h4>
                                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Always Online</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6">Need help planning your next Bharat escape? I can suggest destinations based on your mood or budget!</p>
                            <Link href="/chat" className="block w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-black transition-all">
                                Chat Now
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsChatAssistantOpen(!isChatAssistantOpen)}
                    className="w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative"
                >
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                    {isChatAssistantOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
                </button>
            </div>

            {/* Modals */}
            <SmartPlannerForm
                isOpen={isPlannerOpen}
                onClose={() => setIsPlannerOpen(false)}
                onSubmit={handleGeneratePlan}
                isLoading={isGeneratingPlan}
            />
            <PlanDetailsModal
                isOpen={!!selectedPlan}
                onClose={() => setSelectedPlan(null)}
                plan={selectedPlan || {}}
                onClaim={handleClaimPlan}
            />
            <PreferenceSetupModal
                isOpen={isPreferenceModalOpen}
                onClose={() => setIsPreferenceModalOpen(false)}
            />
            <ComparisonModal
                isOpen={isComparisonOpen}
                onClose={() => setIsComparisonOpen(false)}
                dest1={comparisonDests[0]}
                dest2={comparisonDests[1]}
            />
        </div>
    );
}
