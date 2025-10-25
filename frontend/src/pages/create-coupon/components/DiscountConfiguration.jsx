import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const DiscountConfiguration = ({ discountData, onDiscountChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const discountTypes = [
    { value: 'percentage', label: 'Percentage Off', description: 'e.g., 20% off' },
    { value: 'fixed', label: 'Fixed Amount', description: 'e.g., $10 off' },
    { value: 'bogo', label: 'Buy One Get One', description: 'BOGO deals' },
    { value: 'free_shipping', label: 'Free Shipping', description: 'No shipping cost' }
  ];

  const bogoOptions = [
    { value: 'buy_1_get_1_free', label: 'Buy 1 Get 1 Free' },
    { value: 'buy_2_get_1_free', label: 'Buy 2 Get 1 Free' },
    { value: 'buy_1_get_1_50off', label: 'Buy 1 Get 1 50% Off' },
    { value: 'buy_2_get_1_50off', label: 'Buy 2 Get 1 50% Off' }
  ];

  const minimumRequirements = [
    { value: 'none', label: 'No Minimum' },
    { value: 'amount', label: 'Minimum Purchase Amount' },
    { value: 'quantity', label: 'Minimum Item Quantity' }
  ];

  const handleInputChange = (field, value) => {
    onDiscountChange({
      ...discountData,
      [field]: value
    });
  };

  const renderDiscountFields = () => {
    switch (discountData?.type) {
      case 'percentage':
        return (
          <div className="space-y-4">
            <Input
              label="Discount Percentage"
              type="number"
              placeholder="20"
              value={discountData?.percentage || ''}
              onChange={(e) => handleInputChange('percentage', e?.target?.value)}
              description="Enter percentage value (1-100)"
              required
              min="1"
              max="100"
            />
            <Input
              label="Maximum Discount Amount (Optional)"
              type="number"
              placeholder="50"
              value={discountData?.maxDiscount || ''}
              onChange={(e) => handleInputChange('maxDiscount', e?.target?.value)}
              description="Cap the maximum discount amount in dollars"
            />
          </div>
        );

      case 'fixed':
        return (
          <Input
            label="Discount Amount"
            type="number"
            placeholder="10"
            value={discountData?.amount || ''}
            onChange={(e) => handleInputChange('amount', e?.target?.value)}
            description="Enter fixed discount amount in dollars"
            required
            min="0.01"
            step="0.01"
          />
        );

      case 'bogo':
        return (
          <div className="space-y-4">
            <Select
              label="BOGO Type"
              options={bogoOptions}
              value={discountData?.bogoType || ''}
              onChange={(value) => handleInputChange('bogoType', value)}
              placeholder="Select BOGO offer type"
              required
            />
            <Checkbox
              label="Apply to specific products only"
              checked={discountData?.specificProducts || false}
              onChange={(e) => handleInputChange('specificProducts', e?.target?.checked)}
              description="Limit this offer to selected products"
            />
          </div>
        );

      case 'free_shipping':
        return (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Truck" size={20} className="text-success" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Free Shipping Offer</h4>
                <p className="text-sm text-muted-foreground">
                  Customers will receive free shipping on their order
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Discount Configuration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Set up your discount type and value
        </p>
      </div>
      {/* Discount Type Selection */}
      <div className="space-y-4">
        <Select
          label="Discount Type"
          options={discountTypes}
          value={discountData?.type || ''}
          onChange={(value) => handleInputChange('type', value)}
          placeholder="Choose discount type"
          required
        />

        {/* Dynamic Discount Fields */}
        {discountData?.type && (
          <div className="bg-card border border-border rounded-lg p-4">
            {renderDiscountFields()}
          </div>
        )}
      </div>
      {/* Minimum Requirements */}
      <div className="space-y-4">
        <Select
          label="Minimum Requirements"
          options={minimumRequirements}
          value={discountData?.minimumType || 'none'}
          onChange={(value) => handleInputChange('minimumType', value)}
          description="Set minimum purchase requirements for this coupon"
        />

        {discountData?.minimumType === 'amount' && (
          <Input
            label="Minimum Purchase Amount"
            type="number"
            placeholder="25"
            value={discountData?.minimumAmount || ''}
            onChange={(e) => handleInputChange('minimumAmount', e?.target?.value)}
            description="Minimum order value required to use this coupon"
            min="0.01"
            step="0.01"
          />
        )}

        {discountData?.minimumType === 'quantity' && (
          <Input
            label="Minimum Item Quantity"
            type="number"
            placeholder="2"
            value={discountData?.minimumQuantity || ''}
            onChange={(e) => handleInputChange('minimumQuantity', e?.target?.value)}
            description="Minimum number of items required"
            min="1"
          />
        )}
      </div>
      {/* Advanced Options Toggle */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Icon name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} size={16} />
          <span>Advanced Options</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 bg-muted/30 rounded-lg p-4">
            <Checkbox
              label="Stackable with other offers"
              checked={discountData?.stackable || false}
              onChange={(e) => handleInputChange('stackable', e?.target?.checked)}
              description="Allow customers to combine this coupon with other promotions"
            />

            <Checkbox
              label="First-time customers only"
              checked={discountData?.firstTimeOnly || false}
              onChange={(e) => handleInputChange('firstTimeOnly', e?.target?.checked)}
              description="Restrict this offer to new customers"
            />

            <Input
              label="Coupon Code (Optional)"
              type="text"
              placeholder="SAVE20"
              value={discountData?.customCode || ''}
              onChange={(e) => handleInputChange('customCode', e?.target?.value?.toUpperCase())}
              description="Leave empty to auto-generate a unique code"
            />
          </div>
        )}
      </div>
      {/* Discount Summary */}
      {discountData?.type && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Tag" size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">Discount Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {discountData?.type === 'percentage' && discountData?.percentage && (
                  <p>• {discountData?.percentage}% off {discountData?.maxDiscount ? `(max $${discountData?.maxDiscount})` : ''}</p>
                )}
                {discountData?.type === 'fixed' && discountData?.amount && (
                  <p>• ${discountData?.amount} off</p>
                )}
                {discountData?.type === 'bogo' && discountData?.bogoType && (
                  <p>• {bogoOptions?.find(opt => opt?.value === discountData?.bogoType)?.label}</p>
                )}
                {discountData?.type === 'free_shipping' && (
                  <p>• Free shipping on all orders</p>
                )}
                {discountData?.minimumType === 'amount' && discountData?.minimumAmount && (
                  <p>• Minimum purchase: ${discountData?.minimumAmount}</p>
                )}
                {discountData?.minimumType === 'quantity' && discountData?.minimumQuantity && (
                  <p>• Minimum quantity: {discountData?.minimumQuantity} items</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountConfiguration;