import React from 'react';
import LegalLayout from '../legal/LegalLayout';

const Privacy = () => (
  <LegalLayout
    title="Privacy Policy"
    subtitle="Learn how CouponCraft collects, uses, and protects your information."
  >
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
      <p>
        We collect information you provide when creating an account, such as your name, email, and business details.
        We also collect usage data to understand how the platform is used.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">How We Use Information</h2>
      <p>
        We use your information to deliver the service, provide customer support, and improve product functionality.
        We may also send account related updates and important notices.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Information Sharing</h2>
      <p>
        We do not sell your personal information. We share data only with trusted service providers that help us
        operate the platform, and only as needed to provide the service.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Data Retention</h2>
      <p>
        We retain your information for as long as your account is active or as needed to provide the service. You may
        request deletion of your data by contacting support.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Your Choices</h2>
      <p>
        You can update your business profile at any time. If you have questions about your data, reach out to our
        support team for assistance.
      </p>
    </section>
  </LegalLayout>
);

export default Privacy;
