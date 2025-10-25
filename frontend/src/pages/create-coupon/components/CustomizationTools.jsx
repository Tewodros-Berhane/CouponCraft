import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CustomizationTools = ({ customizationData, onCustomizationChange }) => {
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const fileInputRef = useRef(null);

  const predefinedColors = [
    '#1e40af', '#dc2626', '#059669', '#7c3aed', '#ea580c',
    '#0f766e', '#be185d', '#374151', '#1f2937', '#0369a1'
  ];

  const fontOptions = [
    { value: 'inter', label: 'Inter (Modern)', preview: 'font-sans' },
    { value: 'serif', label: 'Times (Classic)', preview: 'font-serif' },
    { value: 'mono', label: 'Mono (Tech)', preview: 'font-mono' },
    { value: 'display', label: 'Display (Bold)', preview: 'font-bold' }
  ];

  const handleInputChange = (field, value) => {
    onCustomizationChange({
      ...customizationData,
      [field]: value
    });
  };

  const handleColorChange = (colorType, color) => {
    handleInputChange('colors', {
      ...customizationData?.colors,
      [colorType]: color
    });
    setActiveColorPicker(null);
  };

  const handleLogoUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('logo', {
          file: file,
          url: e?.target?.result,
          name: file?.name
        });
      };
      reader?.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    handleInputChange('logo', null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const ColorPicker = ({ colorType, currentColor, label }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveColorPicker(activeColorPicker === colorType ? null : colorType)}
          className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors relative overflow-hidden"
          style={{ backgroundColor: currentColor }}
        >
          {!currentColor && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="Palette" size={16} className="text-muted-foreground" />
            </div>
          )}
        </button>
        <Input
          type="text"
          value={currentColor || ''}
          onChange={(e) => handleColorChange(colorType, e?.target?.value)}
          placeholder="#1e40af"
          className="flex-1"
        />
      </div>
      
      {activeColorPicker === colorType && (
        <div className="bg-card border border-border rounded-lg p-3 shadow-level-2">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {predefinedColors?.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(colorType, color)}
                className="w-8 h-8 rounded-md border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <Input
            type="color"
            value={currentColor || '#1e40af'}
            onChange={(e) => handleColorChange(colorType, e?.target?.value)}
            className="w-full h-10"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Customization</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Personalize your coupon with your brand colors and logo
        </p>
      </div>
      {/* Logo Upload */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Business Logo</h4>
        
        {customizationData?.logo ? (
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={customizationData?.logo?.url}
                  alt="Business logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{customizationData?.logo?.name}</p>
                <p className="text-sm text-muted-foreground">Logo uploaded successfully</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeLogo}
                iconName="Trash2"
                iconPosition="left"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Upload" size={24} className="text-muted-foreground" />
            </div>
            <h4 className="font-medium text-foreground mb-1">Upload your logo</h4>
            <p className="text-sm text-muted-foreground mb-4">
              PNG, JPG or SVG up to 5MB. Recommended size: 200x200px
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              iconName="Upload"
              iconPosition="left"
            >
              Choose File
            </Button>
          </div>
        )}
      </div>
      {/* Color Customization */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Color Scheme</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            colorType="primary"
            currentColor={customizationData?.colors?.primary}
            label="Primary Color"
          />
          <ColorPicker
            colorType="secondary"
            currentColor={customizationData?.colors?.secondary}
            label="Secondary Color"
          />
          <ColorPicker
            colorType="accent"
            currentColor={customizationData?.colors?.accent}
            label="Accent Color"
          />
          <ColorPicker
            colorType="text"
            currentColor={customizationData?.colors?.text}
            label="Text Color"
          />
        </div>
      </div>
      {/* Typography */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Typography</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fontOptions?.map((font) => (
            <button
              key={font?.value}
              onClick={() => handleInputChange('font', font?.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all hover-scale ${
                customizationData?.font === font?.value
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className={`text-lg font-medium mb-1 ${font?.preview}`}>
                {font?.label}
              </div>
              <div className={`text-sm text-muted-foreground ${font?.preview}`}>
                Sample text preview
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Text Content */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Coupon Text</h4>
        
        <div className="space-y-4">
          <Input
            label="Business Name"
            type="text"
            placeholder="Your Business Name"
            value={customizationData?.businessName || ''}
            onChange={(e) => handleInputChange('businessName', e?.target?.value)}
            description="This will appear prominently on your coupon"
            required
          />
          
          <Input
            label="Coupon Title"
            type="text"
            placeholder="Special Offer"
            value={customizationData?.title || ''}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            description="Main headline for your coupon"
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              placeholder="Describe your offer in detail..."
              value={customizationData?.description || ''}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Keep it concise and compelling (recommended: 50-100 characters)
            </p>
          </div>
          
          <Input
            label="Terms & Conditions (Optional)"
            type="text"
            placeholder="Valid at participating locations only"
            value={customizationData?.terms || ''}
            onChange={(e) => handleInputChange('terms', e?.target?.value)}
            description="Brief terms that will appear in small text"
          />
        </div>
      </div>
      {/* Advanced Options */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Display Options</h4>
        
        <div className="space-y-3">
          <Checkbox
            label="Show business logo on coupon"
            checked={customizationData?.showLogo !== false}
            onChange={(e) => handleInputChange('showLogo', e?.target?.checked)}
            description="Display your uploaded logo on the coupon design"
          />
          
          <Checkbox
            label="Include QR code"
            checked={customizationData?.includeQR !== false}
            onChange={(e) => handleInputChange('includeQR', e?.target?.checked)}
            description="Add a QR code for easy mobile redemption"
          />
          
          <Checkbox
            label="Add decorative border"
            checked={customizationData?.decorativeBorder || false}
            onChange={(e) => handleInputChange('decorativeBorder', e?.target?.checked)}
            description="Include an elegant border around the coupon"
          />
          
          <Checkbox
            label="Use gradient background"
            checked={customizationData?.gradientBackground || false}
            onChange={(e) => handleInputChange('gradientBackground', e?.target?.checked)}
            description="Apply a subtle gradient effect to the background"
          />
        </div>
      </div>
      {/* Preview Colors */}
      {customizationData?.colors && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Color Preview</h4>
          <div className="flex items-center space-x-2">
            {Object.entries(customizationData?.colors)?.map(([key, color]) => (
              color && (
                <div key={key} className="text-center">
                  <div
                    className="w-8 h-8 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground capitalize mt-1 block">
                    {key}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationTools;