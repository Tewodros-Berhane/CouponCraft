import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const pricingPlans = [
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      description: "Perfect for small businesses just getting started",
      features: [
        "Up to 1,000 coupons/month",
        "Basic templates library",
        "Email & social sharing",
        "Basic analytics",
        "Email support"
      ],
      popular: false,
      color: "border-border"
    },
    {
      name: "Professional", 
      price: "$49",
      period: "/month",
      description: "Ideal for growing businesses with advanced needs",
      features: [
        "Up to 10,000 coupons/month",
        "Premium templates + custom design",
        "Multi-channel distribution",
        "Advanced analytics & insights",
        "Priority support",
        "API access",
        "Team collaboration"
      ],
      popular: true,
      color: "border-primary ring-2 ring-primary/20"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom requirements",
      features: [
        "Unlimited coupons",
        "White-label solution",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Advanced security features",
        "Custom analytics"
      ],
      popular: false,
      color: "border-border"
    }
  ];

  const benefits = [
    {
      icon: "💰",
      title: "Increase Revenue",
      description: "Boost sales with targeted coupon campaigns that drive customer action and increase average order value.",
      stat: "+347% ROI"
    },
    {
      icon: "⚡",
      title: "Save Time",
      description: "Create professional coupons in minutes, not hours. Our templates and tools streamline your workflow.",
      stat: "90% Time Saved"
    },
    {
      icon: "📈",
      title: "Better Insights",
      description: "Make data-driven decisions with real-time analytics and performance tracking for all your campaigns.",
      stat: "Real-time Data"
    },
    {
      icon: "🎯",
      title: "Higher Engagement",
      description: "Reach customers across multiple channels and increase engagement with personalized coupon experiences.",
      stat: "+235% Engagement"
    }
  ];

  const comparisonData = [
    {
      feature: "Coupon Creation Time",
      traditional: "2-4 hours",
      couponcraft: "2-5 minutes",
      improvement: "95% faster"
    },
    {
      feature: "Distribution Channels",
      traditional: "1-2 channels",
      couponcraft: "8+ channels",
      improvement: "4x more reach"
    },
    {
      feature: "Performance Tracking",
      traditional: "Basic reporting",
      couponcraft: "Real-time analytics",
      improvement: "Live insights"
    },
    {
      feature: "Customer Engagement",
      traditional: "Static coupons",
      couponcraft: "Interactive experience",
      improvement: "3x engagement"
    }
  ];

  return (
    <section id="pricing" ref={ref} className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Benefits Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose
            <span className="text-primary"> CouponCraft?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16">
            Join thousands of businesses who have transformed their marketing 
            with our powerful coupon creation and distribution platform.
          </p>

          {/* Key Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits?.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit?.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {benefit?.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {benefit?.description}
                </p>
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {benefit?.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              CouponCraft vs Traditional Methods
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how our platform compares to traditional coupon creation and distribution methods.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-level-2 border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Traditional Methods</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">CouponCraft</th>
                  <th className="text-center py-4 px-4 font-semibold text-success">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData?.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-4 px-4 font-medium text-foreground">{row?.feature}</td>
                    <td className="py-4 px-4 text-center text-muted-foreground">{row?.traditional}</td>
                    <td className="py-4 px-4 text-center text-primary font-medium">{row?.couponcraft}</td>
                    <td className="py-4 px-4 text-center text-success font-semibold">{row?.improvement}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Start with a free trial, then choose the plan that best fits your business needs. 
            All plans include our core features with no hidden fees.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans?.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`bg-card rounded-2xl p-8 shadow-level-2 hover:shadow-level-3 transition-all duration-300 border-2 ${plan?.color} relative`}
              >
                {plan?.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-foreground mb-2">{plan?.name}</h4>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">{plan?.price}</span>
                    <span className="text-muted-foreground">{plan?.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan?.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan?.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <span className="text-success">✓</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan?.popular
                      ? 'bg-primary text-white hover:bg-primary/90' :'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {plan?.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12 text-center text-muted-foreground"
          >
            <p className="mb-4">
              🔒 All plans include a 14-day free trial <span aria-hidden="true">·</span> No credit card required
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <span>✓ 24/7 Customer Support</span>
              <span>✓ 99.9% Uptime SLA</span>
              <span>✓ Cancel Anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
