'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import SmartRecommendations from '@/components/SmartRecommendations';
import StatsSection from '@/components/StatsSection';
import FAQSection from '@/components/FAQSection';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <HeroSection />
      {user && <SmartRecommendations />}
      <StatsSection />
      <div id="faq">
        <FAQSection />
      </div>
      <Footer />
    </main>
  );
}
