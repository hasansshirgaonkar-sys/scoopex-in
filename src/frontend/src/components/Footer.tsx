import { useNavigate } from "@tanstack/react-router";
import { Heart, MapPin, Phone, Shield } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer
      id="contact"
      className="border-t bg-gradient-to-br from-primary/5 via-background to-secondary/5"
    >
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              SCOOPEX
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mumbai's most trusted packers and movers. We make shifting easy,
              affordable, and stress-free.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Shield className="h-5 w-5" />
              <span>100% Damage Protection</span>
            </div>
          </div>

          {/* Quick Links - Desktop Order */}
          <div className="space-y-4 hidden md:block">
            <h4 className="text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("book-a-truck")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Book a Truck
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("pricing")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("reviews")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("faqs")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links - Mobile Order */}
          <div className="space-y-4 md:hidden">
            <h4 className="text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("pricing")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("book-a-truck")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Book a Truck
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("faqs")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("reviews")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="tel:+918108140307"
                  className="hover:text-primary transition-colors hover:underline"
                >
                  +91 8108140307
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Kalyan West, Mumbai</span>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigation("/privacy")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigation("/terms")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 SCOOPEX. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 fill-primary text-primary animate-pulse" />
              <span>using</span>
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
