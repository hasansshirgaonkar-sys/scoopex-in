import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Package, Users } from "lucide-react";
import { useState } from "react";
import BookingsSection from "../components/BookingsSection";
import FAQSection from "../components/FAQSection";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import ProvidersSection from "../components/ProvidersSection";
import QuoteEstimatorSection from "../components/QuoteEstimatorSection";
import TestimonialsSection from "../components/TestimonialsSection";
import VehicleOptionsSection from "../components/VehicleOptionsSection";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState("quote");

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen">
      <HeroSection />

      <HowItWorksSection />

      <VehicleOptionsSection />

      <section id="pricing" className="container py-16 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-10 h-14 bg-muted/50 p-1 rounded-xl shadow-md">
            <TabsTrigger
              value="quote"
              className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all"
            >
              <Calculator className="h-5 w-5" />
              <span className="hidden sm:inline">Get Quote</span>
              <span className="sm:hidden">Quote</span>
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all"
              disabled={!isAuthenticated}
            >
              <Package className="h-5 w-5" />
              <span className="hidden sm:inline">My Bookings</span>
              <span className="sm:hidden">Bookings</span>
            </TabsTrigger>
            <TabsTrigger
              value="providers"
              className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-semibold transition-all"
            >
              <Users className="h-5 w-5" />
              <span className="hidden sm:inline">Providers</span>
              <span className="sm:hidden">Providers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quote" className="mt-0">
            <QuoteEstimatorSection />
          </TabsContent>

          <TabsContent value="bookings" className="mt-0">
            {isAuthenticated ? (
              <BookingsSection />
            ) : (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg text-muted-foreground">
                  Please login to view your bookings
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="providers" className="mt-0">
            <ProvidersSection />
          </TabsContent>
        </Tabs>
      </section>

      <section id="reviews">
        <TestimonialsSection />
      </section>

      <FAQSection />
    </div>
  );
}
