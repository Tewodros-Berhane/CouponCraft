import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import IconButton from '../../../components/ui/IconButton';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import EmptyState from '../../../components/ui/EmptyState';

const CouponActivityTable = ({ coupons }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const handleView = (coupon) => {
    if (!coupon?.id) return;
    navigate('/coupon-preview', { state: { couponId: coupon.id } });
  };

  const handleEdit = (coupon) => {
    if (!coupon?.id) return;
    navigate('/create-coupon', { state: { editMode: true, couponId: coupon.id } });
  };

  const handleShare = (coupon) => {
    if (!coupon?.id) return;
    navigate('/share-coupon', { state: { couponId: coupon.id } });
  };

  const normalizedCoupons = Array.isArray(coupons) ? coupons : [];
  const normalizedQuery = query?.trim()?.toLowerCase();

  const filteredCoupons = normalizedCoupons?.filter((coupon) => {
    const status = coupon?.status || 'draft';
    if (statusFilter !== 'all' && status !== statusFilter) return false;

    if (!normalizedQuery) return true;
    const haystack = `${coupon?.name || ''} ${coupon?.discount || ''}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const sortedCoupons = [...filteredCoupons]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'redemptions') {
      aValue = parseInt(aValue, 10) || 0;
      bValue = parseInt(bValue, 10) || 0;
    } else {
      aValue = String(aValue ?? '').toLowerCase();
      bValue = String(bValue ?? '').toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  return (
    <div className="bg-card rounded-lg shadow-level-1 overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Coupon Activity</h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="w-full sm:w-64">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search coupons"
                aria-label="Search coupons"
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                value={statusFilter}
                onChange={(v) => setStatusFilter(v)}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Draft', value: 'draft' },
                  { label: 'Paused', value: 'paused' },
                  { label: 'Expired', value: 'expired' },
                ]}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery('');
                setStatusFilter('all');
              }}
              disabled={!query && statusFilter === 'all'}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
       {/* Desktop Table */}
       <div className="hidden md:block overflow-x-auto">
        {sortedCoupons?.length === 0 ? (
          <EmptyState
            iconName="Inbox"
            title="No coupons found"
            description="Try adjusting your search or filter."
          />
        ) : (
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
                    <IconButton ariaLabel="View coupon" iconName="Eye" onClick={() => handleView(coupon)} />
                    <IconButton ariaLabel="Edit coupon" iconName="Edit" onClick={() => handleEdit(coupon)} />
                    <IconButton ariaLabel="Share coupon" iconName="Share" onClick={() => handleShare(coupon)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      {/* Mobile Accordion */}
      <div className="md:hidden">
        {sortedCoupons?.length === 0 ? (
          <EmptyState
            iconName="Inbox"
            title="No coupons found"
            description="Try adjusting your search or filter."
          />
        ) : null}
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
                 <IconButton ariaLabel="View coupon" iconName="Eye" onClick={() => handleView(coupon)} />
                 <IconButton ariaLabel="Edit coupon" iconName="Edit" onClick={() => handleEdit(coupon)} />
                 <IconButton ariaLabel="Share coupon" iconName="Share" onClick={() => handleShare(coupon)} />
               </div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default CouponActivityTable;
