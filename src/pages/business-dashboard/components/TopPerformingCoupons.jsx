import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TopPerformingCoupons = ({ coupons }) => {
  const getPerformanceColor = (performance) => {
    if (performance >= 80) return 'text-success';
    if (performance >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-lg shadow-level-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top Performing Coupons</h3>
        <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
      </div>
      <div className="space-y-4">
        {coupons?.map((coupon, index) => (
          <div key={coupon?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-150">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Icon name="Percent" size={18} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{index + 1}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground truncate">{coupon?.name}</p>
                <span className={`text-sm font-semibold ${getPerformanceColor(coupon?.performance)}`}>
                  {coupon?.performance}%
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{coupon?.redemptions} redemptions</span>
                <span>{coupon?.revenue}</span>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      coupon?.performance >= 80 ? 'bg-success' : 
                      coupon?.performance >= 60 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${coupon?.performance}%` }}
                  />
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" iconName="ExternalLink" />
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="BarChart3" iconPosition="left">
          View Detailed Analytics
        </Button>
      </div>
    </div>
  );
};

export default TopPerformingCoupons;