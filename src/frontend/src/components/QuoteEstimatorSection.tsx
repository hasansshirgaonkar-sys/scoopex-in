import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Principal } from "@icp-sdk/core/principal";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Home,
  IndianRupee,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import type { InstantQuoteRequest, MoveType } from "../backend";
import {
  useCreateBooking,
  useCreateInstantQuote,
  useCreateRazorpayOrder,
  useVerifyRazorpayPayment,
} from "../hooks/useQueries";
import BookingDetailsModal, {
  type BookingFormData,
} from "./BookingDetailsModal";
import PaymentSuccessScreen from "./PaymentSuccessScreen";
import QuoteSummaryDialog from "./QuoteSummaryDialog";

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  "AIzaSyCVFEHMSwdQEIj3ddHYuCSUzEcz8FUwDpk";
const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_SA39OGtyhiRQhd";

const MUMBAI_KARJAT_BOUNDS = {
  north: 19.4,
  south: 18.7,
  east: 73.45,
  west: 72.85,
};

// Default advance percentage (25% as median of 20-30% range)
const DEFAULT_ADVANCE_PERCENTAGE = 25;

interface VehicleOption {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: "miniVan",
    name: "Mini Van",
    basePrice: 3000,
    description: "Perfect for small moves",
  },
  {
    id: "mediumTempo",
    name: "Pickup / Medium Tempo",
    basePrice: 5000,
    description: "Ideal for 1-2 BHK",
  },
  {
    id: "largeTempo",
    name: "Large Tempo",
    basePrice: 8000,
    description: "Best for 3+ BHK",
  },
];

interface AddOnService {
  id: string;
  name: string;
  price: number;
}

const ADD_ON_SERVICES: AddOnService[] = [
  { id: "packing", name: "Packing", price: 1500 },
  { id: "loading", name: "Loading & Unloading", price: 1000 },
  { id: "insurance", name: "Insurance", price: 500 },
  { id: "storage", name: "Storage", price: 2000 },
];

