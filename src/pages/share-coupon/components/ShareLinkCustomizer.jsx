import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useToast } from '../../../components/ui/ToastProvider';
import { Dialog, DialogClose, DialogContent } from '../../../components/ui/Dialog';
import IconButton from '../../../components/ui/IconButton';

const ShareLinkCustomizer = ({ baseUrl, onSave, isVisible, onClose }) => {
  const [customSlug, setCustomSlug] = useState('');
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const toast = useToast();

  const generateCustomUrl = () => {
    const url = baseUrl || '';

    const params = new URLSearchParams();
    if (trackingEnabled) {
      if (utmSource) params?.append('utm_source', utmSource);
      if (utmMedium) params?.append('utm_medium', utmMedium);
      if (utmCampaign) params?.append('utm_campaign', utmCampaign);
    }

    return params?.toString() ? `${url}?${params?.toString()}` : url;
  };

  const handleSave = () => {
    const linkData = {
      customSlug,
      trackingEnabled,
      utmParameters: trackingEnabled ? {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign
      } : null,
      passwordProtected,
      password: passwordProtected ? password : null,
      expirationEnabled,
      expirationDate: expirationEnabled ? expirationDate : null,
      finalUrl: generateCustomUrl()
    };

    onSave(linkData);
    onClose();
  };

  const copyToClipboard = () => {
    const url = generateCustomUrl();
    if (!url) {
      toast.error('No link available');
      return;
    }
    navigator.clipboard
      ?.writeText(url)
      ?.then(() => toast.success('Link copied'))
      ?.catch(() => toast.error('Failed to copy link'));
  };

  return (
    <Dialog
      open={!!isVisible}
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Customize Share Link</h2>
            <p className="text-sm text-muted-foreground">Create a branded, trackable link for your coupon</p>
          </div>
          <DialogClose asChild>
            <IconButton ariaLabel="Close dialog" iconName="X" onClick={onClose} />
          </DialogClose>
        </div>

        <div className="p-6 space-y-6">
          {/* Custom URL Slug */}
          <div>
            <Input
              label="Custom URL Slug"
              type="text"
              placeholder="my-special-offer"
              value={customSlug}
              onChange={(e) => setCustomSlug(e?.target?.value?.toLowerCase()?.replace(/[^a-z0-9-]/g, ''))}
              description="Create a memorable, branded URL ending"
            />
          </div>

          {/* URL Preview */}
          <div className="bg-muted rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-2">Preview URL</div>
            <div className="flex items-center justify-between bg-white rounded border p-3">
              <code className="text-sm font-mono text-foreground truncate flex-1 mr-2">
                {generateCustomUrl()}
              </code>
              <IconButton
                ariaLabel="Copy link"
                iconName="Copy"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              />
            </div>
          </div>

          {/* Tracking Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={trackingEnabled}
                onChange={(e) => setTrackingEnabled(e?.target?.checked)}
              />
              <div>
                <div className="font-medium text-foreground">Enable Analytics Tracking</div>
                <div className="text-sm text-muted-foreground">Add UTM parameters for detailed analytics</div>
              </div>
            </div>

            {trackingEnabled && (
              <div className="ml-6 space-y-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="UTM Source"
                    type="text"
                    placeholder="facebook"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e?.target?.value)}
                    description="Traffic source"
                  />
                  <Input
                    label="UTM Medium"
                    type="text"
                    placeholder="social"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e?.target?.value)}
                    description="Marketing medium"
                  />
                  <Input
                    label="UTM Campaign"
                    type="text"
                    placeholder="summer-sale"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e?.target?.value)}
                    description="Campaign name"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={passwordProtected}
                onChange={(e) => setPasswordProtected(e?.target?.checked)}
              />
              <div>
                <div className="font-medium text-foreground">Password Protection</div>
                <div className="text-sm text-muted-foreground">Require a password to access the coupon</div>
              </div>
            </div>

            {passwordProtected && (
              <div className="ml-6">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e?.target?.value)}
                  description="Users will need this password to view the coupon"
                />
              </div>
            )}
          </div>

          {/* Expiration Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={expirationEnabled}
                onChange={(e) => setExpirationEnabled(e?.target?.checked)}
              />
              <div>
                <div className="font-medium text-foreground">Link Expiration</div>
                <div className="text-sm text-muted-foreground">Set when this share link expires</div>
              </div>
            </div>

            {expirationEnabled && (
              <div className="ml-6">
                <Input
                  label="Expiration Date"
                  type="datetime-local"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e?.target?.value)}
                  min={new Date()?.toISOString()?.slice(0, 16)}
                  description="Link will become inactive after this date"
                />
              </div>
            )}
          </div>

          {/* Features Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={16} color="#2563eb" className="mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Link Features</p>
                <ul className="text-blue-700 mt-1 space-y-1 list-disc list-inside">
                  <li>Click tracking and analytics</li>
                  <li>Mobile-optimized landing page</li>
                  <li>Social media preview optimization</li>
                  <li>Automatic redemption validation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Link will be active immediately after creation
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSave}
              iconName="Save"
              iconPosition="left"
            >
              Create Custom Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLinkCustomizer;
