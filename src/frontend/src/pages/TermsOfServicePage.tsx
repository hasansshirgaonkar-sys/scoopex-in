import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
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
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Terms of Service – SCOOPEX SHIFT
            </h1>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            <strong>Effective Date:</strong> January 10, 2026
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to <strong>SCOOPEX SHIFT</strong> ("Platform," "we,"
                "our," or "us"). By accessing or using our packers and movers
                platform, you agree to be bound by these Terms of Service
                ("Terms"). If you do not agree to these Terms, please do not use
                our services.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These Terms constitute a legally binding agreement between you
                and SCOOPEX SHIFT. We reserve the right to modify these Terms at
                any time, and your continued use of the Platform after changes
                are posted constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 2. Service Description
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                SCOOPEX SHIFT is a platform that connects customers with packers
                and movers service providers operating within the Mumbai to
                Karjat region in India. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Instant quote estimation with address validation</li>
                <li>Service provider matching and booking</li>
                <li>
                  Real-time communication between customers and service
                  providers
                </li>
                <li>Booking management and tracking</li>
                <li>Location-based services using Google Maps integration</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Important:</strong> SCOOPEX SHIFT is a platform that
                facilitates connections between customers and independent
                service providers. We do not directly provide packing, moving,
                or transportation services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 3. User Eligibility
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To use SCOOPEX SHIFT, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>
                  Provide accurate and complete information during registration
                </li>
                <li>
                  Maintain the security of your Internet Identity credentials
                </li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 4. User Accounts and Authentication
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                4.1 Internet Identity
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                SCOOPEX SHIFT uses Internet Identity for secure authentication.
                You are responsible for maintaining the confidentiality of your
                authentication credentials and for all activities that occur
                under your account.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                4.2 User Profile
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Upon first login, you must create a user profile with your name,
                contact information, and user type (customer or service
                provider). You agree to provide accurate, current, and complete
                information and to update it as necessary.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                4.3 Account Security
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You must immediately notify us of any unauthorized use of your
                account or any other security breach. We are not liable for any
                loss or damage arising from your failure to protect your account
                credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 5. User Roles and Responsibilities
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                5.1 Customers
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                As a customer, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Provide accurate pickup and drop-off addresses within the
                  Mumbai to Karjat region
                </li>
                <li>Select appropriate package types and weight ranges</li>
                <li>Communicate clearly with service providers</li>
                <li>Pay agreed-upon fees in Indian Rupees (₹)</li>
                <li>Comply with service provider terms and conditions</li>
                <li>Provide feedback and ratings honestly</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                5.2 Service Providers
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                As a service provider, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Maintain valid licenses and insurance as required by law
                </li>
                <li>Provide accurate service descriptions and availability</li>
                <li>Honor quoted prices and service commitments</li>
                <li>
                  Handle customer belongings with care and professionalism
                </li>
                <li>Maintain the "100% Damage Protection" guarantee</li>
                <li>Respond promptly to customer inquiries</li>
                <li>
                  Comply with all applicable transportation and safety
                  regulations
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 6. Quotes and Pricing
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                6.1 Instant Quotes
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our platform provides instant quote estimates based on distance
                calculations and weight ranges. These quotes are estimates and
                may be subject to adjustment by service providers based on
                actual conditions.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                6.2 Final Pricing
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Final pricing is determined through communication between
                customers and service providers. All prices are displayed in
                Indian Rupees (₹). SCOOPEX SHIFT does not control pricing and is
                not responsible for pricing disputes.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                6.3 Payment
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Payment arrangements are made directly between customers and
                service providers. SCOOPEX SHIFT does not process payments or
                hold funds on behalf of users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 7. Bookings and Cancellations
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                7.1 Booking Process
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Customers can book services after receiving and accepting a
                quote. Bookings are subject to service provider availability and
                confirmation.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                7.2 Cancellation Policy
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Cancellation policies are determined by individual service
                providers. Customers should review and agree to cancellation
                terms before booking. SCOOPEX SHIFT is not responsible for
                cancellation fees or disputes.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                7.3 Service Modifications
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Any changes to booking details (dates, locations, package types)
                must be communicated and agreed upon by both parties through the
                platform's chat interface.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 8. Location Services and Data Usage
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                8.1 Geolocation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our platform uses browser geolocation API with high accuracy
                mode to detect your current location. You can grant or deny
                location permissions through your browser settings.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                8.2 Google Maps Integration
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We use Google Maps APIs for address autocomplete, geocoding, and
                map display. Your use of these features is subject to Google's
                Terms of Service and Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                8.3 Service Area
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                SCOOPEX SHIFT operates exclusively within the Mumbai to Karjat
                region (approximately 18.70°N–19.40°N, 72.85°E–73.45°E).
                Services outside this area are not supported.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 9. Communication and Chat
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our platform provides real-time chat functionality between
                customers and service providers. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Use chat for legitimate business purposes only</li>
                <li>Communicate respectfully and professionally</li>
                <li>Not share personal financial information through chat</li>
                <li>
                  Not use chat for spam, harassment, or illegal activities
                </li>
                <li>
                  Understand that chat messages are stored and may be reviewed
                  for quality and safety purposes
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 10. Prohibited Conduct
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Impersonate another person or entity</li>
                <li>Engage in fraudulent activities</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Use the Platform for any illegal purpose</li>
                <li>Scrape or collect data without permission</li>
                <li>Interfere with the proper functioning of the Platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 11. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of SCOOPEX SHIFT,
                including but not limited to text, graphics, logos, icons,
                images, and software, are the exclusive property of SCOOPEX
                SHIFT or its licensors and are protected by copyright,
                trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You may not reproduce, distribute, modify, or create derivative
                works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 12. Disclaimers and Limitations of Liability
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                12.1 Platform Role
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                SCOOPEX SHIFT is a platform that facilitates connections between
                customers and independent service providers. We do not employ
                service providers and are not responsible for their actions,
                services, or conduct.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                12.2 No Warranties
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The Platform is provided "as is" and "as available" without
                warranties of any kind, either express or implied, including but
                not limited to warranties of merchantability, fitness for a
                particular purpose, or non-infringement.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                12.3 Limitation of Liability
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, SCOOPEX SHIFT shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, including but not limited to loss of
                profits, data, or goodwill, arising from your use of the
                Platform or services obtained through the Platform.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                12.4 Service Provider Responsibility
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Service providers are solely responsible for the quality,
                safety, and legality of their services. SCOOPEX SHIFT does not
                guarantee the performance, reliability, or quality of services
                provided by third-party service providers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 13. Indemnification
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless SCOOPEX SHIFT,
                its affiliates, officers, directors, employees, and agents from
                any claims, liabilities, damages, losses, costs, or expenses
                (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your conduct in connection with the Platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 14. Dispute Resolution
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                14.1 Customer-Provider Disputes
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Disputes between customers and service providers should be
                resolved directly between the parties. SCOOPEX SHIFT may provide
                assistance but is not obligated to mediate or resolve such
                disputes.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                14.2 Governing Law
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of India, without regard to conflict of law
                principles.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                14.3 Jurisdiction
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Any legal action or proceeding arising under these Terms shall
                be brought exclusively in the courts located in Mumbai, India,
                and you consent to the jurisdiction of such courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 15. Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account and
                access to the Platform at any time, with or without notice, for
                any reason, including but not limited to violation of these
                Terms, fraudulent activity, or conduct that we deem harmful to
                the Platform or other users.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Upon termination, your right to use the Platform will
                immediately cease. Provisions that by their nature should
                survive termination shall survive, including but not limited to
                ownership provisions, warranty disclaimers, and limitations of
                liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 16. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will
                notify users of material changes by posting the updated Terms on
                the Platform and updating the "Effective Date" at the top of
                this document. Your continued use of the Platform after changes
                are posted constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 17. Severability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions shall remain in full
                force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 18. Entire Agreement
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the
                entire agreement between you and SCOOPEX SHIFT regarding your
                use of the Platform and supersede all prior agreements and
                understandings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>📜</span> 19. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any questions or concerns about these Terms of
                Service, please contact us:
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
                  Email: support@scoopexshift.com
                </p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                By using SCOOPEX SHIFT, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
