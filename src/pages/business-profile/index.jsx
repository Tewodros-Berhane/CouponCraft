import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import api from '../../apiClient';

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
  const [formData, setFormData] = useState({ name: '', phone: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/business');
        setFormData({
          name: data?.data?.name || '',
          phone: data?.data?.phone || '',
          type: data?.data?.type || '',
        });
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
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Business Profile</h1>
          <p className="text-muted-foreground mb-6">Update your business information and contact details.</p>

          <div className="bg-card border border-border rounded-xl shadow-level-1 p-6">
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Business Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                disabled={loading || saving}
              />
              <Input
                label="Phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={loading || saving}
              />
              <Select
                label="Business Type"
                options={businessTypes}
                value={formData.type}
                onChange={(val) => handleChange('type', val)}
                disabled={loading || saving}
              />

              <div className="flex justify-end">
                <Button type="submit" variant="default" loading={saving} disabled={loading || saving}>
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
