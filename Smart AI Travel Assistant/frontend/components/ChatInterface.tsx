'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Send, Mic, StopCircle, Bot, User, Loader2, Sparkles, MessageSquare, Plus, Trash2, Menu, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    suggestions?: string[];
}

interface Session {
    sessionId: string;
    title: string;
    timestamp: string;
}

const RANDOM_SUGGESTIONS = [
    "Plan a 3-day trip to Jaipur",
    "Best heritage hotels in Udaipur?",
    "Spiritual spots in Rishikesh",
    "Safety tips for solo travel in Kerala",
    "How to prepare for a Leh Ladakh trip?",
    "Luxury trains in India"
];

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessingAudio, setIsProcessingAudio] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const [guestMessageCount, setGuestMessageCount] = useState(0);
    const { user } = useAuth();

    // Voice Recording Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize guest count from localStorage
    useEffect(() => {
        if (!user) {
            const savedCount = localStorage.getItem('chatbot_guest_count');
            if (savedCount) setGuestMessageCount(parseInt(savedCount));
        }
    }, [user]);

    const isLimitReached = !user && guestMessageCount >= 4;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessingAudio, isLoading]);

    // Hydration Fix: Set random suggestions on client mount only
    useEffect(() => {
        setSuggestions([...RANDOM_SUGGESTIONS].sort(() => 0.5 - Math.random()).slice(0, 3));
    }, []);

    // Fetch Sessions on Mount
    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get(`https://dj-tours-ravels-production.up.railway.app/api/chat/sessions`, config);
            setSessions(res.data);
            if (!currentSessionId && res.data.length > 0) {
                loadSession(res.data[0].sessionId);
            }
        } catch (err) {
            console.error("Failed to load sessions", err);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const loadSession = async (sessionId: string) => {
        setIsLoading(true);
        setCurrentSessionId(sessionId);
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get(`https://dj-tours-ravels-production.up.railway.app/api/chat/history?sessionId=${sessionId}`, config);
            // Ensure loaded messages have IDs and content is a string
            const messagesWithIds = res.data.map((msg: any) => ({
                ...msg,
                id: msg.id || crypto.randomUUID(),
                content: typeof msg.content === 'object'
                    ? (msg.content.description || JSON.stringify(msg.content))
                    : msg.content
            }));
            setMessages(messagesWithIds);
            if (window.innerWidth < 768) setShowSidebar(false);
        } catch (err) {
            console.error("Failed to load session history", err);
        } finally {
            setIsLoading(false);
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages([]);
        setSuggestions([...RANDOM_SUGGESTIONS].sort(() => 0.5 - Math.random()).slice(0, 3)); // New randoms for new chat
        if (window.innerWidth < 768) setShowSidebar(false);
    };

    const handleSend = async (text: string = input) => {
        if (!text.trim() || isLimitReached) return;

        const tempId = crypto.randomUUID();
        const userMsg: Message = { id: tempId, role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
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
                message: userMsg.content,
                userId: user?.id || 'guest_user',
                sessionId: currentSessionId
            }, config);

            const data = response.data;

            if (!currentSessionId && data.sessionId) {
                setCurrentSessionId(data.sessionId);
                fetchSessions();
            }

            // Extract content if it's an object
            const aiContent = typeof data.response === 'object'
                ? (data.response.description || JSON.stringify(data.response))
                : data.response;

            const aiMsg: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: aiContent,
                suggestions: data.suggestions
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "**Connection Error**: I'm having trouble connecting to the server."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Voice Logic ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await processAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop()); // Stop mic
            };

            mediaRecorder.start();
            setIsListening(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop();
            setIsListening(false);
        }
    };

    const toggleVoice = () => {
        if (isListening) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const processAudio = async (audioBlob: Blob) => {
        setIsProcessingAudio(true);
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice_input.webm');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            };

            const res = await axios.post('https://dj-tours-ravels-production.up.railway.app/api/chat/transcribe', formData, config);

            const transcribedText = res.data.text;
            if (transcribedText) {
                handleSend(transcribedText);
            }
        } catch (err) {
            console.error("Transcription failed", err);
            // alert("Failed to transcribe audio."); 
        } finally {
            setIsProcessingAudio(false);
        }
    };

    const speakText = (text: string) => {
        const cleanText = text.replace(/[*_#\[\]]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="flex h-[750px] w-full max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">

            {/* Sidebar */}
            <div className={cn(
                "w-full md:w-80 bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 absolute md:relative z-20 h-full",
                showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden"
            )}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <h2 className="font-semibold text-gray-700">Chat History</h2>
                    <button onClick={() => setShowSidebar(false)} className="md:hidden p-2 hover:bg-gray-200 rounded-full">
                        <Menu className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-4">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
                    {sessions.map((session, i) => (
                        <button
                            key={session.sessionId || i}
                            onClick={() => loadSession(session.sessionId)}
                            className={cn(
                                "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group border border-transparent",
                                currentSessionId === session.sessionId
                                    ? "bg-white border-gray-200 shadow-sm text-blue-700"
                                    : "hover:bg-gray-100 text-gray-600"
                            )}
                        >
                            <MessageSquare className={cn("h-4 w-4 flex-shrink-0", currentSessionId === session.sessionId ? "text-blue-600" : "text-gray-400")} />
                            <div className="overflow-hidden">
                                <p className="truncate font-medium text-sm">{session.title || "Untitled Chat"}</p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                    {session.timestamp ? new Date(session.timestamp).toLocaleDateString() : 'Just now'}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col w-full relative">

                {/* Header Toggle for Mobile/Sidebar */}
                {!showSidebar && (
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="absolute top-4 left-4 z-10 p-2 bg-white border border-gray-200 shadow-md rounded-full text-gray-600 hover:text-blue-600 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                )}

                <div className="pt-6 pb-2 text-center bg-white z-10">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {currentSessionId ? "AI Planning Agent" : "New Conversation"}
                    </h1>
                    {isListening && (
                        <div className="flex items-center justify-center gap-2 mt-2 text-red-500 animate-pulse">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Recording...</span>
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-6 bg-white scroll-smooth custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-in fade-in duration-700">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <Sparkles className="h-10 w-10 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">How can I help you today?</h3>
                            <p className="text-gray-500 mb-8 max-w-md">I can help you plan trips, find hotels, check flight prices, or give you local travel tips.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                                {suggestions.map((sugg, i) => (
                                    <button
                                        key={`start-sugg-${i}`} // Fixed Key
                                        disabled={isLimitReached}
                                        onClick={() => handleSend(sugg)}
                                        className={cn(
                                            "p-4 border rounded-xl text-left text-sm transition-all",
                                            isLimitReached
                                                ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-50 hover:bg-blue-50 border-gray-100 hover:border-blue-200 text-gray-600 hover:text-blue-700"
                                        )}
                                    >
                                        {sugg}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className="space-y-4">
                                    <div className={cn(
                                        "flex items-start gap-4",
                                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}>
                                        <div className={cn(
                                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                            msg.role === 'user' ? "bg-amber-100" : "bg-blue-600"
                                        )}>
                                            {msg.role === 'user' ? <User className="h-4 w-4 text-amber-600" /> : <Bot className="h-5 w-5 text-white" />}
                                        </div>
                                        <div className={cn(
                                            "max-w-[85%] p-4 text-[15px] leading-relaxed shadow-sm group relative",
                                            msg.role === 'user'
                                                ? "bg-gray-100 text-gray-900 rounded-2xl rounded-tr-sm"
                                                : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm ring-1 ring-black/5"
                                        )}>
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-sm max-w-none prose-blue">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                            )}

                                            {msg.role === 'assistant' && (
                                                <button
                                                    onClick={() => speakText(msg.content)}
                                                    className="absolute -bottom-8 left-0 p-1.5 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Read Aloud"
                                                >
                                                    <Volume2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {msg.role === 'assistant' && msg.suggestions && (
                                        <div className="pl-12 flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-1 duration-500">
                                            {msg.suggestions.map((sugg, i) => {
                                                if (typeof sugg !== 'string') return null;
                                                return (
                                                    <button
                                                        key={`sugg-${msg.id}-${i}`}
                                                        disabled={isLimitReached}
                                                        onClick={() => handleSend(sugg)}
                                                        className={cn(
                                                            "px-3 py-1.5 text-xs font-semibold rounded-full transition-colors border",
                                                            isLimitReached
                                                                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                                                : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                                                        )}
                                                    >
                                                        {sugg}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLimitReached && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-8 pb-4"
                                >
                                    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[2rem] p-8 text-white shadow-2xl text-center relative overflow-hidden">
                                        {/* Decorative backgrounds */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                                <Sparkles className="h-8 w-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-black mb-3 tracking-tight">Unlock Full Planning Power</h3>
                                            <p className="text-blue-50/80 text-sm mb-8 leading-relaxed font-medium">
                                                You've explored the basics. Sign up now to create unlimited travel plans, save your favorite routes, and get personalized AI itineraries!
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Link
                                                    href="/signup"
                                                    className="py-3 px-8 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm uppercase tracking-wider"
                                                >
                                                    Sign Up
                                                </Link>
                                                <Link
                                                    href="/login"
                                                    className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-xl hover:bg-white/20 transition-all text-sm uppercase tracking-wider"
                                                >
                                                    Log In
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {(isProcessingAudio || isLoading) && (
                        <div className="flex items-start gap-4 pl-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                <span className="text-sm text-gray-500">
                                    {isProcessingAudio ? "Listening & Transcribing..." : "Thinking..."}
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                    <div className="relative flex items-center gap-3 max-w-4xl mx-auto">
                        <button
                            onClick={toggleVoice}
                            disabled={isLoading || isProcessingAudio}
                            className={cn(
                                "p-3 rounded-full border transition-all relative overflow-hidden",
                                isListening
                                    ? "bg-red-50 border-red-200 text-red-500 animate-pulse ring-4 ring-red-50"
                                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                            )}>
                            {isListening ? <StopCircle className="h-5 w-5 relative z-10" /> : <Mic className="h-5 w-5 relative z-10" />}
                        </button>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isLimitReached ? "Sign up to continue planning..." : isListening ? "Recording... (Click mic to stop)" : "Message Indian Travel Agent..."}
                                className={cn(
                                    "w-full bg-gray-50 border border-gray-200 rounded-full py-3.5 pl-6 pr-12 transition-all outline-none",
                                    isLimitReached
                                        ? "cursor-not-allowed opacity-60 bg-gray-100"
                                        : "focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                )}
                                disabled={isLoading || isListening || isProcessingAudio || isLimitReached}
                                autoFocus
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading || isLimitReached}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
