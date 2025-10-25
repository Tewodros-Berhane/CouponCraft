import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
// import { useAuth } from '../../../AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const { login } = useAuth();

  // Mock credentials for demonstration
  // const mockCredentials = {
  //   email: 'business@couponcraft.com',
  //   password: 'CouponCraft2024!'
  // };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  navigate('/business-dashboard');
  // try {
  //   const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
  //   const user = userCredential.user;

  //   login({
  //     id: user.uid,
  //     email: user.email,
  //     loginTime: new Date()?.toISOString(),
  //   });

  //   navigate('/business-dashboard');
  // } catch (error) {
  //   console.error("Error during login:", error.message);
  //   setErrors({ general: error.message });
  // } finally {
  //   setIsLoading(false);
  // }
};

  const handleForgotPassword = () => {
    // In a real app, this would navigate to forgot password page
    alert('Password reset functionality would be implemented here. For demo, use: business@couponcraft.com / CouponCraft2024!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-xl shadow-level-2 p-8 border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Scissors" size={32} color="white" />
          </div>
          </a>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your CouponCraft business account</p>
        </div>

        {/* Demo Credentials Notice */}
        {/* <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-accent mb-1">Demo Credentials</p>
              <p className="text-xs text-accent/80">
                Email: business@couponcraft.com<br />
                Password: CouponCraft2024!
              </p>
            </div>
          </div>
        </div> */}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors?.general && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
                <p className="text-sm text-error">{errors?.general}</p>
              </div>
            </div>
          )}

          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your business email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          {/* Password Field */}
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Registration Link */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">New to our platform?</p>
          <Button
            variant="outline"
            size="default"
            fullWidth
            iconName="UserPlus"
            iconPosition="left"
            onClick={() => navigate('/business-registration')}
            disabled={isLoading}
          >
            Create Business Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;