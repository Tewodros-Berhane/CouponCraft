import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onGetStarted, onViewDemo }) => {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Create 
                <span className="text-primary"> Digital Coupons </span>
                That Drive Results
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Transform your marketing with powerful coupon creation tools. 
                Boost customer engagement, track performance, and increase sales 
                with our intuitive platform.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '🚀', text: '10x Faster Creation' },
                { icon: '📊', text: 'Real-time Analytics' },
                { icon: '🎯', text: 'Targeted Campaigns' },
                { icon: '💰', text: 'Proven ROI Boost' }
              ]?.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3 text-sm"
                >
                  <span className="text-2xl">{benefit?.icon}</span>
                  <span className="text-muted-foreground font-medium">{benefit?.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="xl"
                onClick={onGetStarted}
                iconName="Sparkles"
                iconPosition="left"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Start Creating Coupons
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={onViewDemo}
                iconName="Play"
                iconPosition="left"
              >
                View Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex items-center space-x-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center space-x-2">
                <span className="text-success">✓</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-success">✓</span>
                <span>Free 14-day Trial</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard Mockup */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <h3 className="font-semibold text-lg">Coupon Dashboard</h3>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Active Coupons', value: '24', trend: '+12%' },
                    { label: 'Redemptions', value: '1,847', trend: '+28%' },
                  ]?.map((stat, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{stat?.label}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{stat?.value}</span>
                        <span className="text-xs text-success font-medium">{stat?.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Preview */}
                <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white">
                  <h4 className="font-bold text-lg">50% OFF</h4>
                  <p className="text-sm opacity-90">Summer Sale Special</p>
                  <p className="text-xs opacity-75 mt-2">Valid until Sept 30, 2025</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -left-4 bg-success text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
            >
              +347% ROI
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-warning text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
            >
              2.3M Coupons
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;