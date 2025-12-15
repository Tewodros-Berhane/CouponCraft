import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ShareMethodCard from './components/ShareMethodCard';
import QRCodeGenerator from './components/QRCodeGenerator';
import ShareHistoryPanel from './components/ShareHistoryPanel';
import BulkShareModal from './components/BulkShareModal';
import ShareLinkCustomizer from './components/ShareLinkCustomizer';
import api from '../../apiClient';
import { useToast } from '../../components/ui/ToastProvider';

const ShareCoupon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [isLinkCustomizerVisible, setIsLinkCustomizerVisible] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [shareStats, setShareStats] = useState({
    totalShares: 0,
    totalClicks: 0,
    totalRedemptions: 0
  });
  const [couponData, setCouponData] = useState(location?.state?.couponData || null);
  const couponId = location?.state?.couponId || location?.state?.couponData?.id;
  const [shareHistory, setShareHistory] = useState([]);
  const toast = useToast();

  // Mock coupon data - in real app, this would come from props or API
  const fallbackCoupon = {
    id: 'coup_001',
    title: '25% Off Summer Collection',
    description: 'Get 25% off on all summer items. Valid for new and existing customers.',
    discountType: 'percentage',
    discountValue: 25,
    businessName: 'Fashion Forward Boutique',
    expiryDate: '2024-12-31',
    usageLimit: 100,
    shareUrl: 'https://couponcraft.com/redeem/coup_001',
    qrCodeUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
  };

  const displayCoupon = couponData
    ? {
        id: couponData?.id,
        title: couponData?.customization?.title || couponData?.title,
        description: couponData?.customization?.description || couponData?.description,
        discountType: couponData?.discount?.type === 'fixed' ? 'fixed' : 'percentage',
        discountValue:
          couponData?.discount?.type === 'fixed'
            ? couponData?.discount?.amount
            : couponData?.discount?.percentage,
        businessName: couponData?.customization?.businessName || couponData?.businessName,
        expiryDate: couponData?.validity?.endDate || couponData?.expiryDate,
        usageLimit: couponData?.validity?.totalLimit || couponData?.usageLimit,
        shareUrl: couponData?.shareUrl || `https://couponcraft.com/redeem/${couponData?.id}`,
        thumbnail:
          couponData?.customization?.logo ||
          couponData?.thumbnail ||
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      }
    : fallbackCoupon;

  const sharingMethods = [
    {
      id: 'qr',
      type: 'qr',
      title: 'QR Code',
      description: 'Generate scannable QR codes for print materials',
      features: ['Multiple sizes', 'Print ready', 'Analytics'],
      engagement: { clicks: 45, redemptions: 12 }
    },
    {
      id: 'email',
      type: 'email',
      title: 'Email Campaign',
      description: 'Send to your customer database',
      features: ['Templates', 'Segmentation', 'Scheduling'],
      engagement: { clicks: 128, redemptions: 34 },
      preview: 'Subject: Exclusive 25% Off Just for You! 🎉'
    },
    {
      id: 'facebook',
      type: 'facebook',
      title: 'Facebook',
      description: 'Share on your business page',
      features: ['Auto-preview', 'Hashtags', 'Boost option'],
      engagement: { clicks: 89, redemptions: 23 },
      preview: 'Don\'t miss out on our amazing summer sale! 25% off everything...'
    },
    {
      id: 'instagram',
      type: 'instagram',
      title: 'Instagram',
      description: 'Post to stories and feed',
      features: ['Story template', 'Swipe up', 'Highlights'],
      engagement: { clicks: 156, redemptions: 41 },
      preview: '🌟 SUMMER SALE ALERT! 25% off our entire collection...'
    },
    {
      id: 'twitter',
      type: 'twitter',
      title: 'Twitter',
      description: 'Tweet to your followers',
      features: ['Hashtags', 'Mentions', 'Thread'],
      engagement: { clicks: 67, redemptions: 18 },
      preview: '🔥 FLASH SALE: 25% off everything! Limited time only...'
    },
    {
      id: 'whatsapp',
      type: 'whatsapp',
      title: 'WhatsApp',
      description: 'Share via WhatsApp Business',
      features: ['Broadcast', 'Groups', 'Status'],
      engagement: { clicks: 92, redemptions: 28 },
      preview: 'Hi! Check out this exclusive offer from Fashion Forward Boutique...'
    },
    {
      id: 'link',
      type: 'link',
      title: 'Direct Link',
      description: 'Copy shareable link',
      features: ['Custom URL', 'Tracking', 'Expiration'],
      engagement: { clicks: 203, redemptions: 56 }
    }
  ];

  // Mock available channels for bulk sharing
  const availableChannels = [
    { id: 'email', type: 'email', name: 'Email Newsletter', audience: '2.5K' },
    { id: 'facebook', type: 'facebook', name: 'Facebook Page', audience: '1.8K' },
    { id: 'instagram', type: 'instagram', name: 'Instagram Business', audience: '3.2K' },
    { id: 'twitter', type: 'twitter', name: 'Twitter Account', audience: '950' },
    { id: 'whatsapp', type: 'whatsapp', name: 'WhatsApp Business', audience: '500' },
    { id: 'linkedin', type: 'linkedin', name: 'LinkedIn Company', audience: '1.2K' }
  ];

  useEffect(() => {
    const loadCoupon = async () => {
      if (couponData) return;
      if (!couponId) return;
      try {
        const { data } = await api.get(`/coupons/${couponId}`);
        setCouponData(data?.data);
      } catch (err) {
        console.error('Failed to load coupon for sharing', err);
      }
    };
    loadCoupon();
  }, [couponData, couponId]);

  useEffect(() => {
    const loadShares = async () => {
      if (!couponId) return;
      try {
        const { data } = await api.get(`/shares/${couponId}`);
        const history = (data?.data || []).map((item) => ({
          ...item,
          channel: item?.type || item?.channel,
          sharedAt: item?.createdAt,
          clicks: item?.clicks || 0,
          redemptions: item?.redemptions || 0,
          shareUrl: item?.config?.shareUrl,
        }));
        setShareHistory(history);
      } catch (err) {
        console.error('Failed to load share history', err);
        toast.error('Failed to load share history');
      }
    };
    loadShares();
  }, [couponId]);

  useEffect(() => {
    // Calculate total stats
    const totalClicks = shareHistory?.reduce((sum, item) => sum + item?.clicks, 0);
    const totalRedemptions = shareHistory?.reduce((sum, item) => sum + item?.redemptions, 0);
    
    setShareStats({
      totalShares: shareHistory?.length,
      totalClicks,
      totalRedemptions
    });
  }, [shareHistory]);

  const handleShare = async (method) => {
    if (method?.type === 'qr') {
      setIsGeneratingQR(true);
      setIsQRModalVisible(true);
      return;
    }

    if (method?.type === 'link') {
      setIsLinkCustomizerVisible(true);
      return;
    }

    // Simulate sharing process for other methods
    console.log(`Sharing via ${method?.type}:`, method);
    
    if (couponId) {
      try {
        await api.post('/shares', {
          couponId,
          type: method?.type,
          channel: method?.type,
          config: method,
        });
        const { data } = await api.get(`/shares/${couponId}`);
        const history = (data?.data || []).map((item) => ({
          ...item,
          channel: item?.type || item?.channel,
          sharedAt: item?.createdAt,
          clicks: item?.clicks || 0,
          redemptions: item?.redemptions || 0,
          shareUrl: item?.config?.shareUrl,
        }));
        setShareHistory(history);
        toast.success(`Shared via ${method?.title || method?.type}`);
      } catch (err) {
        console.error('Failed to record share', err);
        toast.error('Failed to record share');
      }
    }

    // In a real app, this would integrate with respective APIs
    switch (method?.type) {
      case 'email':
        // Open email composer or redirect to email campaign tool
        break;
      case 'facebook':
        // Use Facebook SDK to post
        break;
      case 'instagram':
        // Redirect to Instagram with pre-filled content
        break;
      case 'twitter':
        // Use Twitter API or redirect to Twitter compose
        break;
      case 'whatsapp':
        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this amazing offer: ${displayCoupon?.shareUrl}`)}`);
        break;
      default:
        break;
    }
  };

  const handleBulkShare = (shareData) => {
    console.log('Bulk sharing:', shareData);
    // In a real app, this would process bulk sharing across selected channels
  };

  const handleViewDetails = (shareItem) => {
    console.log('Viewing details for:', shareItem);
    // In a real app, this would show detailed analytics
  };

  const handleSaveCustomLink = (linkData) => {
    console.log('Custom link saved:', linkData);
    // In a real app, this would save the custom link configuration
  };

  const handleBackToPreview = () => {
    navigate('/coupon-preview');
  };

  const handleBackToDashboard = () => {
    navigate('/business-dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isInWorkflow={true} workflowStep={3} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Share Your Coupon</h1>
                <p className="text-muted-foreground">Distribute your coupon across multiple channels and track performance</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBackToPreview}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Preview
                </Button>
                <Button
                  variant="default"
                  onClick={() => setIsBulkModalVisible(true)}
                  iconName="Share"
                  iconPosition="left"
                >
                  Bulk Share
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Share" size={20} color="#059669" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{shareStats?.totalShares}</div>
                    <div className="text-sm text-muted-foreground">Total Shares</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="MousePointer" size={20} color="#2563eb" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{shareStats?.totalClicks}</div>
                    <div className="text-sm text-muted-foreground">Total Clicks</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="ShoppingCart" size={20} color="#f59e0b" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{shareStats?.totalRedemptions}</div>
                    <div className="text-sm text-muted-foreground">Redemptions</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={20} color="#10b981" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {shareStats?.totalClicks > 0 ? ((shareStats?.totalRedemptions / shareStats?.totalClicks) * 100)?.toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Sharing Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-border shadow-level-1 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Sharing Methods</h2>
                    <p className="text-sm text-muted-foreground">Choose how you want to distribute your coupon</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLinkCustomizerVisible(true)}
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Customize Link
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sharingMethods?.map((method) => (
                    <ShareMethodCard
                      key={method?.id}
                      method={method}
                      onShare={handleShare}
                      isGenerating={isGeneratingQR && method?.type === 'qr'}
                    />
                  ))}
                </div>
              </div>

              {/* Coupon Preview Card */}
              <div className="bg-white rounded-xl border border-border shadow-level-1 p-6">
                <h3 className="font-semibold text-foreground mb-4">Coupon Preview</h3>
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={displayCoupon?.thumbnail} 
                      alt="Coupon preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{displayCoupon?.title}</h4>
                    <p className="text-sm text-muted-foreground">{displayCoupon?.businessName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Expires: {displayCoupon?.expiryDate ? new Date(displayCoupon.expiryDate)?.toLocaleDateString() : 'N/A'}</span>
                      <span>•</span>
                      <span>Limit: {displayCoupon?.usageLimit || 'Unlimited'} uses</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToPreview}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar - Share History */}
            <div className="lg:col-span-1">
              <ShareHistoryPanel
                shareHistory={shareHistory}
                onViewDetails={handleViewDetails}
                onCopyLink={(url) => {
                  navigator.clipboard?.writeText(url);
                  toast.success('Share link copied');
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              iconName="Home"
              iconPosition="left"
            >
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsBulkModalVisible(true)}
                iconName="Zap"
                iconPosition="left"
              >
                Bulk Share
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/create-coupon')}
                iconName="Plus"
                iconPosition="left"
              >
                Create New Coupon
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <QRCodeGenerator
        couponData={displayCoupon}
        isVisible={isQRModalVisible}
        onClose={() => {
          setIsQRModalVisible(false);
          setIsGeneratingQR(false);
        }}
      />
      <BulkShareModal
        isVisible={isBulkModalVisible}
        onClose={() => setIsBulkModalVisible(false)}
        onBulkShare={handleBulkShare}
        availableChannels={availableChannels}
      />
      <ShareLinkCustomizer
        baseUrl={displayCoupon?.shareUrl}
        isVisible={isLinkCustomizerVisible}
        onClose={() => setIsLinkCustomizerVisible(false)}
        onSave={handleSaveCustomLink}
      />
    </div>
  );
};

export default ShareCoupon;
