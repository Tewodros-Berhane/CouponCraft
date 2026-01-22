import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../../../components/ui/Button';

const DemoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeDemo, setActiveDemo] = useState('builder');

  const demoTabs = [
    { id: 'builder', label: 'Drag & Drop Builder', icon: '🎨' },
    { id: 'analytics', label: 'Real-time Analytics', icon: '📊' },
    { id: 'distribution', label: 'Link + QR Sharing', icon: '📱' }
  ];

  const demoContent = {
    builder: {
      title: "Create Stunning Coupons in Minutes",
      description: "Our intuitive drag-and-drop interface makes coupon creation effortless. Choose from templates or build from scratch.",
      preview: (
        <div className="bg-white rounded-xl p-6 shadow-2xl border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Coupon Builder</h4>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Template Gallery</div>
              <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4]?.map(i => (
                  <div key={i} className="h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded border-2 border-dashed border-primary/30"></div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Live Preview</div>
              <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white text-center">
                <div className="text-2xl font-bold">50% OFF</div>
                <div className="text-sm opacity-90">Summer Special</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    analytics: {
      title: "Track Performance in Real-time",
      description: "Monitor coupon performance, redemption rates, and ROI with comprehensive analytics dashboard.",
      preview: (
        <div className="bg-white rounded-xl p-6 shadow-2xl border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Analytics Dashboard</h4>
            <div className="text-xs bg-success text-white px-2 py-1 rounded">Live</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">2,847</div>
              <div className="text-xs text-muted-foreground">Total Redemptions</div>
              <div className="text-xs text-success">+23% today</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-accent">$12,450</div>
              <div className="text-xs text-muted-foreground">Revenue Generated</div>
              <div className="text-xs text-success">+18% this week</div>
            </div>
          </div>
          <div className="h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-end justify-around p-2">
            {[40, 60, 35, 80, 55, 75, 90]?.map((height, i) => (
              <div key={i} className="bg-primary rounded-sm" style={{height: `${height}%`, width: '8px'}}></div>
            ))}
          </div>
        </div>
      )
    },
    distribution: {
      title: "Share with Links and QR Codes",
      description: "Distribute your coupons with share links and QR codes for print or digital use.",
      preview: (
        <div className="bg-white rounded-xl p-6 shadow-2xl border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Distribution Center</h4>
            <div className="text-xs bg-primary text-white px-2 py-1 rounded">Ready to Share</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📱', label: 'QR Code', status: 'Generated' },
              { icon: '🔗', label: 'Share Link', status: 'Copied' },
              { icon: '🖨️', label: 'Print Pack', status: 'Ready' },
              { icon: '👁️', label: 'Live Views', status: 'Tracking' }
            ]?.map((channel, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
                <span className="text-2xl">{channel?.icon}</span>
                <div>
                  <div className="text-sm font-medium">{channel?.label}</div>
                  <div className="text-xs text-success">{channel?.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  };

  return (
    <section id="demo" ref={ref} className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            See CouponCraft
            <span className="text-primary"> In Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of our platform with interactive demos. 
            See how easy it is to create, track, and distribute high-converting coupons.
          </p>
        </motion.div>

        {/* Demo Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-card rounded-2xl p-2 shadow-level-2">
            {demoTabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveDemo(tab?.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeDemo === tab?.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span className="text-lg">{tab?.icon}</span>
                <span className="font-medium hidden sm:inline">{tab?.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Demo Content */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              {demoContent?.[activeDemo]?.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {demoContent?.[activeDemo]?.description}
            </p>
            
            {/* Interactive Features */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Key Features:</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: '✨', text: 'One-click templates' },
                  { icon: '🎯', text: 'Smart targeting' },
                  { icon: '📈', text: 'Performance tracking' },
                  { icon: '⚡', text: 'Instant deployment' }
                ]?.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <span className="text-lg">{feature?.icon}</span>
                    <span className="text-muted-foreground">{feature?.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <Button 
              size="lg" 
              iconName="ExternalLink"
              iconPosition="right"
              className="mt-6"
            >
              Try Interactive Demo
            </Button>
          </div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {demoContent?.[activeDemo]?.preview}
            
            {/* Floating Indicators */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full font-medium"
            >
              Live Demo
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Video Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Watch Full Product Demo
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              See a complete walkthrough of CouponCraft in action. 
              Learn how to create, customize, and launch your first campaign.
            </p>
            
            {/* Video Placeholder */}
            <div className="relative bg-card rounded-2xl p-8 shadow-level-3 max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <Button 
                  size="xl" 
                  iconName="Play"
                  iconPosition="left"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  Watch 3-Minute Demo
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
                <span>▶️ 3:24 minutes</span>
                <span>👥 25,847 views</span>
                <span>⭐ 4.9/5 rating</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
