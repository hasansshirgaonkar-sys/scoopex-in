import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Principal } from "@icp-sdk/core/principal";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  MapPin,
  Package,
  Weight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DeliveryType } from "../backend";
import type { Quote } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateBooking,
  useGetServiceProviderProfiles,
} from "../hooks/useQueries";
import AdvancePaymentDialog from "./AdvancePaymentDialog";

interface QuoteResultCardProps {
  quote: Quote;
}

export default function QuoteResultCard({ quote }: QuoteResultCardProps) {
  const { identity } = useInternetIdentity();
  const { data: providers = [] } = useGetServiceProviderProfiles();
  const createBooking = useCreateBooking();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  const isAuthenticated = !!identity;
  const estimatedPrice = Number(quote.estimatedPrice);
  const distance = Number(quote.distance) / 1000;

  const deliveryTypeLabels: Record<DeliveryType, string> = {
    [DeliveryType.smallPackage]: "Small Package",
    [DeliveryType.mediumPackage]: "Medium Package",
    [DeliveryType.largePackage]: "Large Package",
    [DeliveryType.furniture]: "Furniture",
    [DeliveryType.appliance]: "Appliance",
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a service");
      return;
    }
    setShowBookingDialog(true);
  };

  const handlePayAdvance = () => {
    if (!isAuthenticated) {
      toast.error("Please login to make a payment");
      return;
    }
    setShowPaymentDialog(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedProvider) {
      toast.error("Please select a service provider");
      return;
    }

    try {
      const providerPrincipal = Principal.fromText(selectedProvider);
      await createBooking.mutateAsync({
        quoteId: quote.id,
        serviceProvider: providerPrincipal,
      });
      toast.success("Booking created successfully!");
      setShowBookingDialog(false);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking");
    }
  };

  return (
    <>
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Your Quote is Ready
              </CardTitle>
              <CardDescription>Quote ID: {quote.id}</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg font-bold px-4 py-2">
              ₹{estimatedPrice}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                Pickup Location
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {quote.pickupLocation.address}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-destructive" />
                Drop-off Location
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {quote.dropOffLocation.address}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Delivery Type</div>
                <div className="text-sm text-muted-foreground">
                  {deliveryTypeLabels[quote.deliveryType]}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Weight className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Weight Range</div>
                <div className="text-sm text-muted-foreground">
                  {quote.weightRange.rangeLabel}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IndianRupee className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Estimated Distance</div>
                <div className="text-sm text-muted-foreground">
                  {distance.toFixed(1)} km
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Quote Date</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(
                    Number(quote.timestamp) / 1000000,
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={handlePayAdvance}
            className="w-full bg-gradient-to-r from-primary via-[oklch(0.55_0.20_240)] to-accent hover:opacity-90 transition-opacity"
            size="lg"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Advance
          </Button>
          <Button
            onClick={handleBookNow}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {isAuthenticated ? "Book Now" : "Login to Book"}
          </Button>
        </CardFooter>
      </Card>

      <AdvancePaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        quote={quote}
        estimatedPrice={estimatedPrice}
        distance={distance}
        deliveryTypeLabel={deliveryTypeLabels[quote.deliveryType]}
      />

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Select a service provider to complete your booking for ₹
              {estimatedPrice}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Service Provider</Label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No providers available
                    </SelectItem>
                  ) : (
                    providers.map((provider, index) => (
                      <SelectItem
                        key={
                          typeof provider.id === "object" &&
                          provider.id !== null &&
                          "toText" in provider.id
                            ? provider.id.toText()
                            : `provider-${index}`
                        }
                        value={`provider-${index}`}
                      >
                        {provider.name} - {provider.contactInfo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Package Type:</span>
                <span className="font-medium">
                  {deliveryTypeLabels[quote.deliveryType]}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Weight Range:</span>
                <span className="font-medium">
                  {quote.weightRange.rangeLabel}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Distance:</span>
                <span className="font-medium">{distance.toFixed(1)} km</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary">₹{estimatedPrice}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={createBooking.isPending || !selectedProvider}
            >
              {createBooking.isPending ? "Creating..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
