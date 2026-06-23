import { Card, CardContent } from "@/components/ui/card";
import { Container, Package, Truck } from "lucide-react";

export default function VehicleOptionsSection() {
  const vehicles = [
    {
      name: "Mini Van / Tata Ace",
      icon: Package,
      capacity: "Up to 1 RK / Few Items",
      dimensions: "7ft x 4ft x 4ft",
      idealFor: "Small moves, few items, studio apartments",
      basePrice: "₹2,500 - ₹4,000",
    },
    {
      name: "Pickup / Medium Tempo",
      icon: Truck,
      capacity: "1-2 BHK",
      dimensions: "10ft x 6ft x 6ft",
      idealFor: "Medium-sized homes, 1-2 bedroom apartments",
      basePrice: "₹4,500 - ₹7,000",
    },
    {
      name: "Large Truck",
      icon: Container,
      capacity: "2-3 BHK / Office",
      dimensions: "14ft x 7ft x 7ft",
      idealFor: "Large homes, offices, commercial spaces",
      basePrice: "₹7,500 - ₹12,000",
    },
  ];

  return (
    <section
      id="book-a-truck"
      className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Choose Your Vehicle
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the perfect truck size for your shifting needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {vehicles.map((vehicle, _index) => {
            const IconComponent = vehicle.icon;
            return (
              <Card
                key={vehicle.name}
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="relative inline-flex items-center justify-center w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl group-hover:scale-110 transition-transform">
                      <IconComponent className="w-12 h-12 md:w-14 md:h-14 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-3 text-center">
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      {vehicle.name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        Capacity: {vehicle.capacity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dimensions: {vehicle.dimensions}
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        {vehicle.idealFor}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-lg font-bold text-primary">
                        {vehicle.basePrice}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Base price (varies by distance)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            All vehicles come with professional drivers and helpers. Prices
            include GST and may vary based on distance, add-on services, and
            time slot.
          </p>
        </div>
      </div>
    </section>
  );
}
