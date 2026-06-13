import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, IndianRupee, Package, User, Weight } from "lucide-react";
import { BookingStatus, DeliveryType } from "../backend";
import { useGetBookingsByCustomer } from "../hooks/useQueries";

export default function BookingsSection() {
  const { data: bookings = [], isLoading } = useGetBookingsByCustomer();

  const statusColors: Record<BookingStatus, string> = {
    [BookingStatus.pending]:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    [BookingStatus.confirmed]:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    [BookingStatus.inProgress]:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    [BookingStatus.completed]:
      "bg-green-500/10 text-green-700 dark:text-green-400",
    [BookingStatus.cancelled]: "bg-red-500/10 text-red-700 dark:text-red-400",
    [BookingStatus.pendingPayment]:
      "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  };

  const statusLabels: Record<BookingStatus, string> = {
    [BookingStatus.pending]: "Pending",
    [BookingStatus.confirmed]: "Confirmed",
    [BookingStatus.inProgress]: "In Progress",
    [BookingStatus.completed]: "Completed",
    [BookingStatus.cancelled]: "Cancelled",
    [BookingStatus.pendingPayment]: "Pending Payment",
  };

  const _deliveryTypeLabels: Record<DeliveryType, string> = {
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
              <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No bookings yet</h3>
                <p className="text-muted-foreground">
                  Get a quote and book your first move!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Bookings</h2>
          <p className="text-muted-foreground">
            Track and manage your moving bookings
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
        </Badge>
      </div>

      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
                <CardDescription>Quote ID: {booking.quoteId}</CardDescription>
              </div>
              <Badge className={statusColors[booking.status]}>
                {statusLabels[booking.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <IndianRupee className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Final Price</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{Number(booking.finalPrice)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Booking Date</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(
                      Number(booking.timestamp) / 1000000,
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Provider</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {booking.serviceProvider.toString().slice(0, 12)}...
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
