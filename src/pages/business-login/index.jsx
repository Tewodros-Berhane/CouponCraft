import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import { useAuth } from '../../AuthContext';

const BusinessLogin = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/business-dashboard', { replace: true });
    }
  }, [loading, user, navigate]);

  return (
    <>
      <Helmet>
        <title>Business Login - CouponCraft</title>
        <meta name="description" content="Sign in to your CouponCraft business account to create, manage, and track your digital coupon campaigns." />
        <meta name="keywords" content="business login, coupon management, digital coupons, small business marketing" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        <div className="relative z-10 min-h-screen flex">
          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Login Form Section */}
                <div className="flex items-center justify-center">
                  <LoginForm />
                </div>

                {/* Trust Signals Section */}
                <div className="hidden lg:block">
                  <div className="sticky top-8">
                    <TrustSignals />
                  </div>
                </div>
              </div>

              {/* Mobile Trust Signals */}
              <div className="lg:hidden mt-12">
                <TrustSignals />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-card border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-white">CC</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  © {new Date()?.getFullYear()} CouponCraft. All rights reserved.
                </span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <Link to="/privacy" className="hover:text-foreground transition-colors duration-150">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-foreground transition-colors duration-150">
                  Terms of Service
                </Link>
                <Link to="/help" className="hover:text-foreground transition-colors duration-150">
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BusinessLogin;
