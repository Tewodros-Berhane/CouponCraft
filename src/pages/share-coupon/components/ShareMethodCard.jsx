import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShareMethodCard = ({
  method,
  onShare,
  isGenerating = false,
  className = ""
}) => {
  const icons = {
    qr: 'QrCode',
    link: 'Link'
  };

  const colors = {
    qr: 'bg-slate-50 border-slate-200',
    link: 'bg-emerald-50 border-emerald-200'
  };

  const iconStyles = {
    qr: { bg: 'bg-slate-100', color: '#475569' },
    link: { bg: 'bg-emerald-100', color: '#059669' }
  };

  const isQr = method?.type === 'qr';
  const iconStyle = iconStyles?.[method?.type] || { bg: 'bg-gray-100', color: '#6b7280' };

  return (
    <div className={`${colors?.[method?.type] || 'bg-gray-50 border-gray-200'} border rounded-xl p-6 hover:shadow-level-2 transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconStyle.bg}`}>
            <Icon name={icons?.[method?.type] || 'Share'} size={24} color={iconStyle.color} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{method?.title}</h3>
            <p className="text-sm text-muted-foreground">{method?.description}</p>
          </div>
        </div>
        {method?.engagement && (
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{method?.engagement?.clicks}</div>
            <div className="text-xs text-muted-foreground">clicks</div>
          </div>
        )}
      </div>
      {method?.preview && (
        <div className="mb-4 p-3 bg-white rounded-lg border">
          <div className="text-xs text-muted-foreground mb-2">Preview</div>
          <div className="text-sm text-foreground">{method?.preview}</div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {method?.features?.map((feature, index) => (
            <span key={index} className="text-xs bg-white px-2 py-1 rounded-full text-muted-foreground">
              {feature}
            </span>
          ))}
        </div>
        <Button
          variant={isQr ? 'default' : 'outline'}
          size="sm"
          onClick={() => onShare(method)}
          loading={isGenerating && isQr}
          iconName={isQr ? 'Download' : 'Copy'}
          iconPosition="left"
        >
          {isQr ? 'Generate QR' : 'Copy link'}
        </Button>
      </div>
    </div>
  );
};

export default ShareMethodCard;
