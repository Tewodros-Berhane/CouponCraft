import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TemplateLibrary from './components/TemplateLibrary';
import DiscountConfiguration from './components/DiscountConfiguration';
import ValiditySettings from './components/ValiditySettings';
import CustomizationTools from './components/CustomizationTools';
import LivePreview from './components/LivePreview';
import FormNavigation from './components/FormNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Dialog, DialogClose, DialogContent } from '../../components/ui/Dialog';
import api from '../../apiClient';
import { useToast } from '../../components/ui/ToastProvider';
import { getApiErrorMessage } from '../../utils/apiError';

const CreateCoupon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isExplicitEdit = Boolean(location?.state?.editMode);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [couponId, setCouponId] = useState(null);
  const [couponStatus, setCouponStatus] = useState('draft');
  const [businessProfile, setBusinessProfile] = useState(null);
  const toast = useToast();
  const lastAutosaveErrorAtRef = useRef(0);
  const didInitializeRef = useRef(false);
  const didPrefillRef = useRef(false);

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
    if (didInitializeRef.current) return;
    didInitializeRef.current = true;

    const loadDraft = async () => {
      try {
        const { data } = await api.get('/coupons');
        const draft = data?.data?.find((c) => c?.status === 'draft');
        if (draft) {
          setCouponId(draft?.id);
          setCouponStatus(draft?.status || 'draft');
          setTemplateData(draft?.template || null);
          setDiscountData(prev => ({ ...prev, ...draft?.discount }));
          setValidityData(prev => ({ ...prev, ...draft?.validity }));
          setCustomizationData(prev => ({ ...prev, ...draft?.customization }));
          setCurrentStep(draft?.currentStep || 1);
          return;
        }
      } catch (error) {
        toast.info('Unable to load draft from server. Trying local backup.');
      }

      const savedDraft = localStorage.getItem('coupon-draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft?.status !== 'draft') {
            localStorage.removeItem('coupon-draft');
            return;
          }
          setCouponStatus('draft');
          setTemplateData(draft?.templateData || null);
          setDiscountData(prev => ({ ...prev, ...draft?.discountData }));
          setValidityData(prev => ({ ...prev, ...draft?.validityData }));
          setCustomizationData(prev => ({ ...prev, ...draft?.customizationData }));
          setCurrentStep(draft?.currentStep || 1);
        } catch (error) {
          toast.error(getApiErrorMessage(error, 'Failed to load draft backup'));
        }
      }
    };

    const loadRequestedCoupon = async () => {
      const requestedCouponId = location?.state?.couponId || null;
      const requestedCouponData = location?.state?.couponData || null;

      if (!requestedCouponId && !requestedCouponData) return false;

      if (requestedCouponData) {
        setCouponId(requestedCouponId || null);
        setCouponStatus(location?.state?.couponStatus || 'draft');
        setTemplateData(requestedCouponData?.template || null);
        setDiscountData((prev) => ({ ...prev, ...requestedCouponData?.discount }));
        setValidityData((prev) => ({ ...prev, ...requestedCouponData?.validity }));
        setCustomizationData((prev) => ({ ...prev, ...requestedCouponData?.customization }));
        setCurrentStep(location?.state?.currentStep || 1);
        return true;
      }

      try {
        const { data } = await api.get(`/coupons/${requestedCouponId}`);
        const coupon = data?.data;
        if (!coupon) {
          toast.error('Coupon not found');
          return true;
        }

        setCouponId(coupon?.id || requestedCouponId);
        setCouponStatus(coupon?.status || 'draft');
        setTemplateData(coupon?.template || null);
        setDiscountData((prev) => ({ ...prev, ...coupon?.discount }));
        setValidityData((prev) => ({ ...prev, ...coupon?.validity }));
        setCustomizationData((prev) => ({ ...prev, ...coupon?.customization }));
        setCurrentStep(coupon?.currentStep || 1);
        return true;
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load coupon'));
        return true;
      }
    };

    (async () => {
      const handled = await loadRequestedCoupon();
      if (!handled) await loadDraft();
    })();
  }, []);

  useEffect(() => {
    const loadBusinessProfile = async () => {
      try {
        const { data } = await api.get('/business');
        setBusinessProfile(data?.data || null);
      } catch {
        setBusinessProfile(null);
      }
    };
    loadBusinessProfile();
  }, []);

  useEffect(() => {
    if (!businessProfile || didPrefillRef.current) return;
    setCustomizationData((prev) => {
      let changed = false;
      const next = { ...prev };
      if (!prev.businessName && businessProfile.name) {
        next.businessName = businessProfile.name;
        changed = true;
      }
      if (!prev.logo && businessProfile.logoUrl) {
        next.logo = { url: businessProfile.logoUrl, name: 'Business logo' };
        changed = true;
      }
      return changed ? next : prev;
    });
    didPrefillRef.current = true;
  }, [businessProfile]);

  // Auto-save draft periodically with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(false, couponStatus, 'autosave').catch((err) => {
        const now = Date.now();
        if (now - lastAutosaveErrorAtRef.current > 30_000) {
          toast.error(getApiErrorMessage(err, 'Autosave failed'));
          lastAutosaveErrorAtRef.current = now;
        }
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [templateData, discountData, validityData, customizationData, currentStep, couponStatus]);

  const buildPayload = (status = 'draft') => ({
    template: templateData,
    discount: discountData,
    validity: validityData,
    customization: customizationData,
    status,
    currentStep,
  });

  const saveDraft = async (showNotification = true, status = 'draft', mode = 'draft') => {
    if (showNotification && mode === 'draft') setIsSavingDraft(true);
    if (showNotification && mode === 'publish') setIsPublishing(true);
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
      setCouponStatus(status);

      if (status === 'draft') {
        localStorage.setItem(
          'coupon-draft',
          JSON.stringify({
            templateData,
            discountData,
            validityData,
            customizationData,
            currentStep,
            status,
            lastSaved: new Date()?.toISOString(),
          })
        );
      } else {
        localStorage.removeItem('coupon-draft');
      }

      if (showNotification) {
        toast.success(status === 'active' ? 'Coupon published' : 'Draft saved successfully');
      }
      return saved?.id || couponId;
    } catch (error) {
      if (showNotification) {
        toast.error(getApiErrorMessage(error, 'Failed to save draft'));
      }
      throw error;
    } finally {
      if (showNotification && mode === 'draft') {
        setTimeout(() => setIsSavingDraft(false), 800);
      }
      if (showNotification && mode === 'publish') {
        setIsPublishing(false);
      }
    }
  };

  const validateCurrentStep = (strict = false) => {
    switch (currentStep) {
      case 1: // Template Selection
        return templateData !== null || !strict;
      
      case 2: // Discount Configuration
        if (!discountData?.type) return !strict;
        
        switch (discountData?.type) {
          case 'percentage':
            return !strict || (discountData?.percentage && 
                   parseFloat(discountData?.percentage) > 0 && 
                   parseFloat(discountData?.percentage) <= 100);
          case 'fixed':
            return !strict || (discountData?.amount && parseFloat(discountData?.amount) > 0);
          case 'bogo':
            return !strict || discountData?.bogoType;
          case 'free_shipping':
            return true;
          default:
            return !strict;
        }
      
      case 3: // Validity Settings
        if (validityData?.type === 'date_range') {
          return !strict || (validityData?.startDate && validityData?.endDate);
        } else if (validityData?.type === 'duration') {
          return !strict || (validityData?.durationDays && parseInt(validityData?.durationDays) > 0);
        }
        return true;
      
      case 4: // Customization
        return !strict || (customizationData?.businessName && customizationData?.title);
      
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
    if (validateCurrentStep(true)) {
      const id = await saveDraft(false, couponStatus, null);
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

  const handlePublish = async () => {
    if (!validateCurrentStep(true)) {
      toast.error('Please complete required fields before publishing');
      return;
    }
    try {
      const id = await saveDraft(true, 'active', 'publish');
      navigate('/share-coupon', { state: { couponId: id || couponId } });
    } catch (err) {
      // toast handled in saveDraft
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    saveDraft(false, couponStatus, null);
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
              <h1 className="text-3xl font-bold text-foreground">{isExplicitEdit ? 'Edit Coupon' : 'Create New Coupon'}</h1>
              <p className="text-muted-foreground mt-2">
                {isExplicitEdit
                  ? 'Update your coupon details and save changes'
                  : 'Build professional digital coupons in minutes with our step-by-step wizard'}
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
                  onSaveDraft={() => saveDraft(true, 'draft', 'draft')}
                  onPreview={handlePreview}
                  onPublish={handlePublish}
                  isValid={validateCurrentStep()}
                  isSavingDraft={isSavingDraft}
                  isPublishing={isPublishing}
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
                  
                  <ul className="mt-4 text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Template: {templateData?.name || 'Not selected'}</li>
                    <li>Discount: {discountData?.type || 'Not configured'}</li>
                    <li>Validity: {validityData?.type || 'Not set'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Exit Confirmation Modal */}
      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent className="max-w-md bg-card">
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
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExitModal(false)}
                  >
                    Continue Editing
                  </Button>
                </DialogClose>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCoupon;
