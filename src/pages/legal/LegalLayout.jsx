import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LegalLayout = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 hover-scale">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Scissors" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">CouponCraft</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/business-login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/business-registration')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-10 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          {subtitle ? <p className="text-muted-foreground mb-8">{subtitle}</p> : null}
          <div className="space-y-8 text-sm text-muted-foreground">{children}</div>
        </div>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              Copyright {new Date().getFullYear()} CouponCraft. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalLayout;
