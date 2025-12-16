import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ShareMethodCard from './components/ShareMethodCard';
import QRCodeGenerator from './components/QRCodeGenerator';
import ShareHistoryPanel from './components/ShareHistoryPanel';
import ShareLinkCustomizer from './components/ShareLinkCustomizer';
import api from '../../apiClient';
import { useToast } from '../../components/ui/ToastProvider';
import { getApiErrorMessage } from '../../utils/apiError';

const ShareCoupon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [couponData, setCouponData] = useState(location?.state?.couponData || null);
  const couponId = location?.state?.couponId || location?.state?.couponData?.id;

  const [shareHistory, setShareHistory] = useState([]);
  const [shareLinks, setShareLinks] = useState({});
  const [shareStats, setShareStats] = useState({
    totalShares: 0,
    totalClicks: 0,
    totalRedemptions: 0,
  });

  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [qrShareId, setQrShareId] = useState(null);
  const [qrShareUrl, setQrShareUrl] = useState(null);

  const [isLinkCustomizerVisible, setIsLinkCustomizerVisible] = useState(false);
  const [linkShareUrl, setLinkShareUrl] = useState(null);

  const displayCoupon = useMemo(() => {
    if (!couponData) return null;
    const logo = couponData?.customization?.logo;
    const logoUrl = typeof logo === 'string' ? logo : logo?.url;
    return {
      id: couponData?.id,
      title: couponData?.customization?.title || couponData?.title || 'Untitled coupon',
      description: couponData?.customization?.description || couponData?.description || '',
      businessName: couponData?.customization?.businessName || couponData?.businessName || '',
      expiryDate: couponData?.validity?.endDate || couponData?.expiryDate || null,
      usageLimit: couponData?.validity?.totalLimit || couponData?.usageLimit || null,
      thumbnail: logoUrl || null,
    };
  }, [couponData]);

  const engagementByType = useMemo(
    () =>
      (shareHistory || []).reduce((acc, item) => {
        const key = item?.type || item?.channel;
        if (!key) return acc;
        if (!acc[key]) acc[key] = { clicks: 0, redemptions: 0 };
        acc[key].clicks += item?.clicks || 0;
        acc[key].redemptions += item?.redemptions || 0;
        return acc;
      }, {}),
    [shareHistory]
  );

  const sharingMethods = [
    {
      id: 'qr',
      type: 'qr',
      title: 'QR Code',
      description: 'Generate scannable QR codes for print materials',
      features: ['Multiple sizes', 'Print ready', 'Analytics'],
    },
    {
      id: 'email',
      type: 'email',
      title: 'Email Campaign',
      description: 'Send via email',
      features: ['Prefilled subject', 'Tracking link'],
    },
    {
      id: 'facebook',
      type: 'facebook',
      title: 'Facebook',
      description: 'Share on Facebook',
      features: ['Share dialog', 'Tracking link'],
    },
    {
      id: 'instagram',
      type: 'instagram',
      title: 'Instagram',
      description: 'Share on Instagram (copy link)',
      features: ['Copy link', 'Mobile-friendly'],
    },
    {
      id: 'twitter',
      type: 'twitter',
      title: 'Twitter',
      description: 'Share on X/Twitter',
      features: ['Tweet intent', 'Tracking link'],
    },
    {
      id: 'whatsapp',
      type: 'whatsapp',
      title: 'WhatsApp',
      description: 'Share via WhatsApp',
      features: ['Prefilled message', 'Tracking link'],
    },
    {
      id: 'link',
      type: 'link',
      title: 'Direct Link',
      description: 'Copy a shareable link',
      features: ['Copy', 'UTM builder'],
    },
  ];

  const normalizeShares = (raw) =>
    (raw || []).map((item) => ({
      ...item,
      channel: item?.type || item?.channel,
      sharedAt: item?.createdAt,
      clicks: item?.clicks || 0,
      redemptions: item?.redemptions || 0,
      shareUrl: item?.config?.shareUrl,
    }));

  const reloadShares = async () => {
    if (!couponId) return;
    const { data } = await api.get(`/shares/${couponId}`);
    const history = normalizeShares(data?.data);
    setShareHistory(history);
    const linksMap = {};
    history.forEach((item) => {
      if (item?.type && item?.shareUrl) {
        linksMap[item.type] = { id: item.id, url: item.shareUrl };
      }
    });
    setShareLinks(linksMap);
  };

  useEffect(() => {
    const loadCoupon = async () => {
      if (couponData) return;
      if (!couponId) return;
      try {
        const { data } = await api.get(`/coupons/${couponId}`);
        setCouponData(data?.data);
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Failed to load coupon'));
      }
    };
    loadCoupon();
  }, [couponData, couponId, toast]);

  useEffect(() => {
    const loadShares = async () => {
      try {
        await reloadShares();
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Failed to load share history'));
      }
    };
    if (couponId) loadShares();
  }, [couponId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const totalClicks = (shareHistory || []).reduce((sum, item) => sum + (item?.clicks || 0), 0);
    const totalRedemptions = (shareHistory || []).reduce((sum, item) => sum + (item?.redemptions || 0), 0);
    setShareStats({
      totalShares: (shareHistory || []).length,
      totalClicks,
      totalRedemptions,
    });
  }, [shareHistory]);

  const ensureShare = async (method) => {
    if (shareLinks?.[method?.type]) return shareLinks[method.type];
    const { data } = await api.post('/shares', {
      couponId,
      type: method?.type,
      channel: method?.type,
      config: method,
    });
    const share = data?.data;
    const url = share?.config?.shareUrl;
    setShareLinks((prev) => ({
      ...prev,
      [method?.type]: { id: share?.id, url },
    }));
    return { id: share?.id, url };
  };

  const openLinkCustomizer = async () => {
    try {
      const share = await ensureShare({ type: 'link' });
      setLinkShareUrl(share?.url || null);
      setIsLinkCustomizerVisible(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to prepare link'));
    }
  };

  const handleShare = async (method) => {
    if (!couponId) return;

    if (method?.type === 'qr') {
      setIsGeneratingQR(true);
      try {
        const share = await ensureShare(method);
        setQrShareId(share?.id || null);
        setQrShareUrl(share?.url || null);
        setIsQRModalVisible(true);
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Failed to prepare QR code'));
      } finally {
        setIsGeneratingQR(false);
      }
      return;
    }

    if (method?.type === 'link') {
      await openLinkCustomizer();
      return;
    }

    try {
      const share = await ensureShare(method);
      const resolvedShareUrl = share?.url;
      await reloadShares();
      toast.success(`Shared via ${method?.title || method?.type}`);

      if (!resolvedShareUrl) return;
      switch (method?.type) {
        case 'email':
          window.open(
            `mailto:?subject=${encodeURIComponent(displayCoupon?.title || 'Exclusive offer')}&body=${encodeURIComponent(resolvedShareUrl)}`
          );
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolvedShareUrl)}`, '_blank');
          break;
        case 'instagram':
          await navigator.clipboard?.writeText(resolvedShareUrl);
          toast.info('Link copied. Share it in the Instagram app.');
          break;
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(displayCoupon?.title || 'Exclusive offer')}&url=${encodeURIComponent(resolvedShareUrl)}`,
            '_blank'
          );
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this offer: ${resolvedShareUrl}`)}`);
          break;
        default:
          break;
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to share'));
    }
  };

  const handleSaveCustomLink = async (linkData) => {
    const finalUrl = linkData?.finalUrl || linkShareUrl;
    if (!finalUrl) return;
    try {
      await navigator.clipboard?.writeText(finalUrl);
      toast.success('Link copied');
    } catch {
      toast.success('Link generated');
    }
  };

  const handleViewDetails = () => {
    toast.info('Detailed share analytics is coming soon');
  };

  if (!couponId && !displayCoupon) {
    return (
      <div className="min-h-screen bg-background">
        <Header isInWorkflow={true} workflowStep={3} />
        <main className="pt-16">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="bg-white rounded-xl border border-border shadow-level-1 p-8 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertTriangle" size={20} className="text-muted-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground mb-2">Missing coupon</h1>
              <p className="text-sm text-muted-foreground mb-6">Open this page from the preview flow after creating a coupon.</p>
              <Button variant="outline" onClick={() => navigate('/business-dashboard')}>
                Back to dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isInWorkflow={true} workflowStep={3} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Share your coupon</h1>
            <p className="text-muted-foreground">Generate a tracked link or QR code to distribute your offer.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg shadow-level-1 p-6">
              <div className="text-sm text-muted-foreground">Total shares</div>
              <div className="text-2xl font-bold text-foreground">{shareStats.totalShares}</div>
            </div>
            <div className="bg-card rounded-lg shadow-level-1 p-6">
              <div className="text-sm text-muted-foreground">Total clicks</div>
              <div className="text-2xl font-bold text-foreground">{shareStats.totalClicks}</div>
            </div>
            <div className="bg-card rounded-lg shadow-level-1 p-6">
              <div className="text-sm text-muted-foreground">Total redemptions</div>
              <div className="text-2xl font-bold text-foreground">{shareStats.totalRedemptions}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-border shadow-level-1 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Sharing methods</h2>
                    <p className="text-sm text-muted-foreground">Choose a channel to generate a tracked link</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={openLinkCustomizer} iconName="Settings" iconPosition="left">
                    Customize link
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sharingMethods.map((method) => (
                    <ShareMethodCard
                      key={method.id}
                      method={{ ...method, engagement: engagementByType?.[method.type] }}
                      onShare={handleShare}
                      isGenerating={isGeneratingQR && method.type === 'qr'}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border shadow-level-1 p-6">
                <h3 className="font-semibold text-foreground mb-4">Coupon preview</h3>
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                    {displayCoupon?.thumbnail ? (
                      <img src={displayCoupon.thumbnail} alt="Coupon logo" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="Ticket" size={22} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{displayCoupon?.title}</h4>
                    <p className="text-sm text-muted-foreground">{displayCoupon?.businessName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        Expires:{' '}
                        {displayCoupon?.expiryDate ? new Date(displayCoupon.expiryDate).toLocaleDateString() : 'N/A'}
                      </span>
                      <span>·</span>
                      <span>Limit: {displayCoupon?.usageLimit || 'Unlimited'}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/coupon-preview')} iconName="Edit" iconPosition="left">
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <ShareHistoryPanel
                shareHistory={shareHistory}
                onViewDetails={handleViewDetails}
                onCopyLink={async (url) => {
                  try {
                    await navigator.clipboard?.writeText(url);
                    toast.success('Share link copied');
                  } catch {
                    toast.error('Failed to copy link');
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => navigate('/business-dashboard')} iconName="Home" iconPosition="left">
              Back to dashboard
            </Button>
            <Button variant="default" onClick={() => navigate('/create-coupon')} iconName="Plus" iconPosition="left">
              Create new coupon
            </Button>
          </div>
        </div>
      </main>

      <QRCodeGenerator
        couponData={displayCoupon}
        shareId={qrShareId}
        shareUrl={qrShareUrl}
        isVisible={isQRModalVisible}
        onClose={() => {
          setIsQRModalVisible(false);
          setIsGeneratingQR(false);
          setQrShareId(null);
          setQrShareUrl(null);
        }}
      />

      <ShareLinkCustomizer
        baseUrl={linkShareUrl}
        isVisible={isLinkCustomizerVisible}
        onClose={() => setIsLinkCustomizerVisible(false)}
        onSave={handleSaveCustomLink}
      />
    </div>
  );
};

export default ShareCoupon;

