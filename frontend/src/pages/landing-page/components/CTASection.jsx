import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../../../components/ui/Button';

const CTASection = ({ onGetStarted }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const finalBenefits = [
    { icon: '⚡', text: 'Start creating in under 60 seconds' },
    { icon: '🎯', text: 'Launch your first campaign today' },
    { icon: '📈', text: 'See results within 24 hours' },
    { icon: '💼', text: 'Used by 50,000+ businesses worldwide' }
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Main CTA Content */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Ready to Transform Your 
              <span className="text-primary"> Marketing?</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Join thousands of successful businesses using CouponCraft to create, 
              distribute, and track high-converting coupon campaigns. Start your free 
              trial today and see results within 24 hours.
            </p>

            {/* Key Final Benefits */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {finalBenefits?.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-lg p-4"
                >
                  <span className="text-2xl">{benefit?.icon}</span>
                  <span className="text-sm font-medium text-muted-foreground">{benefit?.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Primary CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Button
                size="xl"
                onClick={onGetStarted}
                iconName="Sparkles"
                iconPosition="left"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 px-12 py-4 text-lg"
              >
                Start Free Trial
              </Button>
              <Button
                size="xl"
                variant="outline"
                iconName="MessageCircle"
                iconPosition="left"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg px-12 py-4 text-lg"
              >
                Schedule Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center space-x-2">
                <span className="text-success">✓</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-success">✓</span>
                <span>14-Day Free Trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-success">✓</span>
                <span>Cancel Anytime</span>
              </div>
            </motion.div>
          </div>

          {/* Success Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-level-3"
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Join the Success Story
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { metric: '50,000+', label: 'Active Businesses', icon: '🏢' },
                { metric: '2.3M+', label: 'Coupons Created', icon: '🎫' },
                { metric: '347%', label: 'Average ROI Increase', icon: '📈' },
                { metric: '98%', label: 'Customer Satisfaction', icon: '⭐' }
              ]?.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">{stat?.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat?.metric}</div>
                  <div className="text-muted-foreground font-medium">{stat?.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final Urgency Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-12 p-6 bg-gradient-to-r from-warning/10 to-accent/10 rounded-2xl border border-warning/20"
          >
            <div className="flex items-center justify-center space-x-3 text-warning mb-3">
              <span className="text-2xl">⏰</span>
              <span className="font-bold text-lg">Limited Time Offer</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Get 2 months free when you sign up this week! Offer expires soon.
            </p>
            <Button
              onClick={onGetStarted}
              variant="warning"
              iconName="ArrowRight"
              iconPosition="right"
              className="shadow-lg"
            >
              Claim Free Trial Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;