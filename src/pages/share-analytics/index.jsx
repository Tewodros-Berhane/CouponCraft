import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import InlineAlert from '../../components/ui/InlineAlert';
import Icon from '../../components/AppIcon';
import api from '../../apiClient';
import { useToast } from '../../components/ui/ToastProvider';
import { getApiErrorMessage } from '../../utils/apiError';
import { formatDateTime, formatNumber } from '../../utils/format';
import { copyTextToClipboard } from '../../utils/clipboard';

const ShareAnalytics = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shareMeta = location?.state?.share || null;
  const couponMeta = location?.state?.coupon || null;

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/analytics/shares/${shareId}`);
        setAnalytics(data?.data || null);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load share analytics'));
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    if (!shareId) {
      setError('Share ID is missing');
      setLoading(false);
      return;
    }

    loadAnalytics();
  }, [shareId]);

  const shareLabel = useMemo(() => {
    const type = shareMeta?.type || shareMeta?.channel;
    if (type === 'qr') return 'QR Code';
    if (type === 'link') return 'Share Link';
    return 'Share';
  }, [shareMeta]);

  const shareUrl = shareMeta?.shareUrl || shareMeta?.config?.shareUrl || '';
  const shareTitle = couponMeta?.title || couponMeta?.name || 'Coupon';

  const clicks = analytics?.clicks ?? 0;
  const redemptions = analytics?.redemptions ?? 0;
  const conversionRate = analytics?.conversionRate ?? 0;
  const conversionPct = (conversionRate * 100).toFixed(1);
  const lastActivity = formatDateTime(analytics?.lastActivityAt, 'No activity yet');

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await copyTextToClipboard(shareUrl);
      toast.success('Share link copied');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Share Analytics</h1>
              <p className="text-muted-foreground">
                Performance details for {shareLabel.toLowerCase()} on {shareTitle}.
              </p>
            </div>
            <Button
              variant="ghost"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>

          {error ? (
            <InlineAlert variant="error" className="mb-6">
              {error}
            </InlineAlert>
          ) : null}

          {loading ? (
            <div className="bg-card rounded-lg shadow-level-1 p-6 text-sm text-muted-foreground">
              Loading analytics...
            </div>
          ) : error ? null : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card rounded-lg shadow-level-1 p-6">
                  <div className="text-sm text-muted-foreground">Clicks</div>
                  <div className="text-2xl font-bold text-foreground">{formatNumber(clicks, '0')}</div>
                </div>
                <div className="bg-card rounded-lg shadow-level-1 p-6">
                  <div className="text-sm text-muted-foreground">Redemptions</div>
                  <div className="text-2xl font-bold text-foreground">{formatNumber(redemptions, '0')}</div>
                </div>
                <div className="bg-card rounded-lg shadow-level-1 p-6">
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  <div className="text-2xl font-bold text-foreground">{conversionPct}%</div>
                </div>
                <div className="bg-card rounded-lg shadow-level-1 p-6">
                  <div className="text-sm text-muted-foreground">Last Activity</div>
                  <div className="text-base font-semibold text-foreground">{lastActivity}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-card rounded-lg shadow-level-1 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={shareLabel === 'QR Code' ? 'QrCode' : 'Link'} size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Share Type</div>
                      <div className="text-base font-semibold text-foreground">{shareLabel}</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="text-sm text-muted-foreground mb-2">Share ID</div>
                    <div className="text-sm font-medium text-foreground break-all">{shareId}</div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <div className="text-sm text-muted-foreground">Share Link</div>
                    {shareUrl ? (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm font-medium text-foreground break-all">{shareUrl}</div>
                        <Button variant="outline" size="sm" onClick={handleCopy} iconName="Copy" iconPosition="left">
                          Copy link
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No link available for this share.</div>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-level-1 p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Next Steps</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                      <span>Use the share link in emails or social posts to improve click-through.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                      <span>Pair QR codes with printed materials for in-store visibility.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                      <span>Monitor conversion rates weekly to spot high-performing campaigns.</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShareAnalytics;
