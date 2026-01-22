import React from 'react';
import LegalLayout from '../legal/LegalLayout';

const Terms = () => (
  <LegalLayout
    title="Terms of Service"
    subtitle="Please read these terms carefully before using CouponCraft."
  >
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Overview</h2>
      <p>
        By accessing or using CouponCraft, you agree to these terms. If you do not agree, please do not use the
        service.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Account Responsibilities</h2>
      <p>
        You are responsible for keeping your account credentials secure and for all activity that occurs under your
        account. Provide accurate and up to date information to keep your business profile current.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Acceptable Use</h2>
      <p>
        Do not use CouponCraft to create or distribute content that is unlawful, misleading, or harmful. You are
        responsible for the coupons you publish and any claims you make.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Service Changes</h2>
      <p>
        We may update or modify the service to improve performance, add features, or address security issues. We will
        make reasonable efforts to communicate material changes.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Termination</h2>
      <p>
        You may stop using the service at any time. We may suspend or terminate access if you violate these terms or
        misuse the platform.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Contact Us</h2>
      <p>
        Questions about these terms can be sent to support@couponcraft.app.
      </p>
    </section>
  </LegalLayout>
);

export default Terms;
