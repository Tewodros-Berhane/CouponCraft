import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LivePreview = ({ 
  templateData, 
  discountData, 
  validityData, 
  customizationData 
}) => {
  const [previewMode, setPreviewMode] = useState('desktop');

  const generateCouponCode = () => {
    if (customizationData?.customCode) {
      return customizationData?.customCode;
    }
    return 'SAVE' + Math.random()?.toString(36)?.substr(2, 6)?.toUpperCase();
  };

  const formatDiscount = () => {
    if (!discountData?.type) return 'Special Offer';
    
    switch (discountData?.type) {
      case 'percentage':
        return `${discountData?.percentage || 'X'}% OFF`;
      case 'fixed':
        return `$${discountData?.amount || 'X'} OFF`;
      case 'bogo':
        const bogoLabels = {
          'buy_1_get_1_free': 'BUY 1 GET 1 FREE',
          'buy_2_get_1_free': 'BUY 2 GET 1 FREE',
          'buy_1_get_1_50off': 'BUY 1 GET 1 50% OFF',
          'buy_2_get_1_50off': 'BUY 2 GET 1 50% OFF'
        };
        return bogoLabels?.[discountData?.bogoType] || 'BOGO OFFER';
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return 'Special Offer';
    }
  };

  const formatValidity = () => {
    if (!validityData?.type) return 'Limited Time Offer';
    
    switch (validityData?.type) {
      case 'date_range':
        if (validityData?.endDate) {
          return `Valid until ${new Date(validityData.endDate)?.toLocaleDateString()}`;
        }
        return 'Limited Time Offer';
      case 'duration':
        return `Valid for ${validityData?.durationDays || 'X'} days`;
      case 'no_expiry':
        return 'No Expiration';
      default:
        return 'Limited Time Offer';
    }
  };

  const getPreviewStyles = () => {
    const colors = customizationData?.colors || {};
    return {
      primaryColor: colors?.primary || '#1e40af',
      secondaryColor: colors?.secondary || '#64748b',
      accentColor: colors?.accent || '#059669',
      textColor: colors?.text || '#0f172a',
      gradientBg: customizationData?.gradientBackground 
        ? `linear-gradient(135deg, ${colors?.primary || '#1e40af'}, ${colors?.secondary || '#64748b'})`
        : colors?.primary || '#1e40af'
    };
  };

  const styles = getPreviewStyles();

  const CouponPreview = ({ isMobile = false }) => (
    <div 
      className={`relative bg-white rounded-xl shadow-level-3 overflow-hidden ${
        isMobile ? 'w-full max-w-sm mx-auto' : 'w-full'
      } ${customizationData?.decorativeBorder ? 'border-4 border-dashed' : 'border border-border'}`}
      style={{ 
        borderColor: customizationData?.decorativeBorder ? styles?.primaryColor : undefined 
      }}
    >
      {/* Header Section */}
      <div 
        className="relative px-6 py-8 text-white"
        style={{ 
          background: customizationData?.gradientBackground ? styles?.gradientBg : styles?.primaryColor 
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          {/* Business Logo */}
          {customizationData?.logo && customizationData?.showLogo !== false && (
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={customizationData?.logo?.url}
                  alt="Business logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Business Name */}
          <div className="text-center">
            <h2 className={`text-xl font-bold mb-2 ${
              customizationData?.font === 'serif' ? 'font-serif' :
              customizationData?.font === 'mono' ? 'font-mono' : 'font-sans'
            }`}>
              {customizationData?.businessName || 'Your Business Name'}
            </h2>
            
            {/* Discount Display */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              <span className="text-2xl font-bold">
                {formatDiscount()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-6">
        {/* Title */}
        <h3 
          className={`text-lg font-semibold mb-3 text-center ${
            customizationData?.font === 'serif' ? 'font-serif' :
            customizationData?.font === 'mono' ? 'font-mono' : 'font-sans'
          }`}
          style={{ color: styles?.textColor }}
        >
          {customizationData?.title || 'Special Offer'}
        </h3>

        {/* Description */}
        {customizationData?.description && (
          <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
            {customizationData?.description}
          </p>
        )}

        {/* Coupon Code */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Coupon Code
              </span>
              <div className="font-mono font-bold text-lg" style={{ color: styles?.primaryColor }}>
                {generateCouponCode()}
              </div>
            </div>
            {customizationData?.includeQR !== false && (
              <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                <Icon name="QrCode" size={24} className="text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Validity */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>{formatValidity()}</span>
          </div>
        </div>

        {/* Usage Info */}
        {(validityData?.usageLimit !== 'unlimited' && validityData?.usageLimit) && (
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Users" size={16} />
              <span>
                {validityData?.usageLimit === 'per_customer' && `${validityData?.perCustomerLimit || 1} use per customer`}
                {validityData?.usageLimit === 'total_limit' && `Limited to ${validityData?.totalLimit || 'X'} uses`}
                {validityData?.usageLimit === 'both' && `${validityData?.perCustomerLimit || 1} per customer, ${validityData?.totalLimit || 'X'} total`}
              </span>
            </div>
          </div>
        )}

        {/* Terms */}
        {customizationData?.terms && (
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground text-center">
              {customizationData?.terms}
            </p>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: styles?.accentColor }}></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live Preview</h3>
          <p className="text-sm text-muted-foreground mt-1">
            See how your coupon will look to customers
          </p>
        </div>
        
        {/* Preview Mode Toggle */}
        <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              previewMode === 'desktop' ?'bg-white text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Monitor" size={16} />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              previewMode === 'mobile' ?'bg-white text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Smartphone" size={16} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="bg-muted/30 rounded-xl p-6">
        <div className={`transition-all duration-300 ${
          previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-md mx-auto'
        }`}>
          <CouponPreview isMobile={previewMode === 'mobile'} />
        </div>
      </div>

      {/* Preview Actions */}
      <div className="flex items-center justify-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          Download Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Share"
          iconPosition="left"
        >
          Share Preview
        </Button>
      </div>

      {/* AI Suggestions */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Sparkles" size={16} className="text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">AI Optimization Suggestions</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Consider using a warmer color scheme to increase engagement</li>
              <li>Adding urgency words like "Limited Time" can boost conversions</li>
              <li>Your discount value is competitive for your industry</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
