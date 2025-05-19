
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import MissionSection from '@/components/landing/MissionSection';
import CtaBanner from '@/components/landing/CtaBanner';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <MissionSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
