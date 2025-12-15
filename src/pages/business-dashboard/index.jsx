import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricsCard from './components/MetricsCard';
import CouponActivityTable from './components/CouponActivityTable';
import TopPerformingCoupons from './components/TopPerformingCoupons';
import OptimizationSuggestions from './components/OptimizationSuggestions';
import RedemptionChart from './components/RedemptionChart';
import QuickActions from './components/QuickActions';
import api from '../../apiClient';
import { useAuth } from '../../AuthContext';

const BusinessDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [analyticsByCoupon, setAnalyticsByCoupon] = useState({});
  const { user } = useAuth();

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
        let totalRedemptions = 0;
        let totalViews = 0;

        const analyticsResults = await Promise.all(
          list.map(async (c) => {
            try {
              const analytics = await api.get(`/analytics/coupons/${c.id}`);
              const events = analytics?.data?.data?.events || [];
              const byDate = events.reduce((acc, ev) => {
                const dateKey = new Date(ev.createdAt).toISOString().slice(0, 10);
                const label = new Date(ev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!acc[dateKey]) acc[dateKey] = { date: label, views: 0, redemptions: 0 };
                if (ev.eventType === 'view') acc[dateKey].views += 1;
                if (ev.eventType === 'redemption') acc[dateKey].redemptions += 1;
                return acc;
              }, {});
              const totals = Object.values(byDate).reduce(
                (tot, cur) => {
                  tot.views += cur.views;
                  tot.redemptions += cur.redemptions;
                  return tot;
                },
                { views: 0, redemptions: 0 }
              );
              totalRedemptions += totals.redemptions;
              totalViews += totals.views;
              return { id: c.id, byDate, totals };
            } catch (err) {
              console.error('Failed to load analytics', err);
              return { id: c.id, byDate: {}, totals: { views: 0, redemptions: 0 } };
            }
          })
        );

        const analyticsMap = analyticsResults.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        setAnalyticsByCoupon(analyticsMap);

        const dateAccumulator = {};
        analyticsResults.forEach((item) => {
          Object.entries(item.byDate).forEach(([key, value]) => {
            if (!dateAccumulator[key]) {
              dateAccumulator[key] = { date: value.date, views: 0, redemptions: 0 };
            }
            dateAccumulator[key].views += value.views;
            dateAccumulator[key].redemptions += value.redemptions;
          });
        });
        const aggregatedDates = Object.entries(dateAccumulator)
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .map(([, val]) => val);
        setChartData(aggregatedDates);

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
            value: totalRedemptions.toString(),
            change: `${totalRedemptions} total`,
            changeType: totalRedemptions > 0 ? "positive" : "neutral",
            icon: "TrendingUp",
            trend: totalRedemptions,
          },
        ]);
      } catch (err) {
        console.error('Failed to load coupons', err);
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
    revenue: '$0',
  }));

  // Mock data for AI optimization suggestions
  const optimizationSuggestions = [
    {
      id: 1,
      title: "Increase Summer Sale Discount",
      description: `Your Summer Sale coupon is performing well but could reach more customers. Consider increasing the discount from 25% to 30% to boost redemption rates. Based on similar campaigns, this could increase conversions by 15-20%.`,
      priority: "high",
      impact: "+20% conversions",
      timeToImplement: "5 minutes"
    },
    {
      id: 2,
      title: "Extend New Customer Welcome Period",
      description: `Your welcome coupon expires soon but shows strong engagement. Extending the validity period by 30 days could capture more new customers who are still in their decision-making process.`,
      priority: "medium",
      impact: "+12% new customers",
      timeToImplement: "2 minutes"
    },
    {
      id: 3,
      title: "Create Weekend-Specific Offers",
      description: `Analytics show 40% higher engagement on weekends. Creating weekend-only flash sales could capitalize on this pattern and drive additional revenue during peak shopping times.`,
      priority: "low",
      impact: "+8% weekend sales",
      timeToImplement: "15 minutes"
    }
  ];

  const chartDataFallback = [
    { date: "Mon", redemptions: 0, views: 0 },
    { date: "Tue", redemptions: 0, views: 0 },
    { date: "Wed", redemptions: 0, views: 0 },
    { date: "Thu", redemptions: 0, views: 0 },
    { date: "Fri", redemptions: 0, views: 0 },
    { date: "Sat", redemptions: 0, views: 0 },
    { date: "Sun", redemptions: 0, views: 0 },
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
              <RedemptionChart data={chartData?.length ? chartData : chartDataFallback} />
              <CouponActivityTable coupons={couponActivityData} />
            </div>

            {/* Right Column - Quick Actions and Performance */}
            <div className="space-y-8">
              <QuickActions />
              <TopPerformingCoupons coupons={topPerformingData} />
            </div>
          </div>

          {/* AI Optimization Suggestions */}
          <div className="mb-8">
            <OptimizationSuggestions suggestions={optimizationSuggestions} />
          </div>

          {/* Footer Stats */}
          <div className="bg-card rounded-lg shadow-level-1 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">98.5%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2.3s</p>
                <p className="text-sm text-muted-foreground">Avg Load Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.8/5</p>
                <p className="text-sm text-muted-foreground">Customer Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
