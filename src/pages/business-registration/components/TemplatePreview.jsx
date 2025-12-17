import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TemplatePreview = ({ selectedBusinessType }) => {
  const [currentTemplate, setCurrentTemplate] = useState(0);

  const templatesByType = {
    restaurant: [
      {
        id: 1,
        name: 'Food Delight',
        image: '/assets/images/templates/food.svg',
        discount: '20% OFF',
        description: 'Perfect for restaurants and cafes'
      },
      {
        id: 2,
        name: 'Pizza Special',
        image: '/assets/images/templates/food.svg',
        discount: 'Buy 1 Get 1',
        description: 'Great for pizza and fast food'
      }
    ],
    retail: [
      {
        id: 3,
        name: 'Fashion Sale',
        image: '/assets/images/templates/retail.svg',
        discount: '30% OFF',
        description: 'Ideal for clothing and accessories'
      },
      {
        id: 4,
        name: 'Store Discount',
        image: '/assets/images/templates/retail.svg',
        discount: '$10 OFF',
        description: 'Perfect for retail stores'
      }
    ],
    beauty: [
      {
        id: 5,
        name: 'Spa Treatment',
        image: '/assets/images/templates/spa.svg',
        discount: '25% OFF',
        description: 'Great for beauty and wellness'
      },
      {
        id: 6,
        name: 'Hair Salon',
        image: '/assets/images/templates/spa.svg',
        discount: 'Free Service',
        description: 'Perfect for salons and spas'
      }
    ],
    automotive: [
      {
        id: 7,
        name: 'Car Service',
        image: '/assets/images/templates/auto.svg',
        discount: '15% OFF',
        description: 'Ideal for auto services'
      }
    ],
    fitness: [
      {
        id: 8,
        name: 'Gym Membership',
        image: '/assets/images/templates/fitness.svg',
        discount: '1 Month Free',
        description: 'Perfect for fitness centers'
      }
    ],
    professional: [
      {
        id: 9,
        name: 'Consultation',
        image: '/assets/images/templates/services.svg',
        discount: '50% OFF',
        description: 'Great for professional services'
      }
    ],
    entertainment: [
      {
        id: 10,
        name: 'Event Ticket',
        image: '/assets/images/templates/minimal.svg',
        discount: '2 for 1',
        description: 'Perfect for events and entertainment'
      }
    ],
    other: [
      {
        id: 11,
        name: 'General Offer',
        image: '/assets/images/templates/classic.svg',
        discount: '20% OFF',
        description: 'Versatile template for any business'
      }
    ]
  };

  const getCurrentTemplates = () => {
    return templatesByType?.[selectedBusinessType] || templatesByType?.other;
  };

  const templates = getCurrentTemplates();

  useEffect(() => {
    setCurrentTemplate(0);
  }, [selectedBusinessType]);

  const nextTemplate = () => {
    setCurrentTemplate((prev) => (prev + 1) % templates?.length);
  };

  const prevTemplate = () => {
    setCurrentTemplate((prev) => (prev - 1 + templates?.length) % templates?.length);
  };

  if (!selectedBusinessType) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Eye" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Template Preview</h3>
        <p className="text-muted-foreground">
          Select your business type to see relevant coupon templates
        </p>
      </div>
    );
  }

  const template = templates?.[currentTemplate];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Template Preview</h3>
            <p className="text-sm text-muted-foreground">
              {templates?.length} template{templates?.length > 1 ? 's' : ''} available
            </p>
          </div>
          {templates?.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={prevTemplate}
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors duration-150"
                aria-label="Previous template"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              <span className="text-sm text-muted-foreground px-2">
                {currentTemplate + 1} / {templates?.length}
              </span>
              <button
                onClick={nextTemplate}
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors duration-150"
                aria-label="Next template"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Template Display */}
      <div className="p-6">
        <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden mb-4">
          <div className="aspect-[4/3] relative">
            <Image
              src={template?.image}
              alt={template?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-2">{template?.discount}</div>
                <div className="text-sm opacity-90">{template?.name}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h4 className="font-semibold text-foreground mb-1">{template?.name}</h4>
          <p className="text-sm text-muted-foreground mb-4">{template?.description}</p>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Smartphone" size={14} />
              <span>Mobile Ready</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Palette" size={14} />
              <span>Customizable</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="QrCode" size={14} />
              <span>QR Enabled</span>
            </div>
          </div>
        </div>
      </div>
      {/* Benefits */}
      <div className="px-6 pb-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-foreground mb-2">What you'll get:</h5>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={12} className="text-success" />
              <span>Professional coupon designs</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={12} className="text-success" />
              <span>Your business branding</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={12} className="text-success" />
              <span>Multiple sharing options</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={12} className="text-success" />
              <span>Performance tracking</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
