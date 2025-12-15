
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import SocialProofSection from './components/SocialProofSection';
import DemoSection from './components/DemoSection';
import BenefitsSection from './components/BenefitsSection';
import CTASection from './components/CTASection';
import Navigation from './components/Navigation';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window?.scrollY > 50);
    };

    window?.addEventListener('scroll', handleScroll);
    return () => window?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/business-registration');
  };

  const handleViewDemo = () => {
    const demoSection = document?.getElementById('demo-section');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = () => {
    navigate('/business-login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        isScrolled={isScrolled} 
        onLogin={handleLogin}
        onGetStarted={handleGetStarted}
      />

      {/* Hero Section */}
      <HeroSection 
        onGetStarted={handleGetStarted}
        onViewDemo={handleViewDemo}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* Demo Section */}
      <DemoSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Final CTA Section */}
      <CTASection onGetStarted={handleGetStarted} />
    </div>
  );
};

export default LandingPage;