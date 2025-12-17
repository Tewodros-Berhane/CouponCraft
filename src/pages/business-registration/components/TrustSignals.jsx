import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with bank-level security'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'We never share your business information'
    },
    {
      icon: 'CheckCircle',
      title: 'GDPR Compliant',
      description: 'Full compliance with data protection regulations'
    }
  ];

  const platformBenefits = [
    {
      icon: 'Zap',
      title: 'Quick Setup',
      description: 'Create your first coupon in under 5 minutes'
    },
    {
      icon: 'Users',
      title: '10,000+ Businesses',
      description: 'Join thousands of successful businesses'
    },
    {
      icon: 'TrendingUp',
      title: 'Proven Results',
      description: 'Average 35% increase in customer engagement'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      business: 'Bloom Café',
      rating: 5,
      text: "CouponCraft helped us increase foot traffic by 40% in just two months!"
    },
    {
      name: 'Mike Rodriguez',
      business: 'Auto Pro Services',
      rating: 5,
      text: "The easiest way to create professional coupons. Our customers love them!"
    },
    {
      name: 'Lisa Chen',
      business: 'Zen Spa',
      rating: 5,
      text: "Simple to use and great results. Highly recommend for small businesses."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Secure & Trusted</h3>
        </div>
        <div className="space-y-3">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{feature?.title}</h4>
                <p className="text-xs text-muted-foreground">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Platform Benefits */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Star" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Why Choose Us</h3>
        </div>
        <div className="space-y-3">
          {platformBenefits?.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name={benefit?.icon} size={16} className="text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{benefit?.title}</h4>
                <p className="text-xs text-muted-foreground">{benefit?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Customer Testimonials */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="MessageCircle" size={20} className="text-success" />
          <h3 className="text-lg font-semibold text-foreground">What Customers Say</h3>
        </div>
        <div className="space-y-4">
          {testimonials?.map((testimonial, index) => (
            <div key={index} className="border-l-2 border-success/20 pl-4">
              <div className="flex items-center space-x-1 mb-1">
                {[...Array(testimonial?.rating)]?.map((_, i) => (
                  <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-2">"{testimonial?.text}"</p>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">{testimonial?.name}</span>
                <span className="mx-1" aria-hidden="true">·</span>
                <span>{testimonial?.business}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Support Information */}
      <div className="bg-muted/30 rounded-xl border border-border p-6">
        <div className="text-center">
          <Icon name="Headphones" size={24} className="text-primary mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-foreground mb-1">Need Help?</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Our support team is here to help you succeed
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Mail" size={12} />
              <span>Email & Chat</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="BookOpen" size={12} />
              <span>Help Center</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
