import React from 'react';
import Icon from '../../../components/AppIcon';

const DevicePreview = ({ couponData, selectedDevice, onDeviceChange, previewRef }) => {
  const devices = [
    {
      id: 'desktop',
      name: 'Desktop',
      icon: 'Monitor',
      width: '400px',
      height: '280px',
      frame: 'bg-gray-800 rounded-lg p-4'
    },
    {
      id: 'tablet',
      name: 'Tablet',
      icon: 'Tablet',
      width: '300px',
      height: '400px',
      frame: 'bg-gray-800 rounded-2xl p-3'
    },
    {
      id: 'mobile',
      name: 'Mobile',
      icon: 'Smartphone',
      width: '200px',
      height: '360px',
      frame: 'bg-gray-800 rounded-3xl p-2'
    }
  ];

  const CouponDisplay = ({ device }) => (
    <div 
      className={`${device?.frame} shadow-level-3 mx-auto`}
      style={{ width: device?.width, height: device?.height }}
    >
      <div
        className="bg-white rounded-lg h-full overflow-hidden relative"
        ref={previewRef}
      >
        {/* Coupon Header */}
        <div 
          className="px-4 py-3 text-white relative"
          style={{ backgroundColor: couponData?.primaryColor || '#1e40af' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-bold ${device?.id === 'mobile' ? 'text-sm' : 'text-lg'}`}>
                {couponData?.businessName || 'Your Business'}
              </h3>
              <p className={`opacity-90 ${device?.id === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                {couponData?.businessType || 'Restaurant & Cafe'}
              </p>
            </div>
            {device?.id !== 'mobile' && (
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Store" size={24} color="white" />
              </div>
            )}
          </div>
        </div>

        {/* Coupon Content */}
        <div className="p-4 flex-1">
          <div className="text-center mb-4">
            <div className={`font-bold text-primary mb-2 ${device?.id === 'mobile' ? 'text-2xl' : 'text-4xl'}`}>
              {couponData?.discountType === 'percentage' 
                ? `${couponData?.discountValue}% OFF`
                : couponData?.discountType === 'fixed'
                ? `$${couponData?.discountValue} OFF`
                : 'SPECIAL OFFER'
              }
            </div>
            <p className={`text-muted-foreground ${device?.id === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              {couponData?.description || 'Valid on all menu items'}
            </p>
          </div>

          {/* Terms */}
          <div className="border-t border-border pt-3 mt-3">
            <p className={`text-muted-foreground ${device?.id === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              Valid until: {couponData?.expiryDate ? new Date(couponData.expiryDate).toLocaleDateString() : 'N/A'}
            </p>
            <p className={`text-muted-foreground ${device?.id === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              Min. order: {couponData?.minimumOrder ? `$${couponData.minimumOrder}` : 'None'}
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="border-t border-border p-3 bg-muted/30">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
              <Icon name="QrCode" size={16} />
            </div>
            <span className={`text-muted-foreground ${device?.id === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              Scan to redeem
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Device Selector */}
      <div className="flex justify-center space-x-4">
        {devices?.map((device) => (
          <button
            key={device?.id}
            onClick={() => onDeviceChange(device?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedDevice === device?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={device?.icon} size={18} />
            <span className="text-sm font-medium">{device?.name}</span>
          </button>
        ))}
      </div>
      {/* Device Preview */}
      <div className="flex justify-center">
        <CouponDisplay device={devices?.find(d => d?.id === selectedDevice)} />
      </div>
      {/* Preview Info */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Preview shows how your coupon will appear on {devices?.find(d => d?.id === selectedDevice)?.name?.toLowerCase()} devices
        </p>
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
          <span>Dimensions: {devices?.find(d => d?.id === selectedDevice)?.width} × {devices?.find(d => d?.id === selectedDevice)?.height}</span>
          <span aria-hidden="true">·</span>
          <span>Optimized for sharing</span>
        </div>
      </div>
    </div>
  );
};

export default DevicePreview;
