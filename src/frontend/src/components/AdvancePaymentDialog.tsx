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
  CreditCard,
  IndianRupee,
  Loader2,
  MapPin,
  Package,
  Weight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Quote } from "../backend";

interface AdvancePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote;
  estimatedPrice: number;
  distance: number;
  deliveryTypeLabel: string;
}

export default function AdvancePaymentDialog({
  open,
  onOpenChange,
  quote,
  estimatedPrice,
  distance,
  deliveryTypeLabel,
}: AdvancePaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate advance payment based on distance and service type
  const calculateAdvanceAmount = (): number => {
    // Local Shifting (< 20 km): ₹500–₹1,000
    if (distance < 20) {
      return Math.min(1000, Math.max(500, Math.floor(estimatedPrice * 0.1)));
    }
    // Medium Distance (20-50 km): ₹1,500–₹2,000
    if (distance < 50) {
      return Math.min(2000, Math.max(1500, Math.floor(estimatedPrice * 0.15)));
    }
    return Math.floor(estimatedPrice * 0.25);
  };

  const advanceAmount = calculateAdvanceAmount();
  const remainingAmount = estimatedPrice - advanceAmount;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate Razorpay payment integration
      // In production, this would initialize Razorpay checkout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful payment
      toast.success("Advance payment received. Your booking is confirmed!", {
        description: `Payment of ₹${advanceAmount} processed successfully`,
        duration: 5000,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Advance Payment
          </DialogTitle>
          <DialogDescription>
            Secure your booking with an advance payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Booking Details */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Booking ID</span>
              <Badge variant="outline">{quote.id}</Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Pickup</div>
                  <div className="text-sm font-medium">
                    {quote.pickupLocation.address}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-destructive mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Drop-off</div>
                  <div className="text-sm font-medium">
                    {quote.dropOffLocation.address}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    Vehicle Type
                  </div>
                  <div className="text-sm font-medium">{deliveryTypeLabel}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    Estimated Load
                  </div>
                  <div className="text-sm font-medium">
                    {quote.weightRange.rangeLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Estimate</span>
              <span className="font-medium">₹{estimatedPrice}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Distance</span>
              <span className="font-medium">{distance.toFixed(1)} km</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">Advance Payment</div>
                <div className="text-xs text-muted-foreground">
                  {distance < 20
                    ? "Local Shifting"
                    : distance < 50
                      ? "Medium Distance"
                      : "Full Shifting"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  ₹{advanceAmount}
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Remaining Amount</span>
              <span>₹{remainingAmount}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/assets/generated/razorpay-logo-transparent.dim_150x50.png"
                alt="Razorpay"
                className="h-6 object-contain"
              />
              <span className="text-sm text-muted-foreground">
                Secure Payment Gateway
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <img
                src="/assets/generated/payment-methods-icons-transparent.dim_200x100.png"
                alt="Payment Methods"
                className="h-8 object-contain opacity-70"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              Your payment is secured with 256-bit SSL encryption. The remaining
              amount will be collected after service completion.
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full sm:w-auto bg-gradient-to-r from-primary via-[oklch(0.55_0.20_240)] to-accent hover:opacity-90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IndianRupee className="mr-2 h-4 w-4" />
                Pay ₹{advanceAmount}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
