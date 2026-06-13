import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WeightRange {
    maxWeight: number;
    rangeLabel: string;
    unit: string;
    minWeight: number;
}
export interface Location {
    latitude: number;
    longitude: number;
    address: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export type MoveType = {
    __kind__: "rk";
    rk: null;
} | {
    __kind__: "bhk";
    bhk: {
        size: string;
    };
} | {
    __kind__: "office";
    office: null;
};
export interface InstantQuoteRequest {
    vehicleType: string;
    dropOffLocation: string;
    addOnServices: Array<string>;
    advanceAmount: bigint;
    schedule: string;
    totalPrice: bigint;
    priceBreakdown: PriceBreakdown;
    moveType: MoveType;
    pickupLocation: string;
    advancePercentage: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PriceBreakdown {
    finalPrice: bigint;
    vehicleType: bigint;
    goodsType: bigint;
    distance: bigint;
    addOns: bigint;
    bulkDiscount: bigint;
    timeSlot: bigint;
    baseFare: bigint;
}
export interface Booking {
    id: string;
    finalPrice: bigint;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    customer: Principal;
    quoteId: string;
    serviceProvider: Principal;
    advanceAmount: bigint;
    paymentId: string;
    timestamp: Time;
    advancePercentage: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface RazorpayOrder {
    bookingId: string;
    receipt: string;
    orderId: string;
    currency: string;
    notes: string;
    amount: bigint;
}
export interface Quote {
    id: string;
    weightRange: WeightRange;
    dropOffLocation: Location;
    customer: Principal;
    estimatedPrice: bigint;
    deliveryType: DeliveryType;
    distance: bigint;
    advanceAmount: bigint;
    timestamp: Time;
    pickupLocation: Location;
    advancePercentage: bigint;
}
export interface ServiceProviderProfile {
    id: Principal;
    contactInfo: string;
    name: string;
    availability: boolean;
    servicesOffered: Array<DeliveryType>;
}
export type Principal = Principal;
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface UserProfile {
    userType: Variant_customer_serviceProvider;
    contactInfo: string;
    name: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    pendingPayment = "pendingPayment",
    confirmed = "confirmed",
    inProgress = "inProgress"
}
export enum DeliveryType {
    appliance = "appliance",
    smallPackage = "smallPackage",
    furniture = "furniture",
    mediumPackage = "mediumPackage",
    largePackage = "largePackage"
}
export enum PaymentStatus {
    cancelled = "cancelled",
    driverAssigned = "driverAssigned",
    completed = "completed",
    pendingPayment = "pendingPayment",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_customer_serviceProvider {
    customer = "customer",
    serviceProvider = "serviceProvider"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    autoCancelPendingBookings(): Promise<Array<string>>;
    createBooking(quoteId: string, serviceProvider: Principal): Promise<Booking>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createInstantQuoteRequest(pickupLocation: string, dropOffLocation: string, moveType: MoveType, vehicleType: string, addOnServices: Array<string>, schedule: string, advancePercentage: bigint): Promise<InstantQuoteRequest>;
    createRazorpayOrder(bookingId: string): Promise<RazorpayOrder>;
    createServiceProviderProfile(profile: ServiceProviderProfile): Promise<void>;
    createWeightRange(rangeLabel: string, minWeight: number, maxWeight: number, unit: string): Promise<void>;
    generateBalancePaymentLink(bookingId: string): Promise<string>;
    geocodeAddress(address: string): Promise<string>;
    getAllDeliveryTypes(): Promise<Array<DeliveryType>>;
    getAllInstantQuoteRequests(): Promise<Array<InstantQuoteRequest>>;
    getAllWeightRanges(): Promise<Array<WeightRange>>;
    getBookingById(bookingId: string): Promise<Booking>;
    getBookingsByCustomer(customer: Principal): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyBookings(): Promise<Array<Booking>>;
    getMyInstantQuoteRequests(): Promise<Array<InstantQuoteRequest>>;
    getMyQuotes(): Promise<Array<Quote>>;
    getQuote(pickup: Location, dropOff: Location, deliveryType: DeliveryType, weightRange: WeightRange, advancePercentage: bigint): Promise<Quote>;
    getQuotesByDeliveryType(deliveryType: DeliveryType): Promise<Array<Quote>>;
    getQuotesByDeliveryTypeAndWeightRange(deliveryType: DeliveryType, weightRangeLabel: string): Promise<Array<Quote>>;
    getQuotesByWeightRange(weightRangeLabel: string): Promise<Array<Quote>>;
    getRouteDistance(startLat: number, startLng: number, endLat: number, endLng: number): Promise<bigint>;
    getServiceProviderProfile(providerId: Principal): Promise<ServiceProviderProfile | null>;
    getServiceProviderProfiles(): Promise<Array<ServiceProviderProfile>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeightRange(rangeLabel: string): Promise<WeightRange | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBookingPayment(bookingId: string, paymentId: string, newPaymentStatus: PaymentStatus): Promise<void>;
    updateBookingStatus(bookingId: string, newStatus: BookingStatus): Promise<void>;
    updatePaymentStatus(bookingId: string, newStatus: PaymentStatus): Promise<void>;
    updateServiceProviderProfile(profile: ServiceProviderProfile): Promise<void>;
    verifyRazorpayPayment(bookingId: string, paymentId: string, orderId: string, signature: string): Promise<boolean>;
}
