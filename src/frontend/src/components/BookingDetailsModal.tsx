import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  IndianRupee,
  Loader2,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { InstantQuoteRequest } from "../backend";

interface BookingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteData: InstantQuoteRequest;
  onProceedToPayment: (bookingDetails: BookingFormData) => void;
  isProcessing?: boolean;
}

export interface BookingFormData {
  customerName: string;
  mobileNumber: string;
  pickupAddress: string;
  dropOffAddress: string;
  shiftDate: Date;
  timeSlot: string;
  vehicleType: string;
}

const VEHICLE_OPTIONS = [
  { id: "miniVan", name: "Mini Van" },
  { id: "mediumTempo", name: "Pickup / Medium Tempo" },
  { id: "largeTempo", name: "Large Tempo" },
];

const TIME_SLOTS = [
  { id: "morning", name: "Morning (8 AM - 12 PM)" },
  { id: "afternoon", name: "Afternoon (12 PM - 5 PM)" },
  { id: "night", name: "Night (5 PM - 10 PM)" },
];

export default function BookingDetailsModal({
  open,
  onOpenChange,
  quoteData,
  onProceedToPayment,
  isProcessing = false,
}: BookingDetailsModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pickupAddress, setPickupAddress] = useState(quoteData.pickupLocation);
  const [dropOffAddress, setDropOffAddress] = useState(
    quoteData.dropOffLocation,
  );
  const [shiftDate, setShiftDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("morning");
  const [vehicleType, setVehicleType] = useState(quoteData.vehicleType);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const advanceAmount = Number(quoteData.advanceAmount);
  const advancePercentage = Number(quoteData.advancePercentage);
  const totalAmount = Number(quoteData.totalPrice);
  const balanceAmount = totalAmount - advanceAmount;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    if (!pickupAddress.trim()) {
      newErrors.pickupAddress = "Pickup address is required";
    }

    if (!dropOffAddress.trim()) {
      newErrors.dropOffAddress = "Drop-off address is required";
    }

    if (!shiftDate) {
      newErrors.shiftDate = "Shift date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const bookingDetails: BookingFormData = {
      customerName,
      mobileNumber,
      pickupAddress,
      dropOffAddress,
      shiftDate: shiftDate!,
      timeSlot,
      vehicleType,
    };

    onProceedToPayment(bookingDetails);
  };

  const _getVehicleLabel = (id: string) => {
    return VEHICLE_OPTIONS.find((v) => v.id === id)?.name || id;
  };

  const _getTimeSlotLabel = (id: string) => {
    return TIME_SLOTS.find((t) => t.id === id)?.name || id;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            Complete Your Booking
          </DialogTitle>
          <DialogDescription className="text-base">
            Fill in your details to confirm your booking with{" "}
            {advancePercentage}% advance payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Customer Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customerName"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={cn(errors.customerName && "border-destructive")}
                />
                {errors.customerName && (
                  <p className="text-xs text-destructive">
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-sm font-medium">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobileNumber"
                    placeholder="10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) =>
                      setMobileNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    className={cn(
                      "pl-10",
                      errors.mobileNumber && "border-destructive",
                    )}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-xs text-destructive">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress" className="text-sm font-medium">
                  Pickup Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pickupAddress"
                  placeholder="Enter pickup address"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className={cn(errors.pickupAddress && "border-destructive")}
                />
                {errors.pickupAddress && (
                  <p className="text-xs text-destructive">
                    {errors.pickupAddress}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropOffAddress" className="text-sm font-medium">
                  Drop-off Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dropOffAddress"
                  placeholder="Enter drop-off address"
                  value={dropOffAddress}
                  onChange={(e) => setDropOffAddress(e.target.value)}
                  className={cn(errors.dropOffAddress && "border-destructive")}
                />
                {errors.dropOffAddress && (
                  <p className="text-xs text-destructive">
                    {errors.dropOffAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Shift Schedule */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Shift Schedule
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Shift Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !shiftDate && "text-muted-foreground",
                        errors.shiftDate && "border-destructive",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {shiftDate ? format(shiftDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={shiftDate}
                      onSelect={setShiftDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.shiftDate && (
                  <p className="text-xs text-destructive">{errors.shiftDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot" className="text-sm font-medium">
                  Time Slot
                </Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger id="timeSlot">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle Type */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Vehicle Type
            </h3>

            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_OPTIONS.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Booking Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Booking Summary
            </h3>

            <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-5 space-y-4 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Estimated Total Cost:
                </span>
                <span className="font-bold text-xl">₹{totalAmount}</span>
              </div>

              <Separator />

              <div className="space-y-3 bg-background/80 p-4 rounded-lg border border-primary/30">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    Advance Payable Today ({advancePercentage}%):
                  </span>
                  <span className="font-bold text-primary text-xl">
                    ₹{advanceAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Balance After Shift:</span>
                  <span className="font-medium text-lg">₹{balanceAmount}</span>
                </div>
              </div>

              <Badge
                variant="outline"
                className="w-full justify-center py-2 text-sm bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
              >
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                No hidden charges | {advancePercentage}% Advance Payment
              </Badge>
            </div>
          </div>

          {/* Important Notes */}
          <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm space-y-2">
              <p className="font-semibold text-amber-900 dark:text-amber-300">
                Important Information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-400">
                <li>Driver availability subject to confirmation</li>
                <li>Advance is non-refundable after driver assignment</li>
                <li>Balance payment can be made via Cash/UPI with driver</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceed}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IndianRupee className="mr-2 h-5 w-5" />
                Pay ₹{advanceAmount} & Confirm Booking
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
