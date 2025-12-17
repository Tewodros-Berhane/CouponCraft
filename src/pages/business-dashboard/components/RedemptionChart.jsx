import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';


const RedemptionChart = ({ data }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7d');
  const safeData = Array.isArray(data) ? data : [];
  const totalClicks = safeData.reduce((sum, item) => sum + (Number(item?.clicks) || 0), 0);
  const totalRedemptions = safeData.reduce((sum, item) => sum + (Number(item?.redemptions) || 0), 0);
  const conversionRate = totalClicks ? (totalRedemptions / totalClicks) * 100 : 0;
  const avgDaily = safeData.length ? Math.round(totalRedemptions / safeData.length) : 0;

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-level-2 p-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-muted-foreground">{entry?.name}:</span>
              <span className="text-sm font-semibold text-foreground">{entry?.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg shadow-level-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={18} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Redemption Trends</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {timeRangeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setTimeRange(option?.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                  timeRange === option?.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
          
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-all duration-150 ${
                chartType === 'line' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="TrendingUp" size={16} />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-md transition-all duration-150 ${
                chartType === 'area' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="AreaChart" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="h-80 w-full" aria-label="Coupon Redemption Trends Chart">
        {safeData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No analytics data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={safeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="redemptions" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                name="Redemptions"
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
                name="Clicks"
              />
              </LineChart>
            ) : (
              <AreaChart data={safeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                stackId="1"
                stroke="var(--color-accent)" 
                fill="var(--color-accent)"
                fillOpacity={0.3}
                name="Clicks"
              />
              <Area 
                type="monotone" 
                dataKey="redemptions" 
                stackId="1"
                stroke="var(--color-primary)" 
                fill="var(--color-primary)"
                fillOpacity={0.6}
                name="Redemptions"
              />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Clicks</p>
            <p className="text-lg font-semibold text-foreground">
              {totalClicks.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Redemptions</p>
            <p className="text-lg font-semibold text-foreground">
              {totalRedemptions.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
            <p className="text-lg font-semibold text-success">
              {conversionRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Avg. Daily</p>
            <p className="text-lg font-semibold text-foreground">
              {avgDaily.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedemptionChart;
