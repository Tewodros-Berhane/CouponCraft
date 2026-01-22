import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricsCard from './components/MetricsCard';
import CouponActivityTable from './components/CouponActivityTable';
import TopPerformingCoupons from './components/TopPerformingCoupons';
import RedemptionChart from './components/RedemptionChart';
import QuickActions from './components/QuickActions';
import api from '../../apiClient';
import { useAuth } from '../../AuthContext';
import { useToast } from '../../components/ui/ToastProvider';
import { getApiErrorMessage } from '../../utils/apiError';

const BusinessDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [analyticsByCoupon, setAnalyticsByCoupon] = useState({});
  const [analyticsRange, setAnalyticsRange] = useState('30d');
  const [dashboardTotals, setDashboardTotals] = useState({ clicks: 0, redemptions: 0, conversionRate: 0 });
  const { user } = useAuth();
  const toast = useToast();

  const formatDiscount = (discount = {}) => {
    switch (discount.type) {
      case 'percentage':
        return discount.percentage ? `${discount.percentage}% OFF` : 'Percentage';
      case 'fixed':
        return discount.amount ? `$${discount.amount} OFF` : 'Fixed';
      case 'bogo':
        return discount.bogoType || 'BOGO';
      case 'free_shipping':
        return 'Free Shipping';
      default:
        return 'Special Offer';
    }
  };

  const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  const getRangeDays = (range) => daysMap?.[range] || 30;

  const buildCountsFallback = (list = []) => ({
    active: list.filter((c) => c.status === 'active').length,
    expired: 0,
    draft: list.filter((c) => c.status === 'draft').length,
    total: list.length,
  });

  const buildMetrics = (counts = {}) => {
    const active = Number(counts?.active) || 0;
    const expired = Number(counts?.expired) || 0;
    const draft = Number(counts?.draft) || 0;
    const total = Number(counts?.total) || 0;
    const toTrend = (value) => Math.min(100, Math.max(0, Math.round(value)));

    return [
      {
        title: "Active Coupons",
        value: active.toString(),
        change: `${active} active`,
        changeType: active > 0 ? "positive" : "neutral",
        icon: "Ticket",
        trend: toTrend(active * 10),
      },
      {
        title: "Expired Coupons",
        value: expired.toString(),
        change: `${expired} expired`,
        changeType: expired > 0 ? "negative" : "neutral",
        icon: "Clock",
        trend: toTrend(expired * 10),
      },
      {
        title: "Drafts",
        value: draft.toString(),
        change: `${draft} in progress`,
        changeType: "neutral",
        icon: "ClipboardList",
        trend: toTrend(draft * 10),
      },
      {
        title: "Total Coupons",
        value: total.toString(),
        change: "All time",
        changeType: "neutral",
        icon: "Layers",
        trend: toTrend(total * 10),
      },
    ];
  };

  useEffect(() => {
    const loadCoupons = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/coupons');
        const list = data?.data || [];
        setCoupons(list);
        const fallbackCounts = buildCountsFallback(list);
        setMetricsData(buildMetrics(fallbackCounts));
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load dashboard data"));
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, []);

  useEffect(() => {
    const days = getRangeDays(analyticsRange);

    const loadAnalytics = async () => {
      setIsAnalyticsLoading(true);
      try {
        const dashboard = await api.get(`/analytics/dashboard?days=${days}`);
        const totalsByCoupon = dashboard?.data?.data?.totalsByCoupon || {};
        const totals = dashboard?.data?.data?.totals || { clicks: 0, redemptions: 0, total: 0, conversionRate: 0 };
        const series = dashboard?.data?.data?.series || [];
        const counts = dashboard?.data?.data?.counts || buildCountsFallback(coupons);

        const analyticsMap = {};
        coupons.forEach((c) => {
          const t = totalsByCoupon?.[c.id] || { views: 0, clicks: 0, redemptions: 0, total: 0, conversionRate: 0 };
          analyticsMap[c.id] = { totals: t };
        });
        setAnalyticsByCoupon(analyticsMap);

        setChartData(
          series.map((s) => ({
            date: s.label || s.date,
            clicks: s.clicks || 0,
            redemptions: s.redemptions || 0,
          }))
        );

        setDashboardTotals({
          clicks: totals.clicks || 0,
          redemptions: totals.redemptions || 0,
          conversionRate: totals.conversionRate || 0,
        });
        setMetricsData(buildMetrics(counts));
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Some analytics could not be loaded"));
        setAnalyticsByCoupon({});
        setChartData([]);
        setDashboardTotals({ clicks: 0, redemptions: 0, conversionRate: 0 });
        setMetricsData(buildMetrics(buildCountsFallback(coupons)));
      } finally {
        setIsAnalyticsLoading(false);
      }
    };

    // Wait until coupons are loaded to build per-coupon totals mapping.
    if (isLoading) return;
    loadAnalytics();
  }, [analyticsRange, coupons, isLoading]);

  const couponActivityData = coupons.map((c) => {
    const totals = analyticsByCoupon?.[c.id]?.totals || {};
    return {
      id: c.id,
      name: c.customization?.title || 'Untitled coupon',
      discount: formatDiscount(c.discount),
      redemptions: totals.redemptions || "0",
      limit: c.validity?.totalLimit || c.validity?.usageLimit || 'unlimited',
      expiration: c.validity?.endDate || 'N/A',
      status: c.status,
    };
  });

  const topPerformingData = couponActivityData
    .map((c) => {
      const conversionRate = analyticsByCoupon?.[c.id]?.totals?.conversionRate || 0;
      return {
        id: c.id,
        name: c.name,
        performance: Math.min(100, Math.round(conversionRate * 100)),
        redemptions: `${c.redemptions} uses`,
        revenue: '—',
      };
    })
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4]?.map((i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-96 bg-muted rounded-lg"></div>
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user?.ownerName || user?.email || 'there'}!
                </h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your coupons today.
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
                Last updated: {new Date()?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard key={index} {...metric} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
             {/* Left Column - Charts and Tables */}
             <div className="lg:col-span-2 space-y-8">
              <RedemptionChart
                data={chartData}
                timeRange={analyticsRange}
                onTimeRangeChange={setAnalyticsRange}
                loading={isAnalyticsLoading}
                summary={dashboardTotals}
              />
              <CouponActivityTable coupons={couponActivityData} />
            </div>

            {/* Right Column - Quick Actions and Performance */}
            <div className="space-y-8">
              <QuickActions />
              <TopPerformingCoupons coupons={topPerformingData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
