'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Sparkles, Heart, Globe, Linkedin, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
    {
        name: "Aravind Kumar",
        role: "Founder & CEO",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=387&auto=format&fit=crop",
        bio: "Travel enthusiast with 10+ years in the Indian tourism industry. Dedicated to digitizing the Bharat travel experience.",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "Priya Sharma",
        role: "Head of AI Design",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=387&auto=format&fit=crop",
        bio: "AI researcher focusing on personalized travel algorithms. Bringing mathematical precision to your dream vacations.",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "Rahul Mehra",
        role: "Lead Explorer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=387&auto=format&fit=crop",
        bio: "Has trekked every major trail in the Himalayas. Curating the most authentic 'offbeat' experiences for Bloosm.",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "Ananya Reddy",
        role: "Partnerships Manager",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=387&auto=format&fit=crop",
        bio: "Building bridges between local boutique hotels and our global community. Expert in sustainable tourism.",
        linkedin: "#",
        twitter: "#"
    }
];

export default function TeamPage() {
    return (
        <main className="min-h-screen bg-white text-[#0f172a]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-[#f8fbff]">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-[0.3em] text-[10px] mb-6"
                    >
                        <Users className="h-4 w-4" />
                        Our People
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8"
                    >
                        Meet the minds behind <br />
                        <span className="bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">Bloosm.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-[#64748b] font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        We're a group of travel enthusiasts and AI engineers dedicated to making Indian tourism more accessible and magical for everyone.
                    </motion.p>
                </div>
            </section>

            {/* Team Members Grid */}
            <section className="py-32">
                <div className="max-w-[1800px] mx-auto px-6 lg:px-20">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-bold tracking-tight mb-4">Our Core Team</h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                        {teamMembers.map((member, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-[#f8fbff] border border-blue-50">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Social Links on Hover */}
                                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <Link href={member.linkedin} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#0ea5e9] transition-colors">
                                            <Linkedin className="h-5 w-5" />
                                        </Link>
                                        <Link href={member.twitter} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#0ea5e9] transition-colors">
                                            <Twitter className="h-5 w-5" />
                                        </Link>
                                        <Link href={`mailto:hello@bloosm.com`} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#0ea5e9] transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <h3 className="text-2xl font-bold group-hover:text-[#0ea5e9] transition-colors">{member.name}</h3>
                                    <p className="text-[#0ea5e9] font-bold text-xs uppercase tracking-widest mt-2">{member.role}</p>
                                    <p className="text-[#64748b] text-sm mt-4 leading-relaxed px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto overflow-hidden">
                                        {member.bio}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-32 bg-[#f8fbff]">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: Sparkles, title: "Visionaries", desc: "Dreaming up new ways to explore the hidden gems of Bharat." },
                            { icon: Globe, title: "Explorers", desc: "Mapping out the most authentic local experiences for you." },
                            { icon: Heart, title: "Guides", desc: "Ensuring every journey you take is filled with lasting memories." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 bg-white rounded-[3rem] border border-blue-50 text-center group hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#f8fbff] shadow-sm flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                                    <item.icon className="h-8 w-8 text-[#0ea5e9]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-[#64748b] leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>


        </main>
    );
}
