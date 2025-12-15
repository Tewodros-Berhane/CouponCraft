import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TemplateLibrary from './components/TemplateLibrary';
import DiscountConfiguration from './components/DiscountConfiguration';
import ValiditySettings from './components/ValiditySettings';
import CustomizationTools from './components/CustomizationTools';
import LivePreview from './components/LivePreview';
import FormNavigation from './components/FormNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import api from '../../apiClient';

const CreateCoupon = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [couponId, setCouponId] = useState(null);

  // Form Data States
  const [templateData, setTemplateData] = useState(null);
  const [discountData, setDiscountData] = useState({
    type: '',
    percentage: '',
    amount: '',
    bogoType: '',
    minimumType: 'none',
    minimumAmount: '',
    minimumQuantity: '',
    specificProducts: false,
    stackable: false,
    firstTimeOnly: false,
    customCode: ''
  });
  const [validityData, setValidityData] = useState({
    type: 'date_range',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    timeZone: 'America/New_York',
    durationDays: '',
    usageLimit: 'unlimited',
    totalLimit: '',
    perCustomerLimit: '',
    autoDeactivate: true,
    expirationReminders: false,
    partialRedemption: false
  });
  const [customizationData, setCustomizationData] = useState({
    businessName: '',
    title: '',
    description: '',
    terms: '',
    logo: null,
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#059669',
      text: '#0f172a'
    },
    font: 'inter',
    showLogo: true,
    includeQR: true,
    decorativeBorder: false,
    gradientBackground: false,
    customCode: ''
  });

  const totalSteps = 5;

  // Load saved draft on component mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const { data } = await api.get('/coupons');
        const draft = data?.data?.find((c) => c?.status === 'draft');
        if (draft) {
          setCouponId(draft?.id);
          setTemplateData(draft?.template || null);
          setDiscountData(prev => ({ ...prev, ...draft?.discount }));
          setValidityData(prev => ({ ...prev, ...draft?.validity }));
          setCustomizationData(prev => ({ ...prev, ...draft?.customization }));
          setCurrentStep(draft?.currentStep || 1);
          return;
        }
      } catch (error) {
        console.warn('Unable to load draft from server, falling back to local storage', error);
      }

      const savedDraft = localStorage.getItem('coupon-draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setTemplateData(draft?.templateData || null);
          setDiscountData(prev => ({ ...prev, ...draft?.discountData }));
          setValidityData(prev => ({ ...prev, ...draft?.validityData }));
          setCustomizationData(prev => ({ ...prev, ...draft?.customizationData }));
          setCurrentStep(draft?.currentStep || 1);
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    };

    loadDraft();
  }, []);

  // Auto-save draft periodically
  useEffect(() => {
    const autoSave = setInterval(() => {
      saveDraft(false);
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [templateData, discountData, validityData, customizationData, currentStep]);

  const buildPayload = (status = 'draft') => ({
    template: templateData,
    discount: discountData,
    validity: validityData,
    customization: customizationData,
    status,
    currentStep,
  });

  const saveDraft = async (showNotification = true, status = 'draft') => {
    if (showNotification) setIsSaving(true);
    const payload = buildPayload(status);
    try {
      let response;
      if (couponId) {
        response = await api.patch(`/coupons/${couponId}`, payload);
      } else {
        response = await api.post('/coupons', payload);
      }
      const saved = response?.data?.data || payload;
      if (saved?.id && !couponId) setCouponId(saved.id);

      localStorage.setItem(
        'coupon-draft',
        JSON.stringify({
          templateData,
          discountData,
          validityData,
          customizationData,
          currentStep,
          lastSaved: new Date()?.toISOString(),
        })
      );

      if (showNotification) {
        console.log('Draft saved successfully');
      }
      return saved?.id || couponId;
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      if (showNotification) {
        setTimeout(() => setIsSaving(false), 1000);
      }
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Template Selection
        return templateData !== null;
      
      case 2: // Discount Configuration
        if (!discountData?.type) return false;
        
        switch (discountData?.type) {
          case 'percentage':
            return discountData?.percentage && 
                   parseFloat(discountData?.percentage) > 0 && 
                   parseFloat(discountData?.percentage) <= 100;
          case 'fixed':
            return discountData?.amount && parseFloat(discountData?.amount) > 0;
          case 'bogo':
            return discountData?.bogoType;
          case 'free_shipping':
            return true;
          default:
            return false;
        }
      
      case 3: // Validity Settings
        if (validityData?.type === 'date_range') {
          return validityData?.startDate && validityData?.endDate;
        } else if (validityData?.type === 'duration') {
          return validityData?.durationDays && parseInt(validityData?.durationDays) > 0;
        }
        return true;
      
      case 4: // Customization
        return customizationData?.businessName && customizationData?.title;
      
      case 5: // Preview
        return true;
      
      default:
        return false;
    }
  };

  const handleStepChange = (step) => {
    if (step > currentStep && !validateCurrentStep()) {
      return;
    }
    setCurrentStep(step);
  };

  const handlePreview = async () => {
    if (validateCurrentStep()) {
      const id = await saveDraft(false);
      navigate('/coupon-preview', { 
        state: { 
          couponId: id || couponId,
          couponData: {
            template: templateData,
            discount: discountData,
            validity: validityData,
            customization: customizationData
          }
        }
      });
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    saveDraft(false);
    navigate('/business-dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateLibrary
            selectedTemplate={templateData}
            onTemplateSelect={setTemplateData}
          />
        );
      
      case 2:
        return (
          <DiscountConfiguration
            discountData={discountData}
            onDiscountChange={setDiscountData}
          />
        );
      
      case 3:
        return (
          <ValiditySettings
            validityData={validityData}
            onValidityChange={setValidityData}
          />
        );
      
      case 4:
        return (
          <CustomizationTools
            customizationData={customizationData}
            onCustomizationChange={setCustomizationData}
          />
        );
      
      case 5:
        return (
          <LivePreview
            templateData={templateData}
            discountData={discountData}
            validityData={validityData}
            customizationData={customizationData}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isInWorkflow={true} workflowStep={currentStep} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Coupon</h1>
              <p className="text-muted-foreground mt-2">
                Build professional digital coupons in minutes with our step-by-step wizard
              </p>
            </div>
            
            <Button
              variant="ghost"
              onClick={handleExit}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Exit
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <FormNavigation
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onStepChange={handleStepChange}
                  onSaveDraft={() => saveDraft(true)}
                  onPreview={handlePreview}
                  isValid={validateCurrentStep()}
                  isSaving={isSaving}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6 shadow-level-1">
                {renderCurrentStep()}
              </div>
            </div>

            {/* Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-card border border-border rounded-xl p-4 shadow-level-1">
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon name="Eye" size={18} className="text-primary" />
                    <h3 className="font-medium text-foreground">Quick Preview</h3>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="aspect-[3/2] bg-white rounded-lg border border-border overflow-hidden">
                      {/* Mini Preview */}
                      <div 
                        className="h-1/2 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: customizationData?.colors?.primary || '#1e40af' }}
                      >
                        {customizationData?.businessName || 'Business Name'}
                      </div>
                      <div className="h-1/2 p-2 flex flex-col justify-center items-center">
                        <div className="text-xs font-semibold text-center mb-1">
                          {customizationData?.title || 'Coupon Title'}
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {discountData?.type === 'percentage' && discountData?.percentage ? 
                            `${discountData?.percentage}% OFF` :
                            discountData?.type === 'fixed' && discountData?.amount ?
                            `$${discountData?.amount} OFF` :
                            'Special Offer'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>• Template: {templateData?.name || 'Not selected'}</p>
                    <p>• Discount: {discountData?.type || 'Not configured'}</p>
                    <p>• Validity: {validityData?.type || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowExitModal(false)} />
          <div className="relative bg-card border border-border rounded-xl p-6 shadow-level-4 max-w-md mx-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Exit Coupon Creation?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your progress will be saved as a draft. You can continue editing later from your dashboard.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExitModal(false)}
                  >
                    Continue Editing
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={confirmExit}
                  >
                    Save & Exit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCoupon;
