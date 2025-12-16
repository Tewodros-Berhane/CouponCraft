import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import IconButton from '../../../components/ui/IconButton';

const CouponActivityTable = ({ coupons }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const getAriaSort = (field) => {
    if (sortField !== field) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const getSortButtonLabel = (field, label) => {
    if (sortField !== field) return `Sort by ${label}`;
    return `Sort by ${label} (currently ${sortDirection === 'asc' ? 'ascending' : 'descending'})`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success/10 text-success', label: 'Active' },
      expired: { color: 'bg-error/10 text-error', label: 'Expired' },
      paused: { color: 'bg-warning/10 text-warning', label: 'Paused' },
      draft: { color: 'bg-muted text-muted-foreground', label: 'Draft' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCoupons = [...coupons]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'redemptions') {
      aValue = parseInt(aValue);
      bValue = parseInt(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="bg-card rounded-lg shadow-level-1 overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Coupon Activity</h3>
          <Button variant="outline" size="sm" iconName="Filter" iconPosition="left">
            Filter
          </Button>
        </div>
      </div>
       {/* Desktop Table */}
       <div className="hidden md:block overflow-x-auto">
         <table className="w-full">
           <thead className="bg-muted/30">
             <tr>
              <th className="px-6 py-3 text-left" scope="col" aria-sort={getAriaSort('name')}>
                <button
                  type="button"
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  aria-label={getSortButtonLabel('name', 'coupon name')}
                >
                  <span>Coupon Name</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left" scope="col" aria-sort={getAriaSort('redemptions')}>
                <button
                  type="button"
                  onClick={() => handleSort('redemptions')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  aria-label={getSortButtonLabel('redemptions', 'redemptions')}
                >
                  <span>Redemptions</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left" scope="col">
                <span className="text-sm font-medium text-muted-foreground">Expiration</span>
              </th>
              <th className="px-6 py-3 text-left" scope="col">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </th>
              <th className="px-6 py-3 text-left" scope="col">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedCoupons?.map((coupon) => (
              <tr key={coupon?.id} className="hover:bg-muted/20 transition-colors duration-150">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <Icon name="Percent" size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{coupon?.name}</p>
                      <p className="text-xs text-muted-foreground">{coupon?.discount}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{coupon?.redemptions}</span>
                    <span className="text-xs text-muted-foreground">/ {coupon?.limit}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">{coupon?.expiration}</span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(coupon?.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <IconButton ariaLabel="View coupon" iconName="Eye" />
                    <IconButton ariaLabel="Edit coupon" iconName="Edit" />
                    <IconButton ariaLabel="Share coupon" iconName="Share" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Accordion */}
      <div className="md:hidden">
        {sortedCoupons?.map((coupon) => (
          <div key={coupon?.id} className="border-b border-border last:border-b-0">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Icon name="Percent" size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{coupon?.name}</p>
                    <p className="text-xs text-muted-foreground">{coupon?.discount}</p>
                  </div>
                </div>
                {getStatusBadge(coupon?.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Redemptions</p>
                  <p className="text-sm font-medium text-foreground">{coupon?.redemptions} / {coupon?.limit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <p className="text-sm font-medium text-foreground">{coupon?.expiration}</p>
                </div>
              </div>
               
               <div className="flex items-center space-x-2">
                 <IconButton ariaLabel="View coupon" iconName="Eye" />
                 <IconButton ariaLabel="Edit coupon" iconName="Edit" />
                 <IconButton ariaLabel="Share coupon" iconName="Share" />
               </div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default CouponActivityTable;
