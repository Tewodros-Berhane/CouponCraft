import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Login',
      description: 'Multi-factor authentication available'
    },
    {
      icon: 'CheckCircle',
      title: 'GDPR Compliant',
      description: 'Full compliance with data protection regulations'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      business: 'Chen\'s Bakery',
      avatar: '/assets/images/avatars/avatar-1.svg',
      rating: 5,
      text: 'CouponCraft helped us increase customer retention by 40%. The interface is so intuitive that I created my first coupon in minutes!'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      business: 'Urban Fitness Studio',
      avatar: '/assets/images/avatars/avatar-2.svg',
      rating: 5,
      text: 'The analytics dashboard gives me insights I never had before. I can see exactly which promotions work best for my gym.'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      business: 'Bloom Flower Shop',
      avatar: '/assets/images/avatars/avatar-3.svg',
      rating: 5,
      text: 'Creating seasonal promotions is now effortless. My customers love the professional-looking digital coupons!'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Businesses' },
    { value: '2.5M+', label: 'Coupons Created' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '24/7', label: 'Support Available' }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? 'text-warning fill-current' : 'text-muted'}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="bg-card rounded-xl shadow-level-1 p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="text-primary mr-2" />
          Your Security Matters
        </h3>
        <div className="space-y-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
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
      {/* Trust Statistics */}
      <div className="bg-card rounded-xl shadow-level-1 p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Trusted by Businesses Worldwide
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-primary">{stat?.value}</div>
              <div className="text-xs text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Customer Testimonials */}
      <div className="bg-card rounded-xl shadow-level-1 p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="MessageSquare" size={20} className="text-primary mr-2" />
          What Our Customers Say
        </h3>
        <div className="space-y-4">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-start space-x-3">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {testimonial?.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonial?.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{testimonial?.business}</p>
                  <p className="text-sm text-foreground leading-relaxed">{testimonial?.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Support Information */}
      <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
        <div className="flex items-center space-x-3 mb-3">
          <Icon name="Headphones" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-accent">Need Help?</h3>
        </div>
        <p className="text-sm text-accent/80 mb-4">
          Our support team is available 24/7 to help you get started with your coupon campaigns.
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Mail" size={16} className="text-accent" />
            <span className="text-accent">support@couponcraft.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={16} className="text-accent" />
            <span className="text-accent">1-800-COUPON</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
