'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const LANGUAGES = [
    { code: 'en', labelKey: 'en' },
    { code: 'gu', labelKey: 'gu' },
    { code: 'hi', labelKey: 'hi' },
    { code: 'es', labelKey: 'es' },
    { code: 'fr', labelKey: 'fr' },
];

export default function LanguageSwitcher() {
    const t = useTranslations('LanguageSwitcher');
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Extract current locale from pathname
    const currentLocale = pathname.split('/')[1] || 'en';

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale === currentLocale) {
            setIsOpen(false);
            return;
        }
        const path = pathname.split('/').slice(2).join('/');
        router.push(`/${newLocale}/${path}`);
        setIsOpen(false);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                suppressHydrationWarning
                className={cn(
                    "flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-[0.8rem] font-black transition-all duration-300",
                    "bg-white/80 backdrop-blur-md border shadow-sm",
                    isOpen
                        ? "border-blue-400 shadow-xl shadow-blue-500/10 ring-4 ring-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                )}
            >
                <Globe className={cn("w-4 h-4 transition-colors", isOpen ? "text-blue-500" : "text-gray-400")} />
                <span className="text-[#0f172a] tracking-[0.1em] uppercase">{t(currentLang.labelKey)}</span>
                <ChevronDown className={cn("w-3 h-3 text-gray-300 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-4 w-56 bg-white/95 backdrop-blur-2xl rounded-3xl border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.1)] py-3 z-[60] overflow-hidden"
                    >
                        <div className="px-6 py-2 mb-1 border-b border-gray-50">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('label')}</p>
                        </div>
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-2.5 text-sm font-black transition-all group",
                                    currentLocale === lang.code
                                        ? "text-blue-600 bg-blue-50/50"
                                        : "text-gray-600 hover:text-[#0f172a] hover:bg-gray-50"
                                )}
                            >
                                <span className="tracking-tight">{t(lang.labelKey)}</span>
                                {currentLocale === lang.code && (
                                    <Check className="w-5 h-5 text-blue-500 animate-in zoom-in duration-300" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
