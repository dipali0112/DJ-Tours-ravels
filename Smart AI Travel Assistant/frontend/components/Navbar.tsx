'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, ChevronDown, Globe, LogOut, User as UserIcon, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { trips } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const t = useTranslations('Navbar');
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

    const NAV_LINKS = [
        { name: t('home'), href: "/" },
        { name: "About Us", href: "/about" },
        { name: t('destinations'), href: "/destinations" },
        { name: t('contact'), href: "/contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Handle click outside to close profile dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle Escape key to close search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSearchOpen]);

    const handleSearchTrigger = () => {
        if (isSearchOpen && searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();

            // Try to find exact match in mock data
            const matchedTrip = trips.find(trip =>
                trip.destination.toLowerCase() === query ||
                trip.id.toLowerCase() === query
            );

            if (matchedTrip) {
                router.push(`/destinations/${matchedTrip.id}`);
            } else {
                // Fallback to destinations page with search param
                router.push(`/destinations?search=${encodeURIComponent(searchQuery)}`);
            }

            setIsSearchOpen(false);
            setSearchQuery("");
        } else {
            setIsSearchOpen(!isSearchOpen);
        }
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "py-3 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-md"
                    : "py-5 bg-white/80 backdrop-blur-lg border-b border-gray-100"
            )}
        >
            <div className="max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center justify-between">

                {/* Left Group: Logo + Navigation */}
                <div className="flex items-center gap-16 lg:gap-24">
                    {/* Logo - Modern Typography */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2 flex-shrink-0"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-[#0f172a]">
                            DJ Tour & Travels<span className="text-cyan-500">.</span>
                        </span>
                    </Link>

                    {/* Desktop Menu - Modern Typography */}
                    <div className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "relative text-[1.1rem] font-bold tracking-tight transition-all duration-300 hover:text-blue-600 group py-2 whitespace-nowrap",
                                    pathname === link.href
                                        ? "text-blue-600 scale-105"
                                        : "text-[#0f172a]/80 hover:scale-105"
                                )}
                            >
                                {link.name}
                                {/* Animated Underline Expand Effect */}
                                <span className={cn(
                                    "absolute bottom-0 left-0 h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300",
                                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                                )} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Group: Action Buttons */}
                <div className="flex items-center gap-6 lg:gap-8">
                    {/* Language Switcher */}
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>

                    <div className="relative flex items-center">
                        <motion.div
                            initial={false}
                            animate={{
                                width: isSearchOpen ? 320 : 52,
                                backgroundColor: isScrolled
                                    ? (isSearchOpen ? "rgba(241,245,249,1)" : "rgba(241,245,249,0.5)")
                                    : (isSearchOpen ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)")
                            }}
                            className={cn(
                                "h-12 rounded-full backdrop-blur-md border flex items-center overflow-hidden transition-all duration-300",
                                isSearchOpen ? "border-blue-200 shadow-md ring-2 ring-blue-50" : "border-gray-200 shadow-sm"
                            )}
                        >
                            <button
                                onClick={handleSearchTrigger}
                                suppressHydrationWarning
                                className="p-3 text-[#0f172a] hover:text-blue-600 transition-colors flex-shrink-0"
                            >
                                <Search className="w-5.5 h-5.5" />
                            </button>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchTrigger();
                                    }
                                }}
                                placeholder="Search destinations..."
                                className={cn(
                                    "bg-transparent border-none outline-none text-[#0f172a] text-base font-medium placeholder:text-gray-400 transition-all duration-300 w-full pr-6",
                                    isSearchOpen ? "opacity-100" : "opacity-0 invisible"
                                )}
                            />
                        </motion.div>
                    </div>

                    {/* Register Button or Greeting */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-4 group outline-none"
                            >
                                <div className="text-right hidden xl:block">
                                    <p className="text-[11px] font-black text-[#64748b]/60 uppercase tracking-[0.2em] leading-none mb-1.5">Connected</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base font-black text-[#0f172a] group-hover:text-cyan-500 transition-colors uppercase tracking-tighter">
                                            {user.name ? user.name.split(' ')[0] : 'User'}
                                        </p>
                                        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isProfileOpen && "rotate-180")} />
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 border-2 border-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg font-black text-white uppercase">{user.name ? user.name.charAt(0) : 'U'}</span>
                                    )}
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-5 w-72 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden py-4 z-50"
                                    >
                                        <div className="px-8 py-6 border-b border-gray-50 mb-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Member Profile</p>
                                            <p className="text-sm font-black text-[#0f172a] truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-4 px-8 py-5 text-base font-black text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all group/item"
                                        >
                                            <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover/item:text-blue-600" />
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-4 px-8 py-5 text-base font-black text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all group/item"
                                        >
                                            <UserIcon className="w-5 h-5 text-gray-400 group-hover/item:text-blue-600" />
                                            My Profile
                                        </Link>

                                        <div className="px-6 mt-3 pt-3 border-t border-gray-50">
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full flex items-center gap-4 px-6 py-5 text-base font-black text-red-500 hover:bg-red-50 rounded-3xl transition-all group/logout"
                                            >
                                                <LogOut className="w-5 h-5 group-hover/logout:translate-x-2 transition-transform duration-300" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/signup">
                            <button className="px-10 lg:px-14 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[14px] font-black tracking-[0.25em] uppercase rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all outline-none border-none">
                                Register
                            </button>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-[#0f172a] hover:text-cyan-500 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu (Glassmorphic Slide-down) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-gray-100 overflow-hidden shadow-xl"
                    >
                        <div className="px-6 py-10 flex flex-col gap-6">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                    }}
                                    className={cn(
                                        "text-2xl font-bold tracking-tight py-2 transition-all",
                                        pathname === link.href ? "text-cyan-500 pl-4 border-l-4 border-cyan-500" : "text-[#0f172a]/60 hover:text-[#0f172a]"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
