import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  DeliveryType,
  InstantQuoteRequest,
  Location,
  MoveType,
  PaymentStatus,
  Quote,
  RazorpayOrder,
  ServiceProviderProfile,
  UserProfile,
  WeightRange,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Default advance percentage (25% as median of 20-30% range)
const DEFAULT_ADVANCE_PERCENTAGE = 25;

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Instant Quote Queries
export function useCreateInstantQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pickupLocation,
      dropOffLocation,
      moveType,
      vehicleType,
      addOnServices,
      schedule,
      advancePercentage = DEFAULT_ADVANCE_PERCENTAGE,
    }: {
      pickupLocation: string;
      dropOffLocation: string;
      moveType: MoveType;
      vehicleType: string;
      addOnServices: string[];
      schedule: string;
      advancePercentage?: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createInstantQuoteRequest(
        pickupLocation,
        dropOffLocation,
        moveType,
        vehicleType,
        addOnServices,
        schedule,
        BigInt(advancePercentage),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instantQuotes"] });
    },
  });
}

export function useGetMyInstantQuotes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InstantQuoteRequest[]>({
    queryKey: ["instantQuotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyInstantQuoteRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Quote Queries
export function useGetQuote() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      pickup,
      dropOff,
      deliveryType,
      weightRange,
      advancePercentage = DEFAULT_ADVANCE_PERCENTAGE,
    }: {
      pickup: Location;
      dropOff: Location;
      deliveryType: DeliveryType;
      weightRange: WeightRange;
      advancePercentage?: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.getQuote(
        pickup,
        dropOff,
        deliveryType,
        weightRange,
        BigInt(advancePercentage),
      );
    },
  });
}

export function useGetQuotesByDeliveryType(deliveryType: DeliveryType) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Quote[]>({
    queryKey: ["quotes", deliveryType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuotesByDeliveryType(deliveryType);
    },
    enabled: !!actor && !actorFetching,
  });
}

// Booking Queries
export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quoteId,
      serviceProvider,
    }: {
      quoteId: string;
      serviceProvider: Principal;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBooking(quoteId, serviceProvider);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useGetBookingsByCustomer() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Booking[]>({
    queryKey: ["bookings", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getBookingsByCustomer(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetBookingById(bookingId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getBookingById(bookingId);
    },
    enabled: !!actor && !actorFetching && !!bookingId,
  });
}

// Razorpay Payment Queries
export function useCreateRazorpayOrder() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createRazorpayOrder(bookingId);
    },
  });
}

export function useVerifyRazorpayPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      paymentId,
      orderId,
      signature,
    }: {
      bookingId: string;
      paymentId: string;
      orderId: string;
      signature: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.verifyRazorpayPayment(
        bookingId,
        paymentId,
        orderId,
        signature,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      newStatus,
    }: {
      bookingId: string;
      newStatus: PaymentStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePaymentStatus(bookingId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useGenerateBalancePaymentLink() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateBalancePaymentLink(bookingId);
    },
  });
}

// Service Provider Queries
export function useGetServiceProviderProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ServiceProviderProfile[]>({
    queryKey: ["serviceProviders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServiceProviderProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateServiceProviderProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ServiceProviderProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createServiceProviderProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });
    },
  });
}
