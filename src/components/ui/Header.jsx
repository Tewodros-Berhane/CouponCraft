import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../AuthContext';

const Header = ({ isInWorkflow = false, workflowStep = null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth() || {};

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/business-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'View your coupon performance and analytics'
    },
    {
      label: 'Create Coupon',
      path: '/create-coupon',
      icon: 'Plus',
      tooltip: 'Start creating a new coupon'
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: 'User',
      tooltip: 'Manage your business profile'
    }
  ];

  const workflowSteps = [
    { step: 1, label: 'Create', path: '/create-coupon' },
    { step: 2, label: 'Preview', path: '/coupon-preview' },
    { step: 3, label: 'Share', path: '/share-coupon' }
  ];

  const getCurrentWorkflowStep = () => {
    if (location?.pathname === '/create-coupon') return 1;
    if (location?.pathname === '/coupon-preview') return 2;
    if (location?.pathname === '/share-coupon') return 3;
    return workflowStep || 1;
  };

  const handleLogoClick = () => {
    navigate('/business-dashboard');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleLogout = async () => {
    logout?.();
    navigate('/business-login'); 
  };

  if (isInWorkflow || ['/create-coupon', '/coupon-preview', '/share-coupon']?.includes(location?.pathname)) {
    const currentStep = getCurrentWorkflowStep();
    
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-level-1">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover-scale"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Scissors" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">CouponCraft</span>
          </button>

          {/* Workflow Progress Indicator */}
          <div className="flex items-center space-x-4">
            {workflowSteps?.map((step, index) => (
              <div key={step?.step} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      step?.step === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step?.step < currentStep
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step?.step < currentStep ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      step?.step
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      step?.step === currentStep
                        ? 'text-primary'
                        : step?.step < currentStep
                        ? 'text-success' :'text-muted-foreground'
                    }`}
                  >
                    {step?.label}
                  </span>
                </div>
                {index < workflowSteps?.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-3 transition-colors duration-200 ${
                      step?.step < currentStep ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Exit Workflow Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogoClick}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Exit
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-level-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center space-x-2 hover-scale"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Scissors" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">CouponCraft</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover-scale ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={item?.tooltip}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-150"
          aria-label="Toggle mobile menu"
        >
          <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
        </button>

        {/* User Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">Hi, {user?.ownerName || user?.email}</span>
              <Button
                variant="ghost"
                size="sm"
                iconName="LogOut"
                iconPosition="left"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              iconName="LogIn"
              iconPosition="left"
              onClick={() => navigate('/business-login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close mobile menu"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-border shadow-level-3">
            <nav className="px-6 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-150 ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
              
              {/* Mobile User Actions */}
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-all duration-150"
                  >
                    <Icon name="LogOut" size={20} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/business-login"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-all duration-150"
                  >
                    <Icon name="LogIn" size={20} />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
