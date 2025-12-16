import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import DevicePreview from './components/DevicePreview';
import PreviewControls from './components/PreviewControls';
import ValidationPanel from './components/ValidationPanel';
import CustomerRedemptionFlow from './components/CustomerRedemptionFlow';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import api from '../../apiClient';
import { useToast } from '../../components/ui/ToastProvider';
import { getApiErrorMessage } from '../../utils/apiError';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';

const CouponPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [couponData, setCouponData] = useState(location?.state?.couponData || null);
  const couponId = location?.state?.couponId || location?.state?.couponData?.id;
  const toast = useToast();
  const previewRef = useRef(null);

  const fallbackCoupon = {
    id: 'coup_preview',
    businessName: 'Bella Vista Restaurant',
    businessType: 'Italian Restaurant & Pizzeria',
    discountType: 'percentage',
    discountValue: 25,
    description: 'Valid on all dinner menu items including pasta, pizza, and appetizers',
    expiryDate: '2024-12-31',
    minimumOrder: 35.0,
    usageLimit: 200,
    primaryColor: '#d97706',
    secondaryColor: '#f59e0b',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const displayCoupon = couponData
    ? {
        id: couponData?.id,
        businessName: couponData?.customization?.businessName || couponData?.businessName,
        businessType: couponData?.customization?.businessType || couponData?.customization?.title,
        discountType: couponData?.discount?.type === 'fixed' ? 'fixed' : 'percentage',
        discountValue:
          couponData?.discount?.type === 'fixed'
            ? couponData?.discount?.amount
            : couponData?.discount?.percentage,
        description: couponData?.customization?.description || couponData?.description,
        expiryDate: couponData?.validity?.endDate,
        minimumOrder: couponData?.validity?.minimumAmount || couponData?.validity?.minimumQuantity,
        usageLimit: couponData?.validity?.totalLimit || couponData?.validity?.usageLimit,
        primaryColor: couponData?.customization?.colors?.primary,
        secondaryColor: couponData?.customization?.colors?.secondary,
        customization: couponData?.customization,
        discount: couponData?.discount,
        validity: couponData?.validity,
        template: couponData?.template,
      }
    : fallbackCoupon;

  const tabs = [
    { id: 'preview', label: 'Device Preview', icon: 'Monitor' },
    { id: 'validation', label: 'Validation', icon: 'CheckCircle' },
    { id: 'redemption', label: 'Customer Flow', icon: 'Users' }
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadCoupon = async () => {
      if (couponData) return;
      if (!couponId) return;
      setIsLoading(true);
      try {
        const { data } = await api.get(`/coupons/${couponId}`);
        setCouponData(data?.data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load coupon'));
      } finally {
        setIsLoading(false);
      }
    };
    loadCoupon();
  }, [couponId, couponData]);

  useEffect(() => {
    const sendViewEvent = async () => {
      if (!displayCoupon?.id) return;
      try {
        await api.post('/analytics/events', {
          couponId: displayCoupon.id,
          eventType: 'view',
          meta: { source: 'preview' },
        });
      } catch (err) {
        // Ignore analytics failures for preview.
      }
    };
    sendViewEvent();
  }, [displayCoupon?.id]);

  const handleEdit = () => {
    navigate('/create-coupon', { 
      state: { 
        editMode: true, 
        couponData: couponData || displayCoupon,
        couponId: couponId || couponData?.id,
      } 
    });
  };

  const handleShare = (channel = null) => {
    if (channel) {
      // Handle specific channel sharing
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Simulate sharing success
        toast.success(`Coupon shared to ${channel} successfully!`);
      }, 1500);
    } else {
      // Navigate to share page
      navigate('/share-coupon', { 
        state: { 
          couponData: couponData || displayCoupon,
          couponId: couponId || couponData?.id
        } 
      });
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Coupon saved to your library successfully!');
    }, 1000);
  };

  const handleExport = async (format) => {
    const node = previewRef?.current;
    if (!node) {
      toast.error('Preview not ready to export');
      return;
    }
    setIsLoading(true);
    try {
      if (format === 'png') {
        const dataUrl = await toPng(node);
        const link = document.createElement('a');
        link.download = `coupon-${displayCoupon?.id || 'preview'}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'jpg' || format === 'jpeg') {
        const dataUrl = await toJpeg(node);
        const link = document.createElement('a');
        link.download = `coupon-${displayCoupon?.id || 'preview'}.jpg`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'svg') {
        const dataUrl = await toSvg(node);
        const link = document.createElement('a');
        link.download = `coupon-${displayCoupon?.id || 'preview'}.svg`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const dataUrl = await toPng(node);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 10, 10, pdfWidth, pdfHeight);
        pdf.save(`coupon-${displayCoupon?.id || 'preview'}.pdf`);
      } else {
        toast.info('Unsupported format');
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to export coupon'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceChange = (device) => {
    setSelectedDevice(device);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <DevicePreview
            couponData={displayCoupon}
            selectedDevice={selectedDevice}
            onDeviceChange={handleDeviceChange}
            previewRef={previewRef}
          />
        );
      case 'validation':
        return <ValidationPanel couponData={displayCoupon} />;
      case 'redemption':
        return <CustomerRedemptionFlow couponData={displayCoupon} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isInWorkflow={true} workflowStep={2} />
      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Coupon Preview</h1>
                <p className="text-muted-foreground mt-1">
                  Review your coupon across different devices and contexts
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  iconName="Edit3"
                  iconPosition="left"
                  disabled={isLoading}
                >
                  Edit
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleShare()}
                  iconName="Share2"
                  iconPosition="left"
                  disabled={isLoading}
                >
                  Continue to Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Preview Area */}
            <div className="lg:col-span-3">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg border border-border mb-6">
                <div className="border-b border-border">
                  <nav className="flex space-x-8 px-6">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => handleTabChange(tab?.id)}
                        className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                          activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                        }`}
                      >
                        <Icon name={tab?.icon} size={18} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="lg:col-span-1">
              <PreviewControls
                couponData={displayCoupon}
                onEdit={handleEdit}
                onShare={handleShare}
                onSave={handleSave}
                onExport={handleExport}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white rounded-full shadow-level-3 border border-border px-6 py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                iconName="Edit3"
                iconPosition="left"
                disabled={isLoading}
              >
                Edit
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                iconName="Save"
                iconPosition="left"
                disabled={isLoading}
                loading={isLoading}
              >
                Save
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button
                variant="default"
                size="sm"
                onClick={() => handleShare()}
                iconName="Share2"
                iconPosition="left"
                disabled={isLoading}
              >
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-level-4 p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <span className="text-foreground font-medium">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponPreview;
