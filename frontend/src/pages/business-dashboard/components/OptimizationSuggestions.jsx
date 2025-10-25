import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OptimizationSuggestions = ({ suggestions }) => {
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);

  const handleDismiss = (suggestionId) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
  };

  const visibleSuggestions = suggestions?.filter(s => !dismissedSuggestions?.includes(s?.id));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error bg-error/5';
      case 'medium': return 'border-warning bg-warning/5';
      case 'low': return 'border-success bg-success/5';
      default: return 'border-border bg-muted/20';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Info';
      case 'low': return 'Lightbulb';
      default: return 'Lightbulb';
    }
  };

  if (visibleSuggestions?.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-level-1 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">All Optimized!</h3>
          <p className="text-muted-foreground">Your coupons are performing well. Check back later for new suggestions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-level-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={18} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">AI Optimization Suggestions</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {visibleSuggestions?.length} suggestions
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {visibleSuggestions?.map((suggestion) => (
          <div 
            key={suggestion?.id} 
            className={`border rounded-lg p-4 ${getPriorityColor(suggestion?.priority)} transition-all duration-200 hover:shadow-level-1`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  suggestion?.priority === 'high' ? 'bg-error/20' :
                  suggestion?.priority === 'medium' ? 'bg-warning/20' : 'bg-success/20'
                }`}>
                  <Icon 
                    name={getPriorityIcon(suggestion?.priority)} 
                    size={16} 
                    className={
                      suggestion?.priority === 'high' ? 'text-error' :
                      suggestion?.priority === 'medium' ? 'text-warning' : 'text-success'
                    }
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{suggestion?.title}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{suggestion?.priority} Priority</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                iconName="X" 
                onClick={() => handleDismiss(suggestion?.id)}
                className="text-muted-foreground hover:text-foreground"
              />
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {suggestion?.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingUp" size={14} className="text-success" />
                  <span className="text-xs text-success font-medium">{suggestion?.impact}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{suggestion?.timeToImplement}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Learn More
                </Button>
                <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Suggestions powered by AI analysis of your coupon performance
          </p>
          <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationSuggestions;