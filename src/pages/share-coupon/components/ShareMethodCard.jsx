import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShareMethodCard = ({ 
  method, 
  onShare, 
  isGenerating = false, 
  className = "" 
}) => {
  const getMethodIcon = (methodType) => {
    const icons = {
      qr: 'QrCode',
      email: 'Mail',
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      link: 'Link',
      whatsapp: 'MessageCircle',
      linkedin: 'Linkedin'
    };
    return icons?.[methodType] || 'Share';
  };

  const getMethodColor = (methodType) => {
    const colors = {
      qr: 'bg-slate-50 border-slate-200',
      email: 'bg-blue-50 border-blue-200',
      facebook: 'bg-blue-50 border-blue-200',
      instagram: 'bg-pink-50 border-pink-200',
      twitter: 'bg-sky-50 border-sky-200',
      link: 'bg-green-50 border-green-200',
      whatsapp: 'bg-green-50 border-green-200',
      linkedin: 'bg-blue-50 border-blue-200'
    };
    return colors?.[methodType] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className={`${getMethodColor(method?.type)} border rounded-xl p-6 hover:shadow-level-2 transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            method?.type === 'qr' ? 'bg-slate-100' :
            method?.type === 'email' ? 'bg-blue-100' :
            method?.type === 'facebook' ? 'bg-blue-100' :
            method?.type === 'instagram' ? 'bg-pink-100' :
            method?.type === 'twitter' ? 'bg-sky-100' :
            method?.type === 'whatsapp' ? 'bg-green-100' :
            method?.type === 'linkedin'? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <Icon 
              name={getMethodIcon(method?.type)} 
              size={24} 
              color={
                method?.type === 'qr' ? '#475569' :
                method?.type === 'email' ? '#2563eb' :
                method?.type === 'facebook' ? '#1877f2' :
                method?.type === 'instagram' ? '#e4405f' :
                method?.type === 'twitter' ? '#1da1f2' :
                method?.type === 'whatsapp' ? '#25d366' :
                method?.type === 'linkedin'? '#0077b5' : '#059669'
              }
            />
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
          variant={method?.type === 'qr' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onShare(method)}
          loading={isGenerating && method?.type === 'qr'}
          iconName={method?.type === 'qr' ? 'Download' : 'Share'}
          iconPosition="left"
        >
          {method?.type === 'qr' ? 'Generate QR' : 'Share'}
        </Button>
      </div>
    </div>
  );
};

export default ShareMethodCard;