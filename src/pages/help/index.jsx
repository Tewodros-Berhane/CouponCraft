import React from 'react';
import LegalLayout from '../legal/LegalLayout';

const Help = () => (
  <LegalLayout
    title="Help Center"
    subtitle="Find quick guidance for creating, sharing, and tracking your coupons."
  >
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Getting Started</h2>
      <p>
        Complete your business profile, then walk through the coupon builder to select a template, define your offer,
        and publish your first promotion.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Sharing Coupons</h2>
      <p>
        Use a share link for digital campaigns or generate a QR code for printed materials and in-store signage. Each
        share method tracks clicks and redemptions automatically.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
      <p>
        Visit your dashboard to review performance trends. You can also open share analytics for individual links or
        QR codes to see conversion details.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Need More Help?</h2>
      <p>
        Email us at support@couponcraft.app and our team will respond within one business day.
      </p>
    </section>
  </LegalLayout>
);

export default Help;
