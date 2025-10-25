import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SocialProofSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const testimonials = [
    {
      quote: "CouponCraft revolutionized our marketing campaigns. We saw a 347% increase in customer engagement within the first month!",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Solutions",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      quote: "The drag-and-drop builder is incredibly intuitive. Our team can create professional coupons in minutes, not hours.",
      author: "Michael Chen",
      role: "Small Business Owner",
      company: "Local Coffee Co.",
      avatar: "👨‍💻",
      rating: 5
    },
    {
      quote: "Real-time analytics helped us optimize our campaigns and achieve 2.3x higher redemption rates. Outstanding platform!",
      author: "Emily Rodriguez",
      role: "E-commerce Manager",
      company: "Fashion Forward",
      avatar: "👩‍🎨",
      rating: 5
    }
  ];

  const businessLogos = [
    "TechStart", "Coffee Co.", "Fashion Forward", "Digital Agency", "Restaurant Chain", "Retail Plus"
  ];

  const stats = [
    { number: "50K+", label: "Active Businesses" },
    { number: "2.3M", label: "Coupons Created" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "347%", label: "Average ROI Boost" }
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by 
            <span className="text-primary"> 50,000+ Businesses</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Join thousands of successful businesses already using CouponCraft to 
            boost sales and engage customers with targeted coupon campaigns.
          </p>
          
          {/* Key Statistics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats?.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary mb-2">{stat?.number}</div>
                <div className="text-muted-foreground font-medium">{stat?.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Customer Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {testimonials?.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-card rounded-2xl p-8 shadow-level-2 hover:shadow-level-3 transition-all duration-300 border border-border"
            >
              {/* Rating Stars */}
              <div className="flex space-x-1 mb-6">
                {[...Array(testimonial?.rating)]?.map((_, i) => (
                  <span key={i} className="text-warning text-xl">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial?.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{testimonial?.avatar}</div>
                <div>
                  <div className="font-bold text-foreground">{testimonial?.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial?.role}</div>
                  <div className="text-sm text-primary font-medium">{testimonial?.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Business Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-8">Trusted by leading businesses worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {businessLogos?.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-muted/50 rounded-lg p-4 flex items-center justify-center h-16 hover:bg-muted transition-colors"
              >
                <span className="font-bold text-muted-foreground text-sm">{logo}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Story Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 bg-gradient-to-r from-success/10 to-accent/10 rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Success Story Spotlight
          </h3>
          <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
            "Within 3 months of using CouponCraft, we increased our customer retention by 45% 
            and saw our average order value grow by 62%. The platform pays for itself!"
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-4xl">🏆</div>
            <div className="text-left">
              <div className="font-bold text-foreground">David Kim</div>
              <div className="text-sm text-muted-foreground">CEO, Growth Retail Group</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;