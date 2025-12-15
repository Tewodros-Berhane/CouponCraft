import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RegistrationForm from './components/RegistrationForm';
import TemplatePreview from './components/TemplatePreview';
import TrustSignals from './components/TrustSignals';
import SuccessModal from './components/SuccessModal';
import { useAuth } from '../../AuthContext';
import { useToast } from '../../components/ui/ToastProvider';

const BusinessRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const toast = useToast();

  const handleRegistration = async (formData) => {
    setIsLoading(true);
    try {
      await registerUser({
        businessName: formData?.businessName,
        ownerName: formData?.ownerName,
        email: formData?.email,
        phone: formData?.phone,
        businessType: formData?.businessType,
        password: formData?.password,
      });
      setRegisteredEmail(formData?.email);
      setShowSuccessModal(true);
      setTimeout(() => navigate('/business-dashboard'), 1000);
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessTypeChange = (businessType) => {
    setSelectedBusinessType(businessType);
  };

  return (
    <>
      <Helmet>
        <title>Create Your Business Account - CouponCraft</title>
        <meta name="description" content="Join thousands of businesses using CouponCraft to create professional digital coupons and boost customer engagement." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 hover-scale">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Scissors" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-foreground">CouponCraft</span>
              </Link>

              {/* Login Link */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Already have an account?</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/business-login')}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Start Growing Your Business Today
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create professional digital coupons in minutes and watch your customer engagement soar. 
              Join over 10,000 successful businesses already using CouponCraft.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Registration Form - Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-border shadow-level-2 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h2>
                  <p className="text-muted-foreground">
                    Get started with your free CouponCraft account in just a few steps
                  </p>
                </div>

                <RegistrationForm
                  onSubmit={handleRegistration}
                  isLoading={isLoading}
                  onBusinessTypeChange={handleBusinessTypeChange}
                />

                {/* Additional Information */}
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="grid sm:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="Zap" size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Quick Setup</h3>
                        <p className="text-xs text-muted-foreground">Ready in 5 minutes</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                        <Icon name="CreditCard" size={20} className="text-success" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Free to Start</h3>
                        <p className="text-xs text-muted-foreground">No credit card required</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <Icon name="Users" size={20} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Expert Support</h3>
                        <p className="text-xs text-muted-foreground">24/7 assistance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Template Preview */}
              <TemplatePreview selectedBusinessType={selectedBusinessType} />

              {/* Trust Signals */}
              <TrustSignals />
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Transform Your Marketing?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of businesses that have increased their customer engagement by an average of 35% 
                using our professional coupon platform.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span>Professional Templates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span>Real-time Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span>Multi-channel Sharing</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                © {new Date()?.getFullYear()} CouponCraft. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          userEmail={registeredEmail}
        />
      </div>
    </>
  );
};

export default BusinessRegistration;
