import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';

const QuickActions = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const quickActions = [
    {
      id: 'create-coupon',
      title: 'Create New Coupon',
      description: 'Design and launch a new promotional offer',
      icon: 'Plus',
      color: 'bg-primary',
      action: () => navigate('/create-coupon'),
      featured: true
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Detailed performance insights',
      icon: 'BarChart3',
      color: 'bg-accent',
      action: () => toast.info('Analytics dashboard is coming soon'),
      featured: false
    },
    {
      id: 'duplicate-coupon',
      title: 'Duplicate Best Performer',
      description: 'Copy your top coupon settings',
      icon: 'Copy',
      color: 'bg-secondary',
      action: () => toast.info('Duplicate coupon is coming soon'),
      featured: false
    },
    {
      id: 'bulk-create',
      title: 'Bulk Create',
      description: 'Create multiple coupons at once',
      icon: 'Layers',
      color: 'bg-warning',
      action: () => toast.info('Bulk create is coming soon'),
      featured: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Featured Action */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white shadow-level-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Ready to Create Your Next Coupon?</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Launch a new promotional campaign in minutes with our intuitive coupon builder.
            </p>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/create-coupon')}
              iconName="Plus" 
              iconPosition="left"
              className="bg-white text-primary hover:bg-white/90"
            >
              Create Coupon Now
            </Button>
          </div>
          <div className="hidden md:block ml-6">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
              <Icon name="Scissors" size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions?.filter(action => !action?.featured)?.map((action) => (
          <div 
            key={action?.id}
            className="bg-card rounded-lg p-4 shadow-level-1 hover:shadow-level-2 transition-all duration-200 cursor-pointer group"
            onClick={action?.action}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={action?.icon} size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  {action?.title}
                </h4>
              </div>
              <Icon name="ArrowRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {action?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Additional Actions */}
      <div className="bg-card rounded-lg p-4 shadow-level-1">
        <h4 className="text-sm font-semibold text-foreground mb-3">More Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { icon: 'Settings', label: 'Settings', action: () => navigate('/profile') },
            { icon: 'Users', label: 'Customers', action: () => toast.info('Customers is coming soon') },
            { icon: 'Download', label: 'Export', action: () => toast.info('Export is coming soon') },
            { icon: 'HelpCircle', label: 'Help', action: () => toast.info('Help center is coming soon') }
          ]?.map((item) => (
            <button
              key={item?.label}
              onClick={item?.action}
              className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150 group"
            >
              <Icon name={item?.icon} size={18} className="text-muted-foreground group-hover:text-primary transition-colors duration-150" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-150">
                {item?.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
