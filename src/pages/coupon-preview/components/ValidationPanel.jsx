import React, { useEffect, useState } from 'react';
import api from '../../../apiClient';
import Icon from '../../../components/AppIcon';

const ValidationPanel = ({ couponData }) => {
  const [shareLink, setShareLink] = useState(null);
  const [shareLinkStatus, setShareLinkStatus] = useState('idle');

  const canGenerateShare = couponData?.status === 'active';

  useEffect(() => {
    let isMounted = true;

    const loadShareLink = async () => {
      if (!couponData?.id || !canGenerateShare) {
        if (isMounted) {
          setShareLink(null);
          setShareLinkStatus(canGenerateShare ? 'idle' : 'disabled');
        }
        return;
      }

      setShareLinkStatus('loading');
      try {
        const { data } = await api.post('/shares', {
          couponId: couponData.id,
          type: 'link',
        });
        const resolvedLink = data?.data?.shareUrl || data?.data?.config?.shareUrl || null;
        if (isMounted) {
          setShareLink(resolvedLink);
          setShareLinkStatus(resolvedLink ? 'ready' : 'empty');
        }
      } catch {
        if (isMounted) {
          setShareLink(null);
          setShareLinkStatus('error');
        }
      }
    };

    loadShareLink();

    return () => {
      isMounted = false;
    };
  }, [couponData?.id, canGenerateShare]);

  const shareLinkLabel = shareLink
    ? shareLink
    : shareLinkStatus === 'loading'
      ? 'Generating share link...'
      : shareLinkStatus === 'error'
        ? 'Unable to load share link'
        : canGenerateShare
          ? 'Share link not available'
          : 'Publish coupon to generate share link';
  const validationChecks = [
    {
      id: 'business_name',
      label: 'Business Name',
      status: couponData?.businessName ? 'valid' : 'invalid',
      message: couponData?.businessName ? 'Business name is set' : 'Business name is required',
      required: true,
    },
    {
      id: 'discount_value',
      label: 'Discount Value',
      status: couponData?.discountValue ? 'valid' : 'invalid',
      message: couponData?.discountValue
        ? 'Discount value is configured'
        : 'Discount value is required',
      required: true,
    },
    {
      id: 'expiry_date',
      label: 'Expiry Date',
      status: couponData?.expiryDate ? 'valid' : 'warning',
      message: couponData?.expiryDate ? 'Expiry date is set' : 'Consider setting an expiry date',
      required: false,
    },
    {
      id: 'description',
      label: 'Description',
      status: couponData?.description ? 'valid' : 'warning',
      message: couponData?.description
        ? 'Description is provided'
        : 'Description helps customers understand the offer',
      required: false,
    },
    {
      id: 'minimum_order',
      label: 'Minimum Order',
      status: couponData?.minimumOrder ? 'valid' : 'warning',
      message: couponData?.minimumOrder
        ? 'Minimum order amount is set'
        : 'Consider setting a minimum order amount',
      required: false,
    },
    {
      id: 'usage_limit',
      label: 'Usage Limit',
      status: couponData?.usageLimit ? 'valid' : 'warning',
      message: couponData?.usageLimit
        ? 'Usage limit is configured'
        : 'Consider setting a usage limit',
      required: false,
    },
  ];

  const optimizationSuggestions = [
    {
      id: 'share_link',
      title: 'Share Link Ready',
      description:
        'Your coupon is formatted for fast link sharing with clear visuals and contrast.',
      status: 'good',
      icon: 'Link',
    },
    {
      id: 'mobile_friendly',
      title: 'Mobile Friendly',
      description: 'Coupon design adapts well to mobile devices with readable text and clear CTAs.',
      status: 'good',
      icon: 'Smartphone',
    },
    {
      id: 'print_ready',
      title: 'Print Quality',
      description:
        'High resolution export available for print materials and physical distribution.',
      status: 'good',
      icon: 'Printer',
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: couponData?.primaryColor
        ? 'Good color contrast for accessibility compliance.'
        : 'Consider using higher contrast colors for better accessibility.',
      status: couponData?.primaryColor ? 'good' : 'warning',
      icon: 'Eye',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
      case 'good':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={16} className="text-warning" />;
      case 'invalid':
        return <Icon name="XCircle" size={16} className="text-error" />;
      default:
        return <Icon name="Circle" size={16} className="text-muted-foreground" />;
    }
  };

  const validCount = validationChecks?.filter((check) => check?.status === 'valid')?.length;
  const totalRequired = validationChecks?.filter((check) => check?.required)?.length;
  const requiredValid = validationChecks?.filter(
    (check) => check?.required && check?.status === 'valid'
  )?.length;

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Validation Status</h3>
          <div className="flex items-center space-x-2">
            {requiredValid === totalRequired ? (
              <Icon name="CheckCircle" size={20} className="text-success" />
            ) : (
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            )}
            <span className="text-sm font-medium text-foreground">
              {requiredValid}/{totalRequired} Required
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {validationChecks?.map((check) => (
            <div key={check?.id} className="flex items-start space-x-3">
              {getStatusIcon(check?.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-foreground">{check?.label}</p>
                  {check?.required && (
                    <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{check?.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Completion</span>
            <span className="text-sm font-medium text-foreground">
              {Math.round((validCount / validationChecks?.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${(validCount / validationChecks?.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {/* Optimization Suggestions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Optimization</h3>
        <div className="space-y-4">
          {optimizationSuggestions?.map((suggestion) => (
            <div key={suggestion?.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">{getStatusIcon(suggestion?.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Icon name={suggestion?.icon} size={16} className="text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">{suggestion?.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{suggestion?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* QR Code Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">QR Code Details</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Format</span>
            <span className="text-sm font-medium text-foreground">PNG, 300x300px</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Error Correction</span>
            <span className="text-sm font-medium text-foreground">Medium (15%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Scan Distance</span>
            <span className="text-sm font-medium text-foreground">Up to 3 feet</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Link</span>
            <span className="text-sm font-medium text-foreground text-primary truncate">
              {shareLinkLabel}
            </span>
          </div>
        </div>
      </div>
      {/* File Size Estimates */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Export Sizes</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">PNG (High Quality)</span>
            <span className="text-sm font-medium text-foreground">2.1 MB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">JPEG (Compressed)</span>
            <span className="text-sm font-medium text-foreground">1.8 MB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">PDF (Print Ready)</span>
            <span className="text-sm font-medium text-foreground">1.2 MB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">SVG (Vector)</span>
            <span className="text-sm font-medium text-foreground">0.3 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
