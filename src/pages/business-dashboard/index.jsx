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
  const [coupons, setCoupons] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [analyticsByCoupon, setAnalyticsByCoupon] = useState({});
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

  useEffect(() => {
    const loadCoupons = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/coupons');
        const list = data?.data || [];
        setCoupons(list);
        const activeCount = list.filter((c) => c.status === 'active').length;
        const draftCount = list.filter((c) => c.status === 'draft').length;

        try {
          const dashboard = await api.get('/analytics/dashboard?days=30');
          const totalsByCoupon = dashboard?.data?.data?.totalsByCoupon || {};
          const totals = dashboard?.data?.data?.totals || { views: 0, clicks: 0, redemptions: 0, total: 0 };
          const series = dashboard?.data?.data?.series || [];

          const analyticsMap = {};
          list.forEach((c) => {
            const t = totalsByCoupon?.[c.id] || { views: 0, clicks: 0, redemptions: 0, total: 0 };
            analyticsMap[c.id] = { totals: t };
          });
          setAnalyticsByCoupon(analyticsMap);

          setChartData(
            series.map((s) => ({
              date: s.label || s.date,
              views: s.views || 0,
              redemptions: s.redemptions || 0,
            }))
          );

          setMetricsData([
          {
            title: "Active Coupons",
            value: activeCount.toString(),
            change: `${activeCount} total`,
            changeType: "positive",
            icon: "Ticket",
            trend: activeCount * 10,
          },
          {
            title: "Drafts",
            value: draftCount.toString(),
            change: `${draftCount} awaiting publish`,
            changeType: "neutral",
            icon: "ClipboardList",
            trend: draftCount * 10,
          },
          {
            title: "Total Coupons",
            value: list.length.toString(),
            change: "All time",
            changeType: "neutral",
            icon: "Layers",
            trend: list.length * 10,
          },
          {
            title: "Redemptions",
            value: (totals.redemptions || 0).toString(),
            change: `${totals.redemptions || 0} total`,
            changeType: (totals.redemptions || 0) > 0 ? "positive" : "neutral",
            icon: "TrendingUp",
            trend: totals.redemptions || 0,
          },
        ]);
        } catch (err) {
          toast.error(getApiErrorMessage(err, "Some analytics could not be loaded"));
          setAnalyticsByCoupon({});
          setChartData([]);
          setMetricsData([
            {
              title: "Active Coupons",
              value: activeCount.toString(),
              change: `${activeCount} total`,
              changeType: "positive",
              icon: "Ticket",
              trend: activeCount * 10,
            },
            {
              title: "Drafts",
              value: draftCount.toString(),
              change: `${draftCount} awaiting publish`,
              changeType: "neutral",
              icon: "ClipboardList",
              trend: draftCount * 10,
            },
            {
              title: "Total Coupons",
              value: list.length.toString(),
              change: "All time",
              changeType: "neutral",
              icon: "Layers",
              trend: list.length * 10,
            },
            {
              title: "Redemptions",
              value: "0",
              change: "0 total",
              changeType: "neutral",
              icon: "TrendingUp",
              trend: 0,
            },
          ]);
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load dashboard data"));
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, []);

  const couponActivityData = coupons.map((c) => ({
    id: c.id,
    name: c.customization?.title || 'Untitled coupon',
    discount: formatDiscount(c.discount),
    redemptions: analyticsByCoupon?.[c.id]?.totals?.redemptions || "0",
    limit: c.validity?.totalLimit || c.validity?.usageLimit || 'unlimited',
    expiration: c.validity?.endDate || 'N/A',
    status: c.status,
  }));

  const topPerformingData = couponActivityData.slice(0, 4).map((c) => ({
    id: c.id,
    name: c.name,
    performance: Math.min(100, (analyticsByCoupon?.[c.id]?.totals?.views || 0) * 5 || 0),
    redemptions: `${c.redemptions} uses`,
    revenue: '—',
  }));

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
              <RedemptionChart data={chartData} />
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
