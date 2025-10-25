import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import DevicePreview from './components/DevicePreview';
import PreviewControls from './components/PreviewControls';
import ValidationPanel from './components/ValidationPanel';
import CustomerRedemptionFlow from './components/CustomerRedemptionFlow';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CouponPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock coupon data - in real app this would come from state/props
  const [couponData] = useState({
    id: 'coup_2024_001',
    businessName: 'Bella Vista Restaurant',
    businessType: 'Italian Restaurant & Pizzeria',
    discountType: 'percentage',
    discountValue: 25,
    description: 'Valid on all dinner menu items including pasta, pizza, and appetizers',
    expiryDate: '03/15/2024',
    minimumOrder: 35.00,
    usageLimit: 200,
    primaryColor: '#d97706',
    secondaryColor: '#f59e0b',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  });

  const tabs = [
    { id: 'preview', label: 'Device Preview', icon: 'Monitor' },
    { id: 'validation', label: 'Validation', icon: 'CheckCircle' },
    { id: 'redemption', label: 'Customer Flow', icon: 'Users' }
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleEdit = () => {
    navigate('/create-coupon', { 
      state: { 
        editMode: true, 
        couponData: couponData 
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
        alert(`Coupon shared to ${channel} successfully!`);
      }, 1500);
    } else {
      // Navigate to share page
      navigate('/share-coupon', { 
        state: { 
          couponData: couponData 
        } 
      });
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Coupon saved to your library successfully!');
    }, 1000);
  };

  const handleExport = (format) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `coupon-${couponData?.id}.${format}`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      alert(`Coupon exported as ${format?.toUpperCase()} successfully!`);
    }, 2000);
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
            couponData={couponData}
            selectedDevice={selectedDevice}
            onDeviceChange={handleDeviceChange}
          />
        );
      case 'validation':
        return <ValidationPanel couponData={couponData} />;
      case 'redemption':
        return <CustomerRedemptionFlow couponData={couponData} />;
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
                couponData={couponData}
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