import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const Navigation = ({ isScrolled, onLogin, onGetStarted }) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-foreground">CouponCraft</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a 
              href="#demo" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Demo
            </a>
            <a 
              href="#pricing" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onLogin}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              onClick={onGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;