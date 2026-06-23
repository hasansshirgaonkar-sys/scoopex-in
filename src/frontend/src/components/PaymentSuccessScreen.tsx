import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  IndianRupee,
  MapPin,
  MapPinned,
  MessageCircle,
  Truck,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { BookingFormData } from "./BookingDetailsModal";

interface PaymentSuccessScreenProps {
  bookingId: string;
  bookingDetails: BookingFormData;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  advancePercentage: number;
  onTrackBooking: () => void;
  onWhatsAppSupport: () => void;
  onNewBooking: () => void;
}

export default function PaymentSuccessScreen({
  bookingId,
  bookingDetails,
  totalAmount,
  advanceAmount,
  balanceAmount,
  advancePercentage,
  onTrackBooking,
  onWhatsAppSupport,
  onNewBooking,
}: PaymentSuccessScreenProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-green-200 dark:border-green-900 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-green-900 dark:text-green-100">
                  Booking Confirmed!
                </CardTitle>
                <CardDescription className="text-base mt-2 text-green-700 dark:text-green-300">
                  Your advance payment of ₹{advanceAmount} ({advancePercentage}%
                  of total) has been received successfully
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Booking ID */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
            <span className="font-semibold">Booking ID:</span>
            <Badge variant="secondary" className="text-lg px-4 py-1 font-mono">
              {bookingId}
            </Badge>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Booking Details</h3>

            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Pickup Location
                  </div>
                  <div className="text-sm font-semibold mt-1">
                    {bookingDetails.pickupAddress}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <MapPinned className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    Drop-off Location
                  </div>
                  <div className="text-sm font-semibold mt-1">
                    {bookingDetails.dropOffAddress}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Shift Date
                    </div>
                    <div className="text-sm font-semibold mt-1">
                      {format(bookingDetails.shiftDate, "PPP")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Vehicle Type
                    </div>
                    <div className="text-sm font-semibold mt-1">
                      {bookingDetails.vehicleType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Payment Summary
            </h3>

            <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-5 space-y-3 border border-primary/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Total Estimated Cost:
                </span>
                <span className="font-semibold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Advance Paid ({advancePercentage}%):
                </span>
                <span className="font-semibold text-green-600">
                  ₹{advanceAmount}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Balance Payable:</span>
                <span className="text-primary">₹{balanceAmount}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center pt-2">
                Balance can be paid via Cash/UPI with driver after shift
                completion
              </p>
            </div>
          </div>

          <Separator />

          {/* Status Message */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">
                  Driver Assignment in Progress
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  We're assigning the best driver for your shift. You'll receive
                  confirmation via SMS and WhatsApp shortly.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 md:grid-cols-2 pt-4">
            <Button
              onClick={onTrackBooking}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              <MapPinned className="mr-2 h-5 w-5" />
              Track Booking
            </Button>
            <Button
              onClick={onWhatsAppSupport}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <SiWhatsapp className="mr-2 h-5 w-5 text-green-600" />
              WhatsApp Support
            </Button>
          </div>

          <Button onClick={onNewBooking} variant="ghost" className="w-full">
            Create New Booking
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
