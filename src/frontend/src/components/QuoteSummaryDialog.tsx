import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  IndianRupee,
  Loader2,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import type { InstantQuoteRequest } from "../backend";

interface QuoteSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteData: InstantQuoteRequest | null;
  onConfirmBooking: () => void;
  onModifyQuote: () => void;
  isLoading?: boolean;
}

export default function QuoteSummaryDialog({
  open,
  onOpenChange,
  quoteData,
  onConfirmBooking,
  onModifyQuote,
  isLoading = false,
}: QuoteSummaryDialogProps) {
  if (!quoteData) {
    return null;
  }

  const advanceAmount = Number(quoteData.advanceAmount);
  const advancePercentage = Number(quoteData.advancePercentage);
  const totalPrice = Number(quoteData.totalPrice);
  const remainingBalance = totalPrice - advanceAmount;

  const getMoveTypeLabel = () => {
    if (quoteData.moveType.__kind__ === "rk") return "1 RK / Few items";
    if (quoteData.moveType.__kind__ === "office") return "Office / Commercial";
    if (quoteData.moveType.__kind__ === "bhk") {
      return quoteData.moveType.bhk.size;
    }
    return "Unknown";
  };

  const getVehicleLabel = () => {
    const vehicleMap: Record<string, string> = {
      miniVan: "Mini Van",
      mediumTempo: "Pickup / Medium Tempo",
      largeTempo: "Large Tempo",
    };
    return vehicleMap[quoteData.vehicleType] || quoteData.vehicleType;
  };

  const getAddOnLabels = () => {
    const addOnMap: Record<string, string> = {
      packing: "Packing",
      loading: "Loading & Unloading",
      insurance: "Insurance",
      storage: "Storage",
    };
    return quoteData.addOnServices.map((id) => addOnMap[id] || id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              )}
            </div>
            {isLoading ? "Generating Quote..." : "Quote Summary"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isLoading
              ? "Please wait while we prepare your quote"
              : "Review your booking details before confirming"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground">
                Creating your personalized quote...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              {/* Location Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <MapPin className="h-4 w-4" />
                      Pickup Location
                    </div>
                    <p className="text-sm text-foreground pl-6">
                      {quoteData.pickupLocation}
                    </p>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                      <MapPin className="h-4 w-4" />
                      Drop-off Location
                    </div>
                    <p className="text-sm text-foreground pl-6">
                      {quoteData.dropOffLocation}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Move Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Move Details
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Move Type:</span>
                    <Badge variant="secondary">{getMoveTypeLabel()}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Vehicle:</span>
                    <Badge variant="secondary">{getVehicleLabel()}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 sm:col-span-2">
                    <span className="text-sm font-medium">Schedule:</span>
                    <Badge variant="secondary">{quoteData.schedule}</Badge>
                  </div>
                </div>
              </div>

              {/* Add-on Services */}
              {quoteData.addOnServices.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Add-on Services
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getAddOnLabels().map((label) => (
                        <Badge
                          key={label}
                          variant="outline"
                          className="text-sm"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  Price Breakdown
                </h3>
                <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-5 space-y-3 border border-primary/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Fare:</span>
                    <span className="font-medium">
                      ₹{Number(quoteData.priceBreakdown.baseFare)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle Type:</span>
                    <span className="font-medium">
                      ₹{Number(quoteData.priceBreakdown.vehicleType)}
                    </span>
                  </div>
                  {Number(quoteData.priceBreakdown.addOns) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Add-ons:</span>
                      <span className="font-medium">
                        ₹{Number(quoteData.priceBreakdown.addOns)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">
                      ₹{Number(quoteData.priceBreakdown.distance)}
                    </span>
                  </div>
                  {Number(quoteData.priceBreakdown.timeSlot) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Night Slot:</span>
                      <span className="font-medium">
                        ₹{Number(quoteData.priceBreakdown.timeSlot)}
                      </span>
                    </div>
                  )}

                  <Separator className="my-3" />

                  <div className="flex justify-between font-bold text-xl">
                    <span>Estimated Total:</span>
                    <span className="text-primary">₹{totalPrice}</span>
                  </div>

                  <Separator className="my-3" />

                  <div className="bg-background/80 p-4 rounded-lg space-y-2 border border-primary/30">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">
                        Advance to Confirm ({advancePercentage}%):
                      </span>
                      <span className="font-bold text-primary text-base">
                        ₹{advanceAmount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Pay After Move:</span>
                      <span className="font-medium">₹{remainingBalance}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground py-2 border-t border-border">
                100% Transparent | No Hidden Charges
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onModifyQuote}
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                Modify Quote
              </Button>
              <Button
                onClick={onConfirmBooking}
                className="w-full sm:flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                disabled={isLoading}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Pay ₹{advanceAmount} & Confirm Booking
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
