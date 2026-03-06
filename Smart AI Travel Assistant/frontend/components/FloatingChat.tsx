'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingChat() {
    const { isChatOpen: isOpen, setIsChatOpen: setIsOpen } = useChat();
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hi there! 👋 I'm your personal travel concierge. How can I help you plan your next trip?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [guestMessageCount, setGuestMessageCount] = useState(0);
    const { user } = useAuth();
    const router = useRouter();

    // Initialize guest count from localStorage
    useEffect(() => {
        if (!user) {
            const savedCount = localStorage.getItem('chatbot_guest_count');
            if (savedCount) setGuestMessageCount(parseInt(savedCount));
        }
    }, [user]);

    const isLimitReached = !user && guestMessageCount >= 4;

    // Reset chat history when opened (as requested)
    useEffect(() => {
        if (isOpen) {
            setMessages([
                { role: 'assistant', content: "Hi there! 👋 I'm your personal travel concierge. How can I help you plan your next trip?" }
            ]);
        }
    }, [isOpen]);

    const handleSend = async (forcedInput?: string) => {
        const messageToSend = forcedInput || input;
        if (!messageToSend.trim() || isLimitReached || isLoading) return;

        const userMsg = messageToSend;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput("");
        setIsLoading(true);

        // Increment guest count if not logged in
        if (!user) {
            const newCount = guestMessageCount + 1;
            setGuestMessageCount(newCount);
            localStorage.setItem('chatbot_guest_count', newCount.toString());
        }

        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const response = await axios.post('https://dj-tours-ravels-production.up.railway.app/api/chat', {
                message: userMsg,
                userId: user?.id || 'guest_user',
                sessionId: 'floating_session'
            }, config);

            const data = response.data;

            // Support both 'response' and 'content' keys from backend
            let aiContent = data.response || data.content;

            if (typeof aiContent === 'object') {
                aiContent = aiContent.description || JSON.stringify(aiContent);
            }

            if (!aiContent) {
                aiContent = "I'm sorry, I received an empty response. Could you try rephrasing?";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            <div className={cn(
                "bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col",
                isOpen ? "w-[350px] h-[500px] opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-90"
            )}>
                {/* Header */}
                <div className="bg-primary p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-tight font-outfit">AI Planning Agent</h3>
                            <p className="text-[10px] text-white/80 flex items-center gap-1 font-inter uppercase tracking-widest font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Instant AI Support
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 flex flex-col custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[85%] p-3 text-sm rounded-xl mb-1 font-inter font-medium leading-relaxed",
                                msg.role === 'user'
                                    ? "bg-blue-600 text-white rounded-br-none shadow-md"
                                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Quick Replies */}
                    {!isLimitReached && !isLoading && messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {[
                                "Claim my ₹1,000 credit",
                                "Show Hidden Gems",
                                "Suggest a trip for March",
                                "How does AI planning work?",
                                "Tell me about rewards"
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q)}
                                    className="px-3 py-1.5 bg-white border border-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {isLimitReached && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-[#0f172a] to-blue-900 rounded-2xl text-white shadow-lg text-center relative overflow-hidden shrink-0 border border-white/10">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                                    <Sparkles className="h-6 w-6 text-blue-400" />
                                </div>
                                <h4 className="text-sm font-black mb-1 uppercase tracking-widest">Experience More</h4>
                                <p className="text-[10px] text-blue-100/70 mb-5 leading-tight font-medium">
                                    You've used your guest questions. Sign in to unlock unlimited AI planning & exclusive rewards.
                                </p>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => router.push('/signup')}
                                        className="py-3 bg-blue-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/30 active:scale-95 transition-all text-center"
                                    >
                                        Create Free Account
                                    </button>
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all text-center"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-bl-none shadow-sm flex items-center gap-2">
                                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                                <span className="text-xs text-gray-500 font-medium italic">Planning your journey...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex gap-2">
                        <input
                            className={cn(
                                "flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-gray-100",
                                isLimitReached && "opacity-50 cursor-not-allowed bg-gray-200"
                            )}
                            placeholder={isLimitReached ? "Log in to continue..." : "Ask your travel agent..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLimitReached || isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLimitReached || isLoading || !input.trim()}
                            className={cn(
                                "w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-90",
                                (isLimitReached || isLoading || !input.trim())
                                    ? "bg-gray-100 text-gray-300"
                                    : "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                            )}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
                    isOpen ? "bg-gray-200 text-gray-600 rotate-90" : "bg-accent text-white hover:bg-orange-600"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </button>
        </div>
    );
}
