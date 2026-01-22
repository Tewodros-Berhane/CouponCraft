import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    {
      icon: '🎨',
      title: 'Drag & Drop Builder',
      description: 'Create stunning coupons with our intuitive visual editor. No design skills required.',
      preview: 'Interactive Design Canvas'
    },
    {
      icon: '📱',
      title: 'Link + QR Sharing',
      description: 'Share via short links and QR codes for print or digital distribution.',
      preview: 'Quick Share Options'
    },
    {
      icon: '📊',
      title: 'Real-Time Analytics',
      description: 'Track performance, redemption rates, and ROI with detailed insights and reports.',
      preview: 'Live Performance Data'
    },
    {
      icon: '📈',
      title: 'Conversion Insights',
      description: 'See which shares convert best with click and redemption tracking.',
      preview: 'Conversion Metrics'
    },
    {
      icon: '🔒',
      title: 'Advanced Security',
      description: 'Prevent fraud with unique codes, usage limits, and expiration controls.',
      preview: 'Bank-Level Security'
    },
    {
      icon: '⚡',
      title: 'Instant Deployment',
      description: 'Launch campaigns in minutes with our automated distribution system.',
      preview: 'One-Click Publishing'
    }
  ];

  return (
    <section id="features" ref={ref} className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to 
            <span className="text-primary"> Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need 
            to create, distribute, and track high-converting coupon campaigns.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-card rounded-2xl p-8 shadow-level-2 hover:shadow-level-3 transition-all duration-300 border border-border"
            >
              {/* Feature Icon */}
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature?.icon}
              </div>

              {/* Feature Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature?.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature?.description}
                </p>
                
                {/* Interactive Preview */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">{feature?.preview}</span>
                    <motion.div
                      animate={{ rotate: [0, 90, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className="w-4 h-4 bg-success rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Demonstration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-12"
        >
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              See It in Action
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch how businesses like yours are using CouponCraft to drive engagement 
              and increase revenue with targeted coupon campaigns.
            </p>
            
            {/* Demo Stats */}
            <div className="grid sm:grid-cols-3 gap-8 mt-12">
              {[
                { metric: '300%', label: 'Average ROI Increase' },
                { metric: '45sec', label: 'Coupon Creation Time' },
                { metric: '94%', label: 'Customer Satisfaction' }
              ]?.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat?.metric}</div>
                  <div className="text-muted-foreground font-medium">{stat?.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
