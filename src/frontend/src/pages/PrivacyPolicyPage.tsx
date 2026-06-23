import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-4xl py-12 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="mb-8 gap-2 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Privacy Policy – SCOOPEX SHIFT
            </h1>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            <strong>Effective Date:</strong> January 10, 2026
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to <strong>SCOOPEX SHIFT</strong> ("we," "our," or
                "us"). We are committed to protecting your privacy and ensuring
                the security of your personal information. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our packers and movers platform
                operating within the Mumbai to Karjat region.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                By accessing or using SCOOPEX SHIFT, you agree to the terms of
                this Privacy Policy. If you do not agree with our practices,
                please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                2.1 Personal Information
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect personal information that you voluntarily provide to
                us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Register for an account</li>
                <li>Request a quote or book a service</li>
                <li>Communicate with service providers</li>
                <li>Contact our support team</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Personal information may include:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Name</li>
                <li>Contact information (phone number, email address)</li>
                <li>Pickup and drop-off addresses</li>
                <li>User type (customer or service provider)</li>
                <li>Internet Identity principal ID</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                2.2 Location Data
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                With your permission, we collect precise location data through:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Browser geolocation API (with high accuracy mode)</li>
                <li>Google Maps Places API for address autocomplete</li>
                <li>Google Maps Geocoding API for address validation</li>
                <li>
                  Latitude and longitude coordinates for pickup and drop-off
                  locations
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Location data is used exclusively to provide accurate quotes,
                route calculations, and service delivery within the Mumbai to
                Karjat region.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                2.3 Service Information
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Package type and weight range selections</li>
                <li>Quote details and pricing information</li>
                <li>Booking records and status</li>
                <li>Chat messages between customers and service providers</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                2.4 Technical Information
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>Service Delivery:</strong> To provide instant quote
                  estimation, match customers with service providers, and
                  facilitate bookings
                </li>
                <li>
                  <strong>Communication:</strong> To enable real-time chat
                  between customers and service providers
                </li>
                <li>
                  <strong>Location Services:</strong> To validate addresses,
                  calculate distances, and provide accurate route information
                  within the Mumbai to Karjat region
                </li>
                <li>
                  <strong>Account Management:</strong> To create and manage user
                  profiles, including authentication via Internet Identity
                </li>
                <li>
                  <strong>Payment Processing:</strong> To calculate and display
                  pricing in Indian Rupees (₹)
                </li>
                <li>
                  <strong>Service Improvement:</strong> To analyze usage
                  patterns and improve our platform
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable
                  laws and regulations
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Information Sharing and Disclosure
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                4.1 Service Providers
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                When you request a quote or book a service, we share relevant
                information (pickup/drop-off locations, package details, contact
                information) with matched service providers to fulfill your
                request.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                4.2 Third-Party Services
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>Google Maps API:</strong> For address autocomplete,
                  geocoding, and map display
                </li>
                <li>
                  <strong>Internet Computer (DFINITY):</strong> For
                  blockchain-based backend infrastructure
                </li>
                <li>
                  <strong>Internet Identity:</strong> For secure authentication
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                4.3 Legal Requirements
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We may disclose your information if required by law, court
                order, or government regulation, or to protect our rights,
                property, or safety.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                4.4 Business Transfers
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, your
                information may be transferred to the acquiring entity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Secure authentication via Internet Identity</li>
                <li>Encrypted data transmission</li>
                <li>Access controls and role-based permissions</li>
                <li>Regular security assessments</li>
                <li>
                  Blockchain-based data integrity on the Internet Computer
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, no method of transmission over the internet or
                electronic storage is 100% secure. While we strive to protect
                your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Your Rights and Choices
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                6.1 Access and Update
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You can access and update your profile information at any time
                through your account settings.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                6.2 Location Permissions
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You can control location access through your browser settings.
                If you deny location permissions, you can manually enter
                addresses using our Google Maps autocomplete feature.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                6.3 Communication Preferences
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You can manage your communication preferences and opt out of
                non-essential communications.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                6.4 Account Deletion
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You may request deletion of your account by contacting our
                support team. Please note that some information may be retained
                for legal or operational purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                Privacy Policy. Booking records, quotes, and chat messages are
                retained for operational and legal compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SCOOPEX SHIFT is not intended for users under the age of 18. We
                do not knowingly collect personal information from children. If
                you believe we have collected information from a child, please
                contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. International Users
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SCOOPEX SHIFT operates exclusively within India, specifically in
                the Mumbai to Karjat region. Our services are designed for users
                within this geographic area.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on our platform and updating the "Effective Date" at the
                top of this document. Your continued use of SCOOPEX SHIFT after
                changes are posted constitutes your acceptance of the updated
                Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-6 space-y-2">
                <p className="text-foreground">
                  <strong>SCOOPEX SHIFT</strong>
                </p>
                <p className="text-muted-foreground">
                  Location: Andheri West, Mumbai
                </p>
                <p className="text-muted-foreground">Phone: +91 98765 43210</p>
                <p className="text-muted-foreground">
                  Email: privacy@scoopexshift.com
                </p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                By using SCOOPEX SHIFT, you acknowledge that you have read,
                understood, and agree to be bound by this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
