import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

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
            <Link
              to="/"
              aria-label="Go to home"
              className="flex items-center space-x-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Scissors" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">CouponCraft</span>
            </Link>
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
