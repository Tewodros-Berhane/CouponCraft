import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import api from '../../../apiClient';

const CustomerRedemptionFlow = ({ couponData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [redeemMessage, setRedeemMessage] = useState(null);

  const redemptionSteps = [
    {
      step: 1,
      title: 'Customer Discovers Coupon',
      description: 'Customer finds your coupon through social media, email, or direct sharing',
      icon: 'Search'
    },
    {
      step: 2,
      title: 'QR Code Scan',
      description: 'Customer scans the QR code with their smartphone camera',
      icon: 'QrCode'
    },
    {
      step: 3,
      title: 'Coupon Validation',
      description: 'System validates the coupon and checks expiry date and usage limits',
      icon: 'Shield'
    },
    {
      step: 4,
      title: 'Discount Applied',
      description: 'Discount is applied to the customer\'s order at checkout',
      icon: 'CheckCircle'
    }
  ];

  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  const handleScanSimulation = async () => {
    setRedeemMessage(null);
    setValidationResult(null);
    setIsScanning(true);
    try {
      const { data } = await api.post('/redemption/validate', { couponId: couponData?.id });
      setValidationResult(data?.data);
      setCurrentStep(3);
      if (data?.data?.valid) {
        const confirm = await api.post('/redemption/confirm', { couponId: couponData?.id, context: { source: 'preview' } });
        if (confirm?.data?.data) {
          setRedeemMessage('Redemption confirmed');
          setCurrentStep(4);
        }
      }
    } catch (err) {
      setRedeemMessage(err?.response?.data?.message || 'Validation failed');
    } finally {
      setIsScanning(false);
    }
  };

  const CustomerView = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-lg border border-border p-6 text-center">
            <div className="mb-4">
              <Icon name="Smartphone" size={48} className="text-muted-foreground mx-auto" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Customer's Phone</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Customer sees your coupon shared on social media or received via email
            </p>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-2">Instagram Story</div>
              <div 
                className="bg-white rounded-lg p-3 shadow-level-1"
                style={{ backgroundColor: couponData?.primaryColor || '#1e40af', color: 'white' }}
              >
                <div className="text-sm font-bold">{couponData?.businessName || 'Your Business'}</div>
                <div className="text-lg font-bold">
                  {couponData?.discountType === 'percentage' 
                    ? `${couponData?.discountValue || '20'}% OFF`
                    : `$${couponData?.discountValue || '10'} OFF`
                  }
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-lg border border-border p-6 text-center">
            <div className="mb-4">
              <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center ${
                isScanning ? 'bg-primary animate-pulse' : 'bg-muted'
              }`}>
                <Icon 
                  name="QrCode" 
                  size={32} 
                  className={isScanning ? 'text-white' : 'text-muted-foreground'} 
                />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              {isScanning ? 'Scanning...' : 'Ready to Scan'}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {isScanning 
                ? 'Processing QR code and validating coupon...' :'Customer points their camera at the QR code'
              }
            </p>
            {!isScanning && (
              <Button
                variant="default"
                onClick={handleScanSimulation}
                iconName="Camera"
                iconPosition="left"
              >
                Simulate Scan
              </Button>
            )}
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-lg border border-border p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-success rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Coupon Validated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              System confirms the coupon is valid and ready to use
            </p>
            <div className="bg-success/10 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-success font-medium">✓ Valid</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Expires:</span>
                <span className="text-foreground">
                  {couponData?.expiryDate ? new Date(couponData.expiryDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <span className="text-success font-medium">
                  {couponData?.discountType === 'percentage' 
                    ? `${couponData?.discountValue || '20'}% OFF`
                    : `$${couponData?.discountValue || '10'} OFF`
                  }
                </span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white rounded-lg border border-border p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-success rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={32} className="text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Discount Applied!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Customer successfully redeemed the coupon at checkout
            </p>
            <div className="bg-success/10 rounded-lg p-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>$45.00</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Discount ({couponData?.discountType === 'percentage' 
                    ? `${couponData?.discountValue || '20'}%`
                    : `$${couponData?.discountValue || '10'}`
                  }):</span>
                  <span>-${couponData?.discountType === 'percentage' 
                    ? `$${((45 * (couponData?.discountValue || 20)) / 100)?.toFixed(2)}`
                    : `$${couponData?.discountValue || '10'}.00`
                  }</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${couponData?.discountType === 'percentage' 
                    ? (45 - ((45 * (couponData?.discountValue || 20)) / 100))?.toFixed(2)
                    : (45 - (couponData?.discountValue || 10))?.toFixed(2)
                  }</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Flow Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">Customer Redemption Flow</h3>
        <p className="text-sm text-muted-foreground">
          See how customers will interact with your coupon from discovery to redemption
        </p>
      </div>
      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2 bg-muted/30 rounded-lg p-2">
          {redemptionSteps?.map((step, index) => (
            <div key={step?.step} className="flex items-center">
              <button
                onClick={() => handleStepClick(step?.step)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentStep === step?.step
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > step?.step
                    ? 'bg-success text-success-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon 
                  name={currentStep > step?.step ? 'Check' : step?.icon} 
                  size={16} 
                />
                <span className="hidden sm:inline">{step?.title}</span>
                <span className="sm:hidden">{step?.step}</span>
              </button>
              {index < redemptionSteps?.length - 1 && (
                <div
                  className={`w-6 h-0.5 mx-1 transition-colors duration-200 ${
                    currentStep > step?.step ? 'bg-success' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Current Step Display */}
      <div className="max-w-md mx-auto">
        <CustomerView />
      </div>
      {/* Step Description */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-semibold text-foreground mb-2">
            {redemptionSteps?.[currentStep - 1]?.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {redemptionSteps?.[currentStep - 1]?.description}
          </p>
        </div>
      </div>
      {/* Navigation Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          iconName="ChevronLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          disabled={currentStep === 4}
          iconName="ChevronRight"
          iconPosition="right"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CustomerRedemptionFlow;
