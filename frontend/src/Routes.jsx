// src/Routes.js
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing-page';
import CreateCoupon from './pages/create-coupon';
import BusinessRegistration from './pages/business-registration';
import BusinessDashboard from './pages/business-dashboard';
import BusinessLogin from './pages/business-login';
import CouponPreview from './pages/coupon-preview';
import ShareCoupon from './pages/share-coupon';
// import ProtectedRoute from './ProtectedRoute';
// import { AuthProvider } from './AuthContext';

const Routes = () => {
  return (
    // <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/create-coupon" element={<CreateCoupon />} />
            <Route path="/business-registration" element={<BusinessRegistration />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/business-login" element={<BusinessLogin />} />
            <Route path="/coupon-preview" element={<CouponPreview />} />
            <Route path="/share-coupon" element={<ShareCoupon />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </BrowserRouter>
    // </AuthProvider>
  );
};

export default Routes;