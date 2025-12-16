import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../components/ui/ToastProvider';

const SuccessModal = ({ isOpen, onClose, userEmail }) => {
  const navigate = useNavigate();
  const toast = useToast();

  if (!isOpen) return null;

  const handleContinue = () => {
    navigate('/business-login');
  };

  const handleResendEmail = () => {
    toast.info('Verification email resend is not available yet');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-level-4 max-w-md w-full mx-4 p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to CouponCraft!</h2>
        <p className="text-muted-foreground mb-6">
          Your business account has been created successfully. We've sent a verification email to{' '}
          <span className="font-medium text-foreground">{userEmail}</span>
        </p>

        {/* Next Steps */}
        <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
          <h3 className="text-sm font-semibold text-foreground mb-3">Next Steps:</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Icon name="Mail" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Check your email and verify your account</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Settings" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Complete your business profile setup</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Plus" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Create your first coupon campaign</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            fullWidth
            iconName="ArrowRight"
            iconPosition="right"
          >
            Sign In Now
          </Button>
          
          <Button
            variant="outline"
            onClick={handleResendEmail}
            fullWidth
            iconName="RefreshCw"
            iconPosition="left"
          >
            Resend Verification Email
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={handleResendEmail}
              className="text-primary hover:underline font-medium"
            >
              click here to resend
            </button>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors duration-150"
          aria-label="Close modal"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
