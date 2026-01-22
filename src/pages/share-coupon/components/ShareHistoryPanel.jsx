import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatDateTime } from '../../../utils/format';
import { useToast } from '../../../components/ui/ToastProvider';

const ShareHistoryPanel = ({ shareHistory, onViewDetails, onCopyLink }) => {
  const toast = useToast();

  const getChannelIcon = (channel) => {
    const icons = {
      qr: 'QrCode',
      link: 'Link',
    };
    return icons?.[channel] || 'Share';
  };

  const getChannelColor = (channel) => {
    const colors = {
      qr: '#475569',
      link: '#059669',
    };
    return colors?.[channel] || '#6b7280';
  };

  const formatDate = (date) => formatDateTime(date, '—');

  const calculateConversionRate = (clicks, redemptions) => {
    const safeClicks = Number(clicks) || 0;
    const safeRedemptions = Number(redemptions) || 0;
    if (safeClicks === 0) return 0;
    return ((safeRedemptions / safeClicks) * 100)?.toFixed(1);
  };

  const exportCsv = () => {
    const rows = Array.isArray(shareHistory) ? shareHistory : [];
    if (rows.length === 0) {
      toast.info('No share history to export');
      return;
    }

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      const needsQuotes = /[",\n\r]/.test(str);
      const escaped = str.replace(/"/g, '""');
      return needsQuotes ? `"${escaped}"` : escaped;
    };

    const header = ['id', 'type', 'sharedAt', 'clicks', 'redemptions', 'conversionRate', 'shareUrl'];
    const lines = [
      header.join(','),
      ...rows.map((item) => {
        const clicks = Number(item?.clicks) || 0;
        const redemptions = Number(item?.redemptions) || 0;
        const conversionRate = clicks ? ((redemptions / clicks) * 100).toFixed(1) : '0.0';

        return [
          escapeCsv(item?.id),
          escapeCsv(item?.type || item?.channel),
          escapeCsv(item?.sharedAt),
          escapeCsv(clicks),
          escapeCsv(redemptions),
          escapeCsv(conversionRate),
          escapeCsv(item?.shareUrl),
        ].join(',');
      }),
    ];

    try {
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `share-history-${new Date().toISOString().slice(0, 10)}.csv`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Export started');
    } catch {
      toast.error('Failed to export share history');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-level-1 overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Share History</h2>
            <p className="text-sm text-muted-foreground">Track performance by share type</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={exportCsv}
            disabled={!shareHistory?.length}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {shareHistory?.reduce((sum, item) => sum + (Number(item?.clicks) || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Clicks</div>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {shareHistory?.reduce((sum, item) => sum + (Number(item?.redemptions) || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Redemptions</div>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{shareHistory?.length}</div>
            <div className="text-sm text-muted-foreground">Shares</div>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {calculateConversionRate(
                shareHistory?.reduce((sum, item) => sum + (Number(item?.clicks) || 0), 0),
                shareHistory?.reduce((sum, item) => sum + (Number(item?.redemptions) || 0), 0)
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">Conversion</div>
          </div>
        </div>

        <div className="space-y-3">
          {shareHistory?.map((item) => (
            <div
              key={item?.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-150"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Icon
                    name={getChannelIcon(item?.type || item?.channel)}
                    size={20}
                    color={getChannelColor(item?.type || item?.channel)}
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-foreground capitalize truncate">{item?.type || item?.channel}</div>
                  <div className="text-sm text-muted-foreground truncate">{formatDate(item?.sharedAt)}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="text-center min-w-[4.5rem]">
                    <div className="text-sm font-medium text-foreground">{Number(item?.clicks) || 0}</div>
                    <div className="text-xs text-muted-foreground">clicks</div>
                  </div>
                  <div className="text-center min-w-[4.5rem]">
                    <div className="text-sm font-medium text-foreground">{Number(item?.redemptions) || 0}</div>
                    <div className="text-xs text-muted-foreground">redeemed</div>
                  </div>
                  <div className="text-center min-w-[4.5rem]">
                    <div className="text-sm font-medium text-foreground">
                      {calculateConversionRate(item?.clicks, item?.redemptions)}%
                    </div>
                    <div className="text-xs text-muted-foreground">conversion</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  {item?.shareUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopyLink?.(item.shareUrl)}
                      iconName="Copy"
                      iconPosition="left"
                    >
                      Copy link
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.(item)}
                    iconName="BarChart3"
                    iconPosition="left"
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shareHistory?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Share" size={48} color="#9ca3af" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No shares yet</h3>
            <p className="text-muted-foreground">Start sharing your coupon to see analytics here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareHistoryPanel;