interface MapLocation {
  address: string;
  lat: number;
  lng: number;
}

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function QuoteEstimatorSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState<MapLocation>({
    address: "",
    lat: 0,
    lng: 0,
  });
  const [dropOffLocation, setDropOffLocation] = useState<MapLocation>({
    address: "",
    lat: 0,
    lng: 0,
  });
  const [moveType, setMoveType] = useState<string>("1bhk");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("mediumTempo");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [moveDate, setMoveDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>("morning");
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [quoteResult, setQuoteResult] = useState<InstantQuoteRequest | null>(
    null,
  );
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [bookingFormData, setBookingFormData] =
    useState<BookingFormData | null>(null);
  const [currentBookingId, setCurrentBookingId] = useState<string>("");
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const dropOffMarkerRef = useRef<google.maps.Marker | null>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropOffInputRef = useRef<HTMLInputElement>(null);
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null,
  );
  const dropOffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null,
  );

  const createInstantQuote = useCreateInstantQuote();
  const createBooking = useCreateBooking();
  const createRazorpayOrder = useCreateRazorpayOrder();
  const verifyRazorpayPayment = useVerifyRazorpayPayment();

  // Load Google Maps API
  useEffect(() => {
    if (window.google?.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geocoding&callback=initGoogleMapsEstimator`;
    script.async = true;
    script.defer = true;

    window.initGoogleMapsEstimator = () => {
      setIsGoogleMapsLoaded(true);
    };

    script.onerror = () => {
      toast.error("Failed to load Google Maps. Please refresh the page.");
    };

    document.head.appendChild(script);

    return () => {
      window.initGoogleMapsEstimator = undefined;
    };
  }, []);

  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Initialize map and autocomplete
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapRef.current) return;

    try {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 19.076, lng: 72.8777 },
        zoom: 10,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: "greedy",
      });

      googleMapRef.current = map;

      if (pickupInputRef.current && !pickupAutocompleteRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(
          pickupInputRef.current,
          {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(
                MUMBAI_KARJAT_BOUNDS.south,
                MUMBAI_KARJAT_BOUNDS.west,
              ),
              new google.maps.LatLng(
                MUMBAI_KARJAT_BOUNDS.north,
                MUMBAI_KARJAT_BOUNDS.east,
              ),
            ),
            componentRestrictions: { country: "in" },
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
          },
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || place.name || "";

            setPickupLocation({ address, lat, lng });
            updatePickupMarker(lat, lng, address);
            toast.success("Pickup location selected");
          }
        });

        pickupAutocompleteRef.current = autocomplete;
      }

      if (dropOffInputRef.current && !dropOffAutocompleteRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(
          dropOffInputRef.current,
          {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(
                MUMBAI_KARJAT_BOUNDS.south,
                MUMBAI_KARJAT_BOUNDS.west,
              ),
              new google.maps.LatLng(
                MUMBAI_KARJAT_BOUNDS.north,
                MUMBAI_KARJAT_BOUNDS.east,
              ),
            ),
            componentRestrictions: { country: "in" },
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
          },
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || place.name || "";

            setDropOffLocation({ address, lat, lng });
            updateDropOffMarker(lat, lng, address);
            toast.success("Drop-off location selected");
          }
        });

        dropOffAutocompleteRef.current = autocomplete;
      }

      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          reverseGeocode(lat, lng).then((address) => {
            if (pickupLocation.lat === 0) {
              setPickupLocation({ address, lat, lng });
              if (pickupInputRef.current) {
                pickupInputRef.current.value = address;
              }
              updatePickupMarker(lat, lng, address);
              toast.success("Pickup location set from map");
            } else if (dropOffLocation.lat === 0) {
              setDropOffLocation({ address, lat, lng });
              if (dropOffInputRef.current) {
                dropOffInputRef.current.value = address;
              }
              updateDropOffMarker(lat, lng, address);
              toast.success("Drop-off location set from map");
            } else {
              toast.info(
                "Both locations already set. Clear one to set a new location.",
              );
            }
          });
        }
      });
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      toast.error("Failed to initialize map");
    }
  }, [isGoogleMapsLoaded, pickupLocation.lat, dropOffLocation.lat]);

  useEffect(() => {
    if (
      pickupLocation.lat !== 0 &&
      dropOffLocation.lat !== 0 &&
      googleMapRef.current
    ) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(
        new google.maps.LatLng(pickupLocation.lat, pickupLocation.lng),
      );
      bounds.extend(
        new google.maps.LatLng(dropOffLocation.lat, dropOffLocation.lng),
      );
      googleMapRef.current.fitBounds(bounds);
    }
  }, [pickupLocation, dropOffLocation]);

  const updatePickupMarker = (lat: number, lng: number, address: string) => {
    if (!googleMapRef.current) return;

    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null);
    }

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: googleMapRef.current,
      title: "Pickup Location",
      label: "P",
      animation: google.maps.Animation.DROP,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="padding: 8px;"><strong>Pickup:</strong><br/>${address}</div>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(googleMapRef.current!, marker);
    });

    pickupMarkerRef.current = marker;
    googleMapRef.current.panTo({ lat, lng });
  };

  const updateDropOffMarker = (lat: number, lng: number, address: string) => {
    if (!googleMapRef.current) return;

    if (dropOffMarkerRef.current) {
      dropOffMarkerRef.current.setMap(null);
    }

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: googleMapRef.current,
      title: "Drop-off Location",
      label: "D",
      animation: google.maps.Animation.DROP,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="padding: 8px;"><strong>Drop-off:</strong><br/>${address}</div>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(googleMapRef.current!, marker);
    });

    dropOffMarkerRef.current = marker;
  };

  const detectCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    toast.info("Detecting your current location with high accuracy...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const address = await reverseGeocode(latitude, longitude);

          setPickupLocation({ address, lat: latitude, lng: longitude });
          if (pickupInputRef.current) {
            pickupInputRef.current.value = address;
          }
          updatePickupMarker(latitude, longitude, address);

          toast.success("Current location detected and set as pickup point!");
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          toast.error("Could not determine address from your location");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Location access denied. Please enable location permissions or enter address manually.",
            );
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error(
              "Location information unavailable. Please enter address manually.",
            );
            break;
          case error.TIMEOUT:
            toast.error(
              "Location request timed out. Please try again or enter address manually.",
            );
            break;
          default:
            toast.error(
              "Failed to detect location. Please enter address manually.",
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error("Google Maps not loaded"));
        return;
      }

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  };

  const clearPickupLocation = () => {
    setPickupLocation({ address: "", lat: 0, lng: 0 });
    if (pickupInputRef.current) {
      pickupInputRef.current.value = "";
    }
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null);
      pickupMarkerRef.current = null;
    }
  };

  const clearDropOffLocation = () => {
    setDropOffLocation({ address: "", lat: 0, lng: 0 });
    if (dropOffInputRef.current) {
      dropOffInputRef.current.value = "";
    }
    if (dropOffMarkerRef.current) {
      dropOffMarkerRef.current.setMap(null);
      dropOffMarkerRef.current = null;
    }
  };

  const calculatePriceBreakdown = () => {
    const vehicle = VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle);
    const baseFare = vehicle?.basePrice || 0;

    const goodsTypePrice =
      moveType === "rk"
        ? 500
        : moveType === "1bhk"
          ? 1000
          : moveType === "2bhk"
            ? 2000
            : 3000;
    const vehiclePrice = baseFare;
    const addOnsPrice = selectedAddOns.reduce((sum, addonId) => {
      const addon = ADD_ON_SERVICES.find((a) => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    const distancePrice = 2500;
    const timeSlotPrice = timeSlot === "night" ? 300 : 0;

    const totalPrice =
      baseFare +
      goodsTypePrice +
      vehiclePrice +
      addOnsPrice +
      distancePrice +
      timeSlotPrice;
    const advanceAmount = Math.floor(
      (totalPrice * DEFAULT_ADVANCE_PERCENTAGE) / 100,
    );
    const remainingBalance = totalPrice - advanceAmount;

    return {
      baseFare,
      goodsType: goodsTypePrice,
      vehicleType: vehiclePrice,
      addOns: addOnsPrice,
      distance: distancePrice,
      timeSlot: timeSlotPrice,
      bulkDiscount: 0,
      finalPrice: totalPrice,
      advanceAmount,
      advancePercentage: DEFAULT_ADVANCE_PERCENTAGE,
      remainingBalance,
    };
  };

  const priceBreakdown = calculatePriceBreakdown();

  const handleNext = () => {
    if (currentStep === 1) {
      if (pickupLocation.lat === 0 || dropOffLocation.lat === 0) {
        toast.error("Please select both pickup and drop-off locations");
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookNow = async () => {
    if (!moveDate) {
      toast.error("Please select a move date");
      return;
    }

    setQuoteError(null);

    const moveTypeValue: MoveType =
      moveType === "rk"
        ? { __kind__: "rk", rk: null }
        : moveType === "office"
          ? { __kind__: "office", office: null }
          : {
              __kind__: "bhk",
              bhk: {
                size:
                  moveType === "1bhk"
                    ? "1-2 BHK"
                    : moveType === "2bhk"
                      ? "2-3 BHK"
                      : "1-2 BHK",
              },
            };

    const schedule = `${format(moveDate, "PPP")} - ${timeSlot === "morning" ? "Morning" : timeSlot === "afternoon" ? "Afternoon" : "Night"}`;

    try {
      const result = await createInstantQuote.mutateAsync({
        pickupLocation: pickupLocation.address,
        dropOffLocation: dropOffLocation.address,
        moveType: moveTypeValue,
        vehicleType: selectedVehicle,
        addOnServices: selectedAddOns,
        schedule,
        advancePercentage: DEFAULT_ADVANCE_PERCENTAGE,
      });

      setQuoteResult(result);
      setShowSummaryDialog(true);
      toast.success("Quote created successfully!");
    } catch (error) {
      console.error("Quote error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create quote. Please try again.";
      setQuoteError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleRetryQuote = () => {
    setQuoteError(null);
    handleBookNow();
  };

  const handleConfirmBooking = () => {
    setShowSummaryDialog(false);
    setShowBookingModal(true);
  };

  const handleModifyQuote = () => {
    setShowSummaryDialog(false);
    setCurrentStep(1);
    toast.info("You can now modify your quote");
  };

  const handleProceedToPayment = async (bookingDetails: BookingFormData) => {
    if (!quoteResult) {
      toast.error("Quote data not available");
      return;
    }

    try {
      // Create booking with dummy service provider (in production, this would be selected)
      const dummyProvider = Principal.fromText("aaaaa-aa");
      const booking = await createBooking.mutateAsync({
        quoteId: "temp-quote-id",
        serviceProvider: dummyProvider,
      });

      setCurrentBookingId(booking.id);
      setBookingFormData(bookingDetails);

      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder.mutateAsync(booking.id);

      const advanceAmount = Number(quoteResult.advanceAmount);
      const advanceAmountInPaisa = advanceAmount * 100;

      // Open Razorpay checkout with live key
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: advanceAmountInPaisa,
        currency: "INR",
        name: "SCOOPEX SHIFT",
        description: `Advance payment for shifting (${DEFAULT_ADVANCE_PERCENTAGE}% of total)`,
        order_id: razorpayOrder.orderId,
        prefill: {
          name: bookingDetails.customerName,
          contact: bookingDetails.mobileNumber,
        },
        notes: {
          pickup: bookingDetails.pickupAddress,
          dropOff: bookingDetails.dropOffAddress,
          vehicleType: bookingDetails.vehicleType,
          advancePercentage: DEFAULT_ADVANCE_PERCENTAGE.toString(),
        },
        theme: {
          color: "#003D91",
        },
        handler: async (response: any) => {
          // Show verifying state
          setIsVerifyingPayment(true);
          toast.info("Verifying payment...");

          try {
            // Automatically verify payment with backend
            const verificationResult = await verifyRazorpayPayment.mutateAsync({
              bookingId: booking.id,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            if (verificationResult) {
              // Close booking modal
              setShowBookingModal(false);
              setIsVerifyingPayment(false);

              // Navigate to success screen
              setShowPaymentSuccess(true);
              toast.success("Payment verified! Booking confirmed.");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            setIsVerifyingPayment(false);
            console.error("Payment verification error:", error);
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Payment verification failed. Please contact support.";
            toast.error(errorMessage);
          }
        },
        modal: {
          ondismiss: () => {
            setIsVerifyingPayment(false);
            toast.error("Payment cancelled. Your booking is still pending.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again.";
      toast.error(errorMessage);
    }
  };

  const _handleWhatsAppQuote = () => {
    const vehicle = VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle);
    const message = `Hi! I need a quote for moving from ${pickupLocation.address} to ${dropOffLocation.address}. Move type: ${moveType}, Vehicle: ${vehicle?.name}, Total: ₹${priceBreakdown.finalPrice}`;
    const whatsappUrl = `https://wa.me/918108140307?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleTrackBooking = () => {
    toast.info("Tracking feature coming soon!");
  };

  const handleWhatsAppSupport = () => {
    const message = `Hi! I need support for my booking ID: ${currentBookingId}`;
    const whatsappUrl = `https://wa.me/918108140307?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleNewBooking = () => {
    setShowPaymentSuccess(false);
    setQuoteResult(null);
    setCurrentBookingId("");
    setBookingFormData(null);
    setCurrentStep(1);
    setPickupLocation({ address: "", lat: 0, lng: 0 });
    setDropOffLocation({ address: "", lat: 0, lng: 0 });
    setMoveDate(undefined);
    setSelectedAddOns([]);
    toast.info("Ready for a new booking!");
  };

  if (showPaymentSuccess && bookingFormData && quoteResult) {
    return (
      <PaymentSuccessScreen
        bookingId={currentBookingId}
        bookingDetails={bookingFormData}
        totalAmount={Number(quoteResult.totalPrice)}
        advanceAmount={Number(quoteResult.advanceAmount)}
        balanceAmount={
          Number(quoteResult.totalPrice) - Number(quoteResult.advanceAmount)
        }
        advancePercentage={Number(quoteResult.advancePercentage)}
        onTrackBooking={handleTrackBooking}
        onWhatsAppSupport={handleWhatsAppSupport}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <IndianRupee className="h-7 w-7 text-primary" />
              </div>
              Unified Quote Estimator
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Get accurate pricing in 5 simple steps with Google Maps
              integration. 100% Transparent | No Hidden Charges
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {quoteError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{quoteError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryQuote}
                    disabled={createInstantQuote.isPending}
                  >
                    {createInstantQuote.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      "Retry"
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {isVerifyingPayment && (
              <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <AlertDescription className="text-blue-900 dark:text-blue-300">
                  Verifying your payment with backend... Please wait.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg transition-all shadow-md",
                          currentStep >= step
                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {step}
                      </div>
                      {step < 5 && (
                        <div
                          className={cn(
                            "h-1 w-8 sm:w-12 mx-1 sm:mx-2 transition-all",
                            currentStep > step ? "bg-primary" : "bg-muted",
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 pb-2 border-b border-primary/20">
                      <MapPin className="h-6 w-6 text-primary" />
                      Step 1: Location Details
                    </h3>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Interactive Map
                      </Label>
                      <div
                        ref={mapRef}
                        className="w-full h-[350px] rounded-xl border-2 border-primary/20 overflow-hidden shadow-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Click on the map to set locations, or use the search
                        fields below
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="pickup"
                        className="text-base font-semibold flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        Pickup Location
                      </Label>
                      <div className="relative">
                        <Input
                          ref={pickupInputRef}
                          id="pickup"
                          placeholder="Search or click map for pickup location..."
                          autoComplete="off"
                          className="h-12 text-base pr-10"
                        />
                        {pickupLocation.lat !== 0 && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={detectCurrentLocation}
                          disabled={isDetectingLocation}
                          className="flex-1"
                        >
                          {isDetectingLocation ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Detecting...
                            </>
                          ) : (
                            <>
                              <Navigation className="h-4 w-4 mr-2" />
                              Use Current Location
                            </>
                          )}
                        </Button>
                        {pickupLocation.lat !== 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearPickupLocation}
                          >
                            Clear
                          </Button>
                        )}
                      </div>

                      {pickupLocation.address && pickupLocation.lat !== 0 && (
                        <div className="text-sm font-medium text-foreground bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-900">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-xs text-green-700 dark:text-green-400 font-bold mb-1">
                                Selected Pickup:
                              </div>
                              <div className="text-sm text-green-900 dark:text-green-300">
                                {pickupLocation.address}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="dropoff"
                        className="text-base font-semibold flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-destructive" />
                        Drop-off Location
                      </Label>
                      <div className="relative">
                        <Input
                          ref={dropOffInputRef}
                          id="dropoff"
                          placeholder="Search or click map for drop-off location..."
                          autoComplete="off"
                          className="h-12 text-base pr-10"
                        />
                        {dropOffLocation.lat !== 0 && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                        )}
                      </div>

                      {dropOffLocation.lat !== 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearDropOffLocation}
                        >
                          Clear
                        </Button>
                      )}

                      {dropOffLocation.address && dropOffLocation.lat !== 0 && (
                        <div className="text-sm font-medium text-foreground bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-900">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-xs text-green-700 dark:text-green-400 font-bold mb-1">
                                Selected Drop-off:
                              </div>
                              <div className="text-sm text-green-900 dark:text-green-300">
                                {dropOffLocation.address}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 pb-2 border-b border-primary/20">
                      <Home className="h-6 w-6 text-primary" />
                      Step 2: Move Type
                    </h3>
                    <RadioGroup value={moveType} onValueChange={setMoveType}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all">
                          <RadioGroupItem value="rk" id="rk" />
                          <Label htmlFor="rk" className="flex-1 cursor-pointer">
                            <div className="font-semibold text-base">
                              1 RK / Few items
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Small apartment or minimal items
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all">
                          <RadioGroupItem value="1bhk" id="1bhk" />
                          <Label
                            htmlFor="1bhk"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold text-base">
                              1–2 BHK
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Standard apartment move
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all">
                          <RadioGroupItem value="2bhk" id="2bhk" />
                          <Label
                            htmlFor="2bhk"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold text-base">
                              2–3 BHK
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Large apartment or house
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all">
                          <RadioGroupItem value="office" id="office" />
                          <Label
                            htmlFor="office"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-semibold text-base">
                              Office / Commercial
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Business relocation
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 pb-2 border-b border-primary/20">
                      <Truck className="h-6 w-6 text-primary" />
                      Step 3: Vehicle Selection
                    </h3>
                    <RadioGroup
                      value={selectedVehicle}
                      onValueChange={setSelectedVehicle}
                    >
                      <div className="space-y-3">
                        {VEHICLE_OPTIONS.map((vehicle) => (
                          <div
                            key={vehicle.id}
                            className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all"
                          >
                            <RadioGroupItem
                              value={vehicle.id}
                              id={vehicle.id}
                            />
                            <Label
                              htmlFor={vehicle.id}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold text-base">
                                    {vehicle.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {vehicle.description}
                                  </div>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="text-base px-3 py-1"
                                >
                                  ₹{vehicle.basePrice}
                                </Badge>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 pb-2 border-b border-primary/20">
                      <Package className="h-6 w-6 text-primary" />
                      Step 4: Add-On Services
                    </h3>
                    <div className="space-y-3">
                      {ADD_ON_SERVICES.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 transition-all"
                        >
                          <Checkbox
                            id={addon.id}
                            checked={selectedAddOns.includes(addon.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAddOns([
                                  ...selectedAddOns,
                                  addon.id,
                                ]);
                              } else {
                                setSelectedAddOns(
                                  selectedAddOns.filter(
                                    (id) => id !== addon.id,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={addon.id}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-base">
                                {addon.name}
                              </div>
                              <Badge
                                variant="outline"
                                className="text-base px-3 py-1"
                              >
                                +₹{addon.price}
                              </Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 pb-2 border-b border-primary/20">
                      <CalendarIcon className="h-6 w-6 text-primary" />
                      Step 5: Schedule Your Move
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">
                          Move Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-12 text-base",
                                !moveDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-5 w-5" />
                              {moveDate
                                ? format(moveDate, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={moveDate}
                              onSelect={setMoveDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">
                          Time Slot
                        </Label>
                        <RadioGroup
                          value={timeSlot}
                          onValueChange={setTimeSlot}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all">
                              <RadioGroupItem value="morning" id="morning" />
                              <Label
                                htmlFor="morning"
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="font-semibold text-base">
                                    Morning
                                  </div>
                                  <Clock className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all">
                              <RadioGroupItem
                                value="afternoon"
                                id="afternoon"
                              />
                              <Label
                                htmlFor="afternoon"
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="font-semibold text-base">
                                    Afternoon
                                  </div>
                                  <Clock className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border-2 rounded-xl p-5 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all">
                              <RadioGroupItem value="night" id="night" />
                              <Label
                                htmlFor="night"
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="font-semibold text-base">
                                    Night
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="text-base px-3 py-1"
                                  >
                                    +₹300
                                  </Badge>
                                </div>
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 h-12 text-base font-semibold"
                    >
                      Back
                    </Button>
                  )}
                  {currentStep < 5 ? (
                    <Button
                      onClick={handleNext}
                      className="flex-1 h-12 text-base font-semibold"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleBookNow}
                      className="flex-1 h-12 text-base font-semibold"
                      disabled={createInstantQuote.isPending}
                    >
                      {createInstantQuote.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Quote...
                        </>
                      ) : (
                        "Get Final Quote"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-br from-primary/5 to-background">
                    <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-lg">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <IndianRupee className="h-5 w-5" />
                        Live Price Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Base Fare
                          </span>
                          <span className="font-semibold">
                            ₹{priceBreakdown.baseFare}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Vehicle + Distance
                          </span>
                          <span className="font-semibold">
                            ₹
                            {priceBreakdown.vehicleType +
                              priceBreakdown.distance}
                          </span>
                        </div>
                        {priceBreakdown.addOns > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Add-on Services
                            </span>
                            <span className="font-semibold">
                              ₹{priceBreakdown.addOns}
                            </span>
                          </div>
                        )}
                        {priceBreakdown.timeSlot > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Night Slot
                            </span>
                            <span className="font-semibold">
                              ₹{priceBreakdown.timeSlot}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between font-bold text-xl">
                        <span>Estimated Total</span>
                        <span className="text-primary">
                          ₹{priceBreakdown.finalPrice}
                        </span>
                      </div>

                      <Separator />

                      <div className="space-y-3 bg-primary/10 p-4 rounded-xl border border-primary/20">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">
                            Advance to Confirm (
                            {priceBreakdown.advancePercentage}%)
                          </span>
                          <span className="font-bold text-primary text-base">
                            ₹{priceBreakdown.advanceAmount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">Pay After Move</span>
                          <span className="font-semibold">
                            ₹{priceBreakdown.remainingBalance}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-center text-muted-foreground pt-3 border-t border-border">
                        100% Transparent | No Hidden Charges
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {quoteResult && (
        <>
          <QuoteSummaryDialog
            open={showSummaryDialog}
            onOpenChange={setShowSummaryDialog}
            quoteData={quoteResult}
            onConfirmBooking={handleConfirmBooking}
            onModifyQuote={handleModifyQuote}
            isLoading={createInstantQuote.isPending}
          />

          <BookingDetailsModal
            open={showBookingModal}
            onOpenChange={setShowBookingModal}
            quoteData={quoteResult}
            onProceedToPayment={handleProceedToPayment}
            isProcessing={
              createBooking.isPending ||
              createRazorpayOrder.isPending ||
              isVerifyingPayment
            }
          />
        </>
      )}
    </>
  );
}
