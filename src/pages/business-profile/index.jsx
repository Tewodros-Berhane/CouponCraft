import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import InlineAlert from '../../components/ui/InlineAlert';
import Icon from '../../components/AppIcon';
import api from '../../apiClient';
import { useUploadAsset } from '../../hooks/useUploadAsset';
import { getApiErrorMessage } from '../../utils/apiError';

const businessTypes = [
  { value: 'restaurant', label: 'Restaurant & Food Service' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'beauty', label: 'Beauty & Wellness' },
  { value: 'automotive', label: 'Automotive Services' },
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'professional', label: 'Professional Services' },
  { value: 'entertainment', label: 'Entertainment & Events' },
  { value: 'other', label: 'Other' }
];

const BusinessProfile = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', type: '', logoUrl: '' });
  const [logoPreview, setLogoPreview] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { requestUploadUrl, uploadAsset } = useUploadAsset();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/business');
        setFormData({
          name: data?.data?.name || '',
          phone: data?.data?.phone || '',
          type: data?.data?.type || '',
          logoUrl: data?.data?.logoUrl || '',
        });
        setLogoPreview(data?.data?.logoUrl || '');
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load business profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.patch('/business', {
        name: formData.name,
        phone: formData.phone || null,
        type: formData.type || null,
        logoUrl: formData.logoUrl || null,
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const { uploadUrl, assetUrl } = await requestUploadUrl(file);
      await uploadAsset(uploadUrl, file);
      setFormData((prev) => ({ ...prev, logoUrl: assetUrl }));
      setLogoPreview(assetUrl);
      setSuccess('Logo uploaded. Save changes to apply.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to upload logo'));
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoRemove = () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    setLogoPreview('');
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Business Profile</h1>
          <p className="text-muted-foreground mb-6">Update your business information and contact details.</p>

          <div className="bg-card border border-border rounded-xl shadow-level-1 p-6">
            {error ? <InlineAlert variant="error" className="mb-4">{error}</InlineAlert> : null}
            {success ? <InlineAlert variant="success" className="mb-4">{success}</InlineAlert> : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Business logo" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="Image" size={24} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      label="Business Logo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleLogoChange}
                      disabled={loading || saving || logoUploading}
                      description="PNG, JPG, WEBP, or SVG up to 5MB"
                    />
                    {logoPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleLogoRemove}
                        disabled={loading || saving || logoUploading}
                      >
                        Remove logo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <Input
                label="Business Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                disabled={loading || saving || logoUploading}
              />
              <Input
                label="Phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={loading || saving || logoUploading}
              />
              <Select
                label="Business Type"
                options={businessTypes}
                value={formData.type}
                onChange={(val) => handleChange('type', val)}
                disabled={loading || saving || logoUploading}
              />

              <div className="flex justify-end">
                <Button type="submit" variant="default" loading={saving} disabled={loading || saving || logoUploading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
