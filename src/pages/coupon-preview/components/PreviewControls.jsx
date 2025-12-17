import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { formatCurrency, formatDate } from '../../../utils/format';

const PreviewControls = ({ 
  couponData, 
  onEdit, 
  onShare, 
  onSave, 
  onExport,
  isLoading = false 
}) => {
  const exportFormats = [
    { id: 'png', name: 'PNG Image', icon: 'Image' },
    { id: 'jpg', name: 'JPEG Image', icon: 'Image' },
    { id: 'pdf', name: 'PDF Document', icon: 'FileText' },
    { id: 'svg', name: 'SVG Vector', icon: 'Code' }
  ];

  const handleExportFormat = (format) => {
    onExport(format);
  };

  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onEdit}
            iconName="Edit3"
            iconPosition="left"
            disabled={isLoading}
            fullWidth
          >
            Edit Coupon
          </Button>
          <Button
            variant="default"
            onClick={onShare}
            iconName="Share2"
            iconPosition="left"
            disabled={isLoading}
            fullWidth
          >
            Share Coupon
          </Button>
          <Button
            variant="secondary"
            onClick={onSave}
            iconName="Save"
            iconPosition="left"
            disabled={isLoading}
            fullWidth
          >
            Save to Library
          </Button>
          <Button
            variant="success"
            onClick={() => handleExportFormat('png')}
            iconName="Download"
            iconPosition="left"
            disabled={isLoading}
            fullWidth
          >
            Quick Export
          </Button>
        </div>
      </div>
      {/* Export Options */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Export Formats</h3>
        <div className="space-y-3">
          {exportFormats?.map((format) => (
            <div
              key={format?.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name={format?.icon} size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{format?.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExportFormat(format?.id)}
                iconName="Download"
                iconPosition="left"
                disabled={isLoading}
              >
                Export
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Coupon Stats */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Coupon Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Discount Type</span>
            <span className="text-sm font-medium text-foreground capitalize">
              {couponData?.discountType || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Discount Value</span>
            <span className="text-sm font-medium text-foreground">
              {couponData?.discountValue ? (
                couponData?.discountType === 'percentage'
                  ? `${couponData.discountValue}%`
                  : formatCurrency(couponData.discountValue, 'N/A')
              ) : (
                'N/A'
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Expiry Date</span>
            <span className="text-sm font-medium text-foreground">
              {formatDate(couponData?.expiryDate, 'N/A')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Usage Limit</span>
            <span className="text-sm font-medium text-foreground">
              {couponData?.usageLimit || 'Unlimited'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Min. Order</span>
            <span className="text-sm font-medium text-foreground">
              {couponData?.minimumOrder || 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewControls;
