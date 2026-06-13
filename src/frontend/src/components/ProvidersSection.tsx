import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Package, Phone, Users } from "lucide-react";
import { DeliveryType } from "../backend";
import { useGetServiceProviderProfiles } from "../hooks/useQueries";

export default function ProvidersSection() {
  const { data: providers = [], isLoading } = useGetServiceProviderProfiles();

  const deliveryTypeLabels: Record<DeliveryType, string> = {
    [DeliveryType.smallPackage]: "Small Package",
    [DeliveryType.mediumPackage]: "Medium Package",
    [DeliveryType.largePackage]: "Large Package",
    [DeliveryType.furniture]: "Furniture",
    [DeliveryType.appliance]: "Appliance",
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">
                Loading service providers...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  No service providers yet
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for available movers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Service Providers</h2>
          <p className="text-muted-foreground">
            Browse and connect with professional movers
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {providers.length} {providers.length === 1 ? "Provider" : "Providers"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {providers.map((provider) => (
          <Card
            key={provider.id.toText()}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {provider.contactInfo}
                    </CardDescription>
                  </div>
                </div>
                {provider.availability && (
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-700 dark:text-green-400"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Services Offered
                </div>
                <div className="flex flex-wrap gap-2">
                  {provider.servicesOffered.map((service) => (
                    <Badge key={service} variant="secondary">
                      {deliveryTypeLabels[service]}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Contact Provider
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
