'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { User as UserIcon, Mail, Phone, MapPin, Save, Loader2, CheckCircle, FileText } from 'lucide-react';
import { useAuth, User } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
    const { user, loading, updateUser } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [avatarFile, setAvatarFile] = useState<string | null>(null);

    // Sync form data with auth user
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: (user as any).bio || '', // Casting to any for bio if not strictly in interface yet
            });
            if (user.avatar) setAvatarFile(user.avatar);
        }
    }, [user, loading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarFile(reader.result as string);
                // Proactively update user context if we want immediate feedback, 
                // but better to wait for 'Save Changes' for full persistence
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.put('https://dj-tours-ravels-production.up.railway.app/api/auth/profile', {
                name: formData.name,
                phone: formData.phone,
                location: formData.location,
                bio: formData.bio,
                avatar: avatarFile || ""
            }, config);

            if (res.status === 200) {
                // Update auth state (which also updates localStorage)
                updateUser(res.data.user);
                setShowSuccess(true);
                // Hide success message after 3 seconds
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="flex flex-col gap-2 mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit">Member Profile</h1>
                    <p className="text-gray-500 font-inter">Personalize your Incredible India travel experience</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-gray-200/50">
                    <div className="p-8 sm:p-10">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-8 mb-12 pb-10 border-b border-gray-50">
                            <div className="h-28 w-28 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center text-white shadow-2xl overflow-hidden relative group shrink-0">
                                {avatarFile ? (
                                    <img src={avatarFile} alt={formData.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-black uppercase tracking-tighter">
                                        {formData.name ? formData.name.charAt(0) : user.name?.charAt(0) || 'U'}
                                    </span>
                                )}
                                <div
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
                                >
                                    <span className="text-[10px] uppercase font-black text-white tracking-[0.2em]">Edit</span>
                                </div>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">{formData.name || 'Traveler'}</h2>
                                <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-1">Verified Member</p>
                                <p className="text-gray-500 font-medium mt-3 flex items-center gap-2 justify-center sm:justify-start">
                                    <Mail className="h-4 w-4" /> {formData.email}
                                </p>
                            </div>
                        </div>

                        <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            {/* Personal Details Grid */}
                            <div className="space-y-8">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Personal Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-[0.15em] ml-1">Full Name</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
                                                className="pl-12 block w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-[#0f172a] shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-[0.15em] ml-1">Contact Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 00000 00000"
                                                className="pl-12 block w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-[#0f172a] shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-[0.15em] ml-1">Home City / Location</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="Mumbai, India"
                                                className="pl-12 block w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-[#0f172a] shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-[0.15em] ml-1">Email Address</label>
                                        <div className="relative group opacity-60">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                disabled
                                                value={formData.email}
                                                className="pl-12 block w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 cursor-not-allowed font-bold text-[#0f172a]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">About You</h3>
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-[0.15em] ml-1">Traveler Bio</label>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Tell us about your favorite travel styles..."
                                            className="pl-12 block w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-4 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-semibold text-[#0f172a] shadow-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="pt-10 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="h-6">
                                    <AnimatePresence>
                                        {showSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-sm border border-green-100"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Profile Updated Successfully
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0f172a] text-white px-10 py-5 rounded-2xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-600/30 active:scale-95 transition-all font-black text-xs uppercase tracking-[0.2em] outline-none disabled:bg-gray-400 shadow-xl shadow-gray-200"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Encrypting...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            Save Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
