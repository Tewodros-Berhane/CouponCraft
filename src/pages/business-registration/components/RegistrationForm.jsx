import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant & Food Service' },
    { value: 'retail', label: 'Retail Store' },
    { value: 'beauty', label: 'Beauty & Wellness' },
    { value: 'automotive', label: 'Automotive Services' },
    { value: 'fitness', label: 'Fitness & Health' },
    { value: 'professional', label: 'Professional Services' },
    { value: 'entertainment', label: 'Entertainment & Events' },
    { value: 'other', label: 'Other' }
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.businessName?.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData?.ownerName?.trim()) {
        newErrors.ownerName = 'Owner name is required';
      }
      if (!formData?.businessType) {
        newErrors.businessType = 'Please select your business type';
      }
    }

    if (step === 2) {
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData?.phone?.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\(\d{3}\) \d{3}-\d{4}$/?.test(formData?.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (step === 3) {
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData?.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData?.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e?.target?.value?.replace(/\D/g, '');
    if (value?.length >= 6) {
      value = `(${value?.slice(0, 3)}) ${value?.slice(3, 6)}-${value?.slice(6, 10)}`;
    } else if (value?.length >= 3) {
      value = `(${value?.slice(0, 3)}) ${value?.slice(3)}`;
    }
    handleInputChange('phone', value);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateStep(3)) {
      onSubmit?.(formData);
    }
  };


  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Business Information';
      case 2: return 'Contact Details';
      case 3: return 'Account Security';
      default: return 'Registration';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Tell us about your business to get started';
      case 2: return 'How can customers reach you?';
      case 3: return 'Secure your account with a strong password';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3]?.map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  step === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step < currentStep
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-0.5 mx-2 transition-colors duration-200 ${
                    step < currentStep ? 'bg-success' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-1">{getStepTitle()}</h2>
          <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Input
              label="Business Name"
              type="text"
              placeholder="Enter your business name"
              value={formData?.businessName}
              onChange={(e) => handleInputChange('businessName', e?.target?.value)}
              error={errors?.businessName}
              required
            />

            <Input
              label="Owner/Manager Name"
              type="text"
              placeholder="Enter your full name"
              value={formData?.ownerName}
              onChange={(e) => handleInputChange('ownerName', e?.target?.value)}
              error={errors?.ownerName}
              required
            />

            <Select
              label="Business Type"
              placeholder="Select your business category"
              options={businessTypes}
              value={formData?.businessType}
              onChange={(value) => handleInputChange('businessType', value)}
              error={errors?.businessType}
              required
            />
          </div>
        )}

        {/* Step 2: Contact Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="business@example.com"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              description="This will be your login email"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData?.phone}
              onChange={handlePhoneChange}
              error={errors?.phone}
              description="Customers will see this on your coupons"
              required
            />
          </div>
        )}

        {/* Step 3: Account Security */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              error={errors?.password}
              description="Must be at least 8 characters long"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData?.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
              required
            />

            <div className="space-y-3">
              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                checked={formData?.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
                error={errors?.agreeToTerms}
                required
              />

              <Checkbox
                label="Send me marketing tips and product updates"
                checked={formData?.subscribeNewsletter}
                onChange={(e) => handleInputChange('subscribeNewsletter', e?.target?.checked)}
                description="You can unsubscribe at any time"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              loading={isLoading}
              iconName="UserPlus"
              iconPosition="left"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
