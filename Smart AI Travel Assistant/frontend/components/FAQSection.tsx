import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function FAQSection() {
    const t = useTranslations('FAQ');
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How does your platform help me explore India?",
            answer: "Our team is extensively trained on Indian geography, culture, and travel logistics. We suggest hidden gems, spiritual circuits, and local experiences across all Indian states."
        },
        {
            question: "Can you plan for niche circuits like the Golden Triangle?",
            answer: "Yes! We specialize in creating heritage circuits. Whether it's the Golden Triangle or backwater trails in Kerala, we generate seamless plans."
        },
        {
            question: "Do you provide state-specific travel advice?",
            answer: "Absolutely. From permit requirements in Ladakh to the best time for the Rann Utsav in Gujarat, our specialists provide localized guidance."
        },
        {
            question: "Is the pricing for Indian packages transparent?",
            answer: "Yes, we prioritize transparency. All costs for Indian stays, transport, and local guides are broken down in detail in INR."
        }
    ];

    return (
        <section className="relative pt-24 pb-32 bg-[#f8fbff] text-[#0f172a] overflow-hidden border-t border-blue-50">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 45, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -45, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-sky-100/50 rounded-full blur-[140px]"
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-[0.3em] text-[10px] mb-6 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-blue-50 shadow-sm"
                    >
                        <HelpCircle className="h-3.5 w-3.5" />
                        {t('support')}
                    </motion.div>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                        {t('questions')}<br />
                        <span className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">{t('qMain')}</span>
                    </h2>
                    <p className="text-[#64748b] text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        {t('sub')}
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "group rounded-[2rem] border transition-all duration-500 overflow-hidden",
                                activeIndex === idx
                                    ? "bg-white border-blue-100 shadow-[0_20px_50px_-12px_rgba(14,165,233,0.12)]"
                                    : "bg-white/50 border-white/50 hover:bg-white hover:border-blue-50 shadow-sm"
                            )}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                className="w-full text-left p-6 lg:p-8 flex items-center justify-between gap-4"
                            >
                                <span className={cn(
                                    "text-lg lg:text-xl font-bold tracking-tight transition-colors duration-300",
                                    activeIndex === idx ? "text-[#0ea5e9]" : "text-[#0f172a]"
                                )}>
                                    {faq.question}
                                </span>
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                    activeIndex === idx
                                        ? "bg-[#0ea5e9] text-white rotate-180"
                                        : "bg-blue-50 text-[#0ea5e9] group-hover:scale-110"
                                )}>
                                    <ChevronDown className="h-5 w-5" />
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="px-6 lg:px-8 pb-8 lg:pb-10">
                                            <div className="h-[2px] w-12 bg-blue-100 mb-6 rounded-full" />
                                            <p className="text-[#64748b] text-base lg:text-lg font-medium leading-[1.8] max-w-3xl">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
