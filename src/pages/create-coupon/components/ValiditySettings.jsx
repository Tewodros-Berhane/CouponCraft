import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ValiditySettings = ({ validityData, onValidityChange }) => {
  const [showTimeSettings, setShowTimeSettings] = useState(false);

  const validityTypes = [
    { value: 'date_range', label: 'Date Range', description: 'Set start and end dates' },
    { value: 'duration', label: 'Duration from Issue', description: 'Valid for X days after creation' },
    { value: 'no_expiry', label: 'No Expiration', description: 'Coupon never expires' }
  ];

  const usageLimitTypes = [
    { value: 'unlimited', label: 'Unlimited Uses' },
    { value: 'total_limit', label: 'Total Usage Limit' },
    { value: 'per_customer', label: 'Per Customer Limit' },
    { value: 'both', label: 'Both Total & Per Customer' }
  ];

  const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'UTC', label: 'UTC (Universal Time)' }
  ];

  const handleInputChange = (field, value) => {
    onValidityChange({
      ...validityData,
      [field]: value
    });
  };

  const formatDate = (date) => {
    return new Date(date)?.toISOString()?.split('T')?.[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    return formatDate(tomorrow);
  };

  const getNextWeekDate = () => {
    const nextWeek = new Date();
    nextWeek?.setDate(nextWeek?.getDate() + 7);
    return formatDate(nextWeek);
  };

  const renderValidityFields = () => {
    switch (validityData?.type) {
      case 'date_range':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={validityData?.startDate || formatDate(new Date())}
                onChange={(e) => handleInputChange('startDate', e?.target?.value)}
                min={formatDate(new Date())}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={validityData?.endDate || getNextWeekDate()}
                onChange={(e) => handleInputChange('endDate', e?.target?.value)}
                min={validityData?.startDate || getTomorrowDate()}
                required
              />
            </div>
            <button
              onClick={() => setShowTimeSettings(!showTimeSettings)}
              className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Icon name={showTimeSettings ? 'ChevronUp' : 'ChevronDown'} size={16} />
              <span>Time Settings</span>
            </button>
            {showTimeSettings && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Time (Optional)"
                    type="time"
                    value={validityData?.startTime || ''}
                    onChange={(e) => handleInputChange('startTime', e?.target?.value)}
                    description="Leave empty for midnight"
                  />
                  <Input
                    label="End Time (Optional)"
                    type="time"
                    value={validityData?.endTime || ''}
                    onChange={(e) => handleInputChange('endTime', e?.target?.value)}
                    description="Leave empty for 11:59 PM"
                  />
                </div>
                
                <Select
                  label="Time Zone"
                  options={timeZones}
                  value={validityData?.timeZone || 'America/New_York'}
                  onChange={(value) => handleInputChange('timeZone', value)}
                />
              </div>
            )}
          </div>
        );

      case 'duration':
        return (
          <div className="space-y-4">
            <Input
              label="Valid for (days)"
              type="number"
              placeholder="30"
              value={validityData?.durationDays || ''}
              onChange={(e) => handleInputChange('durationDays', e?.target?.value)}
              description="Number of days the coupon remains valid after creation"
              required
              min="1"
              max="365"
            />
            <div className="bg-info/10 border border-info/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-info mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Duration-based Validity</p>
                  <p className="text-muted-foreground">
                    Each customer will have {validityData?.durationDays || 'X'} days to use the coupon from when they receive it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'no_expiry':
        return (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Infinity" size={16} className="text-warning" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">No Expiration Date</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  This coupon will remain valid indefinitely. You can always change this later.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderUsageLimitFields = () => {
    switch (validityData?.usageLimit) {
      case 'total_limit':
        return (
          <Input
            label="Total Usage Limit"
            type="number"
            placeholder="100"
            value={validityData?.totalLimit || ''}
            onChange={(e) => handleInputChange('totalLimit', e?.target?.value)}
            description="Maximum number of times this coupon can be used across all customers"
            required
            min="1"
          />
        );

      case 'per_customer':
        return (
          <Input
            label="Uses Per Customer"
            type="number"
            placeholder="1"
            value={validityData?.perCustomerLimit || ''}
            onChange={(e) => handleInputChange('perCustomerLimit', e?.target?.value)}
            description="Maximum number of times each customer can use this coupon"
            required
            min="1"
          />
        );

      case 'both':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Total Usage Limit"
              type="number"
              placeholder="100"
              value={validityData?.totalLimit || ''}
              onChange={(e) => handleInputChange('totalLimit', e?.target?.value)}
              description="Total uses across all customers"
              required
              min="1"
            />
            <Input
              label="Uses Per Customer"
              type="number"
              placeholder="1"
              value={validityData?.perCustomerLimit || ''}
              onChange={(e) => handleInputChange('perCustomerLimit', e?.target?.value)}
              description="Uses per individual customer"
              required
              min="1"
            />
          </div>
        );

      case 'unlimited':
      default:
        return (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Infinity" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">Unlimited Usage</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Validity & Usage Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure when and how often your coupon can be used
        </p>
      </div>
      {/* Validity Type */}
      <div className="space-y-4">
        <Select
          label="Validity Type"
          options={validityTypes}
          value={validityData?.type || 'date_range'}
          onChange={(value) => handleInputChange('type', value)}
          required
        />

        {validityData?.type && (
          <div className="bg-card border border-border rounded-lg p-4">
            {renderValidityFields()}
          </div>
        )}
      </div>
      {/* Usage Limits */}
      <div className="space-y-4">
        <Select
          label="Usage Limits"
          options={usageLimitTypes}
          value={validityData?.usageLimit || 'unlimited'}
          onChange={(value) => handleInputChange('usageLimit', value)}
          description="Control how many times this coupon can be used"
        />

        <div className="bg-card border border-border rounded-lg p-4">
          {renderUsageLimitFields()}
        </div>
      </div>
      {/* Additional Settings */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Additional Settings</h4>
        
        <div className="space-y-3">
          <Checkbox
            label="Auto-deactivate when limit reached"
            checked={validityData?.autoDeactivate || true}
            onChange={(e) => handleInputChange('autoDeactivate', e?.target?.checked)}
            description="Automatically disable coupon when usage limit is reached"
          />

          <Checkbox
            label="Send expiration reminders"
            checked={validityData?.expirationReminders || false}
            onChange={(e) => handleInputChange('expirationReminders', e?.target?.checked)}
            description="Email customers before coupon expires (requires customer email)"
          />

          <Checkbox
            label="Allow partial redemption"
            checked={validityData?.partialRedemption || false}
            onChange={(e) => handleInputChange('partialRedemption', e?.target?.checked)}
            description="Allow customers to use coupon for orders less than discount value"
          />
        </div>
      </div>
      {/* Validity Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">Validity Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {validityData?.type === 'date_range' && validityData?.startDate && validityData?.endDate && (
                <p>• Valid from {new Date(validityData.startDate)?.toLocaleDateString()} to {new Date(validityData.endDate)?.toLocaleDateString()}</p>
              )}
              {validityData?.type === 'duration' && validityData?.durationDays && (
                <p>• Valid for {validityData?.durationDays} days from issue date</p>
              )}
              {validityData?.type === 'no_expiry' && (
                <p>• No expiration date</p>
              )}
              {validityData?.usageLimit === 'total_limit' && validityData?.totalLimit && (
                <p>• Maximum {validityData?.totalLimit} total uses</p>
              )}
              {validityData?.usageLimit === 'per_customer' && validityData?.perCustomerLimit && (
                <p>• {validityData?.perCustomerLimit} use(s) per customer</p>
              )}
              {validityData?.usageLimit === 'both' && validityData?.totalLimit && validityData?.perCustomerLimit && (
                <p>• Maximum {validityData?.totalLimit} total uses, {validityData?.perCustomerLimit} per customer</p>
              )}
              {validityData?.usageLimit === 'unlimited' && (
                <p>• Unlimited usage</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValiditySettings;