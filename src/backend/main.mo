import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Stripe "mo:caffeineai-stripe/stripe";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState, null);
  include MixinObjectStorage();
  include MixinViews();

  type PriceBreakdown = {
    baseFare : Int;
    goodsType : Int;
    vehicleType : Int;
    addOns : Int;
    distance : Int;
    timeSlot : Int;
    bulkDiscount : Int;
    finalPrice : Int;
  };

  public type MoveType = {
    #rk;
    #bhk : { size : Text };
    #office;
  };

  public type InstantQuoteRequest = {
    pickupLocation : Text;
    dropOffLocation : Text;
    moveType : MoveType;
    vehicleType : Text;
    addOnServices : [Text];
    schedule : Text;
    priceBreakdown : PriceBreakdown;
    totalPrice : Int;
    advancePercentage : Int;
    advanceAmount : Int;
  };

  module InstantQuoteRequest {
    public func compare(
      instantQuoteRequest1 : InstantQuoteRequest,
      instantQuoteRequest2 : InstantQuoteRequest,
    ) : Order.Order {
      Int.compare(instantQuoteRequest1.totalPrice, instantQuoteRequest2.totalPrice);
    };
  };

  type WeightRange = {
    minWeight : Float;
    maxWeight : Float;
    unit : Text;
    rangeLabel : Text;
  };

  module WeightRange {
    public func compare(weightRange1 : WeightRange, weightRange2 : WeightRange) : Order.Order {
      Text.compare(weightRange1.rangeLabel, weightRange2.rangeLabel);
    };
  };

  let weightRanges = Map.empty<Text, WeightRange>();

  type Location = {
    address : Text;
    latitude : Float;
    longitude : Float;
  };

  module Location {
    public func compare(location1 : Location, location2 : Location) : Order.Order {
      Text.compare(location1.address, location2.address);
    };
  };

  type DeliveryType = {
    #smallPackage;
    #mediumPackage;
    #largePackage;
    #furniture;
    #appliance;
  };

  module DeliveryType {
    public func compare(deliveryType1 : DeliveryType, deliveryType2 : DeliveryType) : Order.Order {
      switch (deliveryType1, deliveryType2) {
        case (#smallPackage, #smallPackage) { #equal };
        case (#smallPackage, _) { #less };
        case (#mediumPackage, #smallPackage) { #greater };
        case (#mediumPackage, #mediumPackage) { #equal };
        case (#mediumPackage, _) { #less };
        case (#largePackage, #furniture) { #less };
        case (#largePackage, #appliance) { #less };
        case (#largePackage, #largePackage) { #equal };
        case (#furniture, #appliance) { #less };
        case (#furniture, #furniture) { #equal };
        case (#appliance, #appliance) { #equal };
        case (#appliance, _) { #greater };
        case (_) { #greater };
      };
    };
  };

  type Quote = {
    id : Text;
    customer : Principal.Principal;
    pickupLocation : Location;
    dropOffLocation : Location;
    deliveryType : DeliveryType;
    weightRange : WeightRange;
    distance : Int;
    estimatedPrice : Int;
    advancePercentage : Int;
    advanceAmount : Int;
    timestamp : Time.Time;
  };

  module Quote {
    public func compare(quote1 : Quote, quote2 : Quote) : Order.Order {
      Int.compare(quote1.estimatedPrice, quote2.estimatedPrice);
    };
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #inProgress;
    #completed;
    #cancelled;
    #pendingPayment;
  };

  module BookingStatus {
    public func compare(bookingStatus1 : BookingStatus, bookingStatus2 : BookingStatus) : Order.Order {
      switch (bookingStatus1, bookingStatus2) {
        case (#pending, #pending) { #equal };
        case (#pending, _) { #less };
        case (#confirmed, #pending) { #greater };
        case (#confirmed, #confirmed) { #equal };
        case (#confirmed, _) { #less };
        case (#inProgress, #pending) { #greater };
        case (#inProgress, #confirmed) { #greater };
        case (#inProgress, #inProgress) { #equal };
        case (#inProgress, _) { #less };
        case (#completed, #cancelled) { #less };
        case (#completed, #completed) { #equal };
        case (#cancelled, #cancelled) { #equal };
        case (#cancelled, _) { #greater };
        case (#pendingPayment, _) { #greater };
        case (_) { #greater };
      };
    };
  };

  public type PaymentStatus = {
    #pendingPayment;
    #confirmed;
    #driverAssigned;
    #completed;
    #cancelled;
  };

  module PaymentStatus {
    public func compare(paymentStatus1 : PaymentStatus, paymentStatus2 : PaymentStatus) : Order.Order {
      switch (paymentStatus1, paymentStatus2) {
        case (#pendingPayment, #pendingPayment) { #equal };
        case (#pendingPayment, _) { #less };
        case (#confirmed, #pendingPayment) { #greater };
        case (#confirmed, #confirmed) { #equal };
        case (#confirmed, _) { #less };
        case (#driverAssigned, #pendingPayment) { #greater };
        case (#driverAssigned, #confirmed) { #greater };
        case (#driverAssigned, #driverAssigned) { #equal };
        case (#driverAssigned, _) { #less };
        case (#completed, #cancelled) { #less };
        case (#completed, #completed) { #equal };
        case (#cancelled, #cancelled) { #equal };
        case (#cancelled, _) { #greater };
        case (_) { #greater };
      };
    };
  };

  public type Booking = {
    id : Text;
    quoteId : Text;
    customer : Principal.Principal;
    serviceProvider : Principal.Principal;
    status : BookingStatus;
    paymentStatus : PaymentStatus;
    finalPrice : Int;
    advanceAmount : Int;
    advancePercentage : Int;
    paymentId : Text;
    timestamp : Time.Time;
  };

  module Booking {
    public func compareByPrice(booking1 : Booking, booking2 : Booking) : Order.Order {
      Int.compare(booking1.finalPrice, booking2.finalPrice);
    };
  };

  type ServiceProviderProfile = {
    id : Principal.Principal;
    name : Text;
    contactInfo : Text;
    servicesOffered : [DeliveryType];
    availability : Bool;
  };

  module ServiceProviderProfile {
    public func compare(profile1 : ServiceProviderProfile, profile2 : ServiceProviderProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  public type UserProfile = {
    name : Text;
    contactInfo : Text;
    userType : { #customer; #serviceProvider };
  };

  public type RazorpayOrder = {
    orderId : Text;
    amount : Int;
    currency : Text;
    receipt : Text;
    notes : Text;
    bookingId : Text;
  };

  // State
  let instantQuotes = Map.empty<Text, InstantQuoteRequest>();
  let instantQuoteOwners = Map.empty<Text, Principal.Principal>();
  let quotes = Map.empty<Text, Quote>();
  let bookings = Map.empty<Text, Booking>();
  let serviceProviderProfiles = Map.empty<Principal.Principal, ServiceProviderProfile>();
  let userProfiles = Map.empty<Principal.Principal, UserProfile>();
  let razorpayOrders = Map.empty<Text, RazorpayOrder>();
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // Helper to check if a principal is anonymous (guest)
  func isAnonymous(caller : Principal.Principal) : Bool {
    caller.isAnonymous();
  };

  // ------ Access Control ------

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  // assignCallerUserRole is provided by MixinAuthorization mixin

  // isCallerAdmin is provided by MixinAuthorization mixin

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal.Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ------ Instant Quote Management ------
  // Note: Instant quotes are designed to be accessible to guests for initial price estimation

  public shared ({ caller }) func createInstantQuoteRequest(
    pickupLocation : Text,
    dropOffLocation : Text,
    moveType : MoveType,
    vehicleType : Text,
    addOnServices : [Text],
    schedule : Text,
    advancePercentage : Int,
  ) : async InstantQuoteRequest {
    // Allow guests to create instant quotes for price estimation (no auth required)
    let priceBreakdown : PriceBreakdown = {
      baseFare = 10000;
      goodsType = 2000;
      vehicleType = 3000;
      addOns = 1500;
      distance = 2500;
      timeSlot = 0;
      bulkDiscount = 0;
      finalPrice = 0;
    };

    let totalPrice = priceBreakdown.baseFare + priceBreakdown.goodsType + priceBreakdown.vehicleType + priceBreakdown.addOns + priceBreakdown.distance + priceBreakdown.timeSlot;
    let advanceAmount = (totalPrice * advancePercentage) / 100;

    let instantQuoteRequest = {
      pickupLocation;
      dropOffLocation;
      moveType;
      vehicleType;
      addOnServices;
      schedule;
      priceBreakdown;
      totalPrice;
      advancePercentage;
      advanceAmount;
    };

    let id = "IQR-" # Time.now().toText();
    instantQuotes.add(id, instantQuoteRequest);
    instantQuoteOwners.add(id, caller);

    instantQuoteRequest;
  };

  public query ({ caller }) func getMyInstantQuoteRequests() : async [InstantQuoteRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get quotes");
    };

    let myQuoteIds = instantQuoteOwners.entries().filter(
      func(entry : (Text, Principal.Principal)) : Bool { entry.1 == caller }
    );

    let myQuotes = myQuoteIds.map(
      func(entry : (Text, Principal.Principal)) : ?InstantQuoteRequest {
        instantQuotes.get(entry.0);
      }
    ).filter(
      func(quote : ?InstantQuoteRequest) : Bool {
        switch (quote) {
          case (null) { false };
          case (?_) { true };
        }
      }
    ).map(
      func(quote : ?InstantQuoteRequest) : InstantQuoteRequest {
        switch (quote) {
          case (null) { Runtime.trap("Unexpected null quote") };
          case (?q) { q };
        }
      }
    );

    myQuotes.toArray().sort();
  };

  public query ({ caller }) func getAllInstantQuoteRequests() : async [InstantQuoteRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all quote requests");
    };
    instantQuotes.values().toArray().sort();
  };

  // ------ Weight Management ------

  public shared ({ caller }) func createWeightRange(rangeLabel : Text, minWeight : Float, maxWeight : Float, unit : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create weight ranges");
    };

    let weightRange : WeightRange = {
      rangeLabel;
      minWeight;
      maxWeight;
      unit;
    };
    weightRanges.add(rangeLabel, weightRange);
  };

  public query ({ caller }) func getWeightRange(rangeLabel : Text) : async ?WeightRange {
    // Allow guests to access weight ranges for instant quotes
    weightRanges.get(rangeLabel);
  };

  public query ({ caller }) func getAllWeightRanges() : async [WeightRange] {
    // Allow guests to access weight ranges for instant quotes
    weightRanges.values().toArray().sort();
  };

  public query ({ caller }) func getAllDeliveryTypes() : async [DeliveryType] {
    // Allow guests to access delivery types for instant quotes
    [#smallPackage, #mediumPackage, #largePackage, #furniture, #appliance];
  };

  // ------ Quote Creation ------

  public shared ({ caller }) func getQuote(
    pickup : Location,
    dropOff : Location,
    deliveryType : DeliveryType,
    weightRange : WeightRange,
    advancePercentage : Int,
  ) : async Quote {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get quotes");
    };

    let distance = await getRouteDistance(
      pickup.latitude,
      pickup.longitude,
      dropOff.latitude,
      dropOff.longitude,
    );

    let basePrice = switch (deliveryType) {
      case (#smallPackage) { 5000 };
      case (#mediumPackage) { 10000 };
      case (#largePackage) { 20000 };
      case (#furniture) { 30000 };
      case (#appliance) { 40000 };
    };

    let weightMultiplier = switch (weightRange.rangeLabel) {
      case ("0-5 kg") { 1.0 };
      case ("5-20 kg") { 1.25 };
      case ("20-50 kg") { 1.5 };
      case ("50-150 kg") { 2.0 };
      case ("20-100 kg") { 1.75 };
      case (_) { 1.0 };
    };

    let estimatedPrice = (basePrice + (distance / 10)) * weightMultiplier.toInt();
    let advanceAmount = (estimatedPrice * advancePercentage) / 100;

    let quoteId = "Q" # Time.now().toText();
    let quote : Quote = {
      id = quoteId;
      customer = caller;
      pickupLocation = pickup;
      dropOffLocation = dropOff;
      deliveryType;
      weightRange;
      distance;
      estimatedPrice;
      advanceAmount;
      advancePercentage;
      timestamp = Time.now();
    };

    quotes.add(quoteId, quote);
    quote;
  };

  // ------ Booking Creation ------

  public shared ({ caller }) func createBooking(quoteId : Text, serviceProvider : Principal.Principal) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };

    let quote = switch (quotes.get(quoteId)) {
      case (null) { Runtime.trap("Quote not found") };
      case (?q) { q };
    };

    if (quote.customer != caller) {
      Runtime.trap("Unauthorized: Can only create bookings for your own quotes");
    };

    switch (serviceProviderProfiles.get(serviceProvider)) {
      case (null) { Runtime.trap("Service provider not found") };
      case (?_) { };
    };

    let bookingId = "B" # Time.now().toText();
    let booking : Booking = {
      id = bookingId;
      quoteId;
      customer = caller;
      serviceProvider;
      status = #pendingPayment;
      paymentStatus = #pendingPayment;
      finalPrice = quote.estimatedPrice;
      advanceAmount = quote.advanceAmount;
      advancePercentage = quote.advancePercentage;
      paymentId = "";
      timestamp = Time.now();
    };

    bookings.add(bookingId, booking);
    booking;
  };

  // ------ Razorpay Integration ------

  public shared ({ caller }) func createRazorpayOrder(bookingId : Text) : async RazorpayOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create payment orders");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    if (booking.customer != caller) {
      Runtime.trap("Unauthorized: Can only create payment orders for your own bookings");
    };

    if (booking.paymentStatus != #pendingPayment) {
      Runtime.trap("Invalid booking state: Payment already processed");
    };

    let orderId = "order_" # bookingId # "_" # Time.now().toText();
    let order : RazorpayOrder = {
      orderId;
      amount = booking.advanceAmount;
      currency = "INR";
      receipt = bookingId;
      notes = "Pickup: " # booking.quoteId # " | Advance payment for shifting";
      bookingId;
    };

    razorpayOrders.add(orderId, order);
    order;
  };

  public shared ({ caller }) func verifyRazorpayPayment(bookingId : Text, paymentId : Text, orderId : Text, signature : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify payments");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    // Only customer, assigned service provider, or admin can verify payments
    if (caller != booking.customer and caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only verify payments for your own bookings");
    };

    // Verify that the orderId belongs to this booking
    let order = switch (razorpayOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };

    if (order.bookingId != bookingId) {
      Runtime.trap("Order does not belong to this booking");
    };

    // In production, verify the signature using Razorpay's algorithm
    // For now, we trust the frontend has done the verification with Razorpay SDK

    let updatedBooking = {
      booking with paymentId = paymentId;
      paymentStatus = #confirmed;
      status = #confirmed;
    };

    bookings.add(bookingId, updatedBooking);
    true;
  };

  public shared ({ caller }) func updateBookingPayment(bookingId : Text, paymentId : Text, newPaymentStatus : PaymentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update payment status");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    // Role-based authorization for payment status updates
    switch (newPaymentStatus) {
      case (#confirmed or #pendingPayment) {
        // Only customer can update advance payment status
        if (caller != booking.customer and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only customer can update advance payment status");
        };
      };
      case (#completed) {
        // Only service provider can confirm balance payment
        if (caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only service provider can confirm balance payment");
        };
      };
      case (#driverAssigned) {
        // Only service provider or admin can assign driver
        if (caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only service provider can assign driver");
        };
      };
      case (#cancelled) {
        // Customer, service provider, or admin can cancel
        if (caller != booking.customer and caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only cancel your own bookings");
        };
      };
    };

    let updatedBooking = {
      booking with paymentId = paymentId;
      paymentStatus = newPaymentStatus;
    };

    bookings.add(bookingId, updatedBooking);
  };

  public shared ({ caller }) func generateBalancePaymentLink(bookingId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate payment links");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    // Allow both customer and service provider to generate balance payment link
    if (caller != booking.customer and caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only generate payment link for your own bookings");
    };

    let balanceAmount = booking.finalPrice - booking.advanceAmount;
    if (balanceAmount <= 0) {
      Runtime.trap("No balance amount remaining");
    };

    let paymentLink = "https://razorpay.com/payment-link/" # bookingId # "/" # balanceAmount.toText();
    paymentLink;
  };

  public shared ({ caller }) func autoCancelPendingBookings() : async [Text] {
    // Allow anonymous principal (system cron jobs) or admins to auto-cancel bookings
    if (not isAnonymous(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only system or admins can auto-cancel bookings");
    };

    let fifteenMinutesInNanos = 15 * 60 * 1_000_000_000;
    let currentTime = Time.now();
    var cancelledBookingIds : [Text] = [];

    for ((bookingId, booking) in bookings.entries()) {
      if (booking.paymentStatus == #pendingPayment) {
        let timeDiff = currentTime - booking.timestamp;
        if (timeDiff > fifteenMinutesInNanos) {
          let updatedBooking = {
            booking with status = #cancelled;
            paymentStatus = #cancelled;
          };
          bookings.add(bookingId, updatedBooking);
          cancelledBookingIds := cancelledBookingIds.concat([bookingId]);
        };
      };
    };

    cancelledBookingIds;
  };

  // ------ Booking Status Updates ------

  public shared ({ caller }) func updateBookingStatus(bookingId : Text, newStatus : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update bookings");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    // Role-based authorization for booking status updates
    switch (newStatus) {
      case (#confirmed or #pendingPayment) {
        // Customer or admin can confirm/set pending payment
        if (caller != booking.customer and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only customer can update booking to confirmed or pending payment");
        };
      };
      case (#inProgress) {
        // Service provider or admin can mark in progress
        if (caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only service provider can mark booking in progress");
        };
      };
      case (#completed) {
        // Service provider or admin can mark completed
        if (caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only service provider can mark booking completed");
        };
      };
      case (#cancelled) {
        // Customer, service provider, or admin can cancel
        if (caller != booking.customer and caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only cancel your own bookings");
        };
      };
      case (#pending) {
        // Any involved party can set to pending
        if (caller != booking.customer and caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own bookings");
        };
      };
    };

    let updatedBooking = {
      booking with status = newStatus
    };
    bookings.add(bookingId, updatedBooking);
  };

  public shared ({ caller }) func updatePaymentStatus(bookingId : Text, newStatus : PaymentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update payment status");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    // Role-based authorization for payment status updates
    switch (newStatus) {
      case (#confirmed or #pendingPayment) {
        // Only customer can update advance payment status
        if (caller != booking.customer and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only customer can update advance payment status");
        };
      };
      case (#completed) {
        // Only service provider can confirm balance payment
        if (caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only service provider can confirm balance payment");
        };
      };
      case (#driverAssigned) {
        // Only service provider or admin can assign driver
        if (caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only service provider can assign driver");
        };
      };
      case (#cancelled) {
        // Customer, service provider, or admin can cancel
        if (caller != booking.customer and caller != booking.serviceProvider and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only cancel your own bookings");
        };
      };
    };

    let updatedBooking = {
      booking with paymentStatus = newStatus
    };
    bookings.add(bookingId, updatedBooking);
  };

  // ------ Queries ------

  public query ({ caller }) func getBookingById(bookingId : Text) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access bookings");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (
          caller != booking.customer
          and caller != booking.serviceProvider
          and not AccessControl.isAdmin(accessControlState, caller)
        ) {
          Runtime.trap("Unauthorized: Can only access your own bookings");
        };
        booking;
      };
    };
  };

  public query ({ caller }) func getBookingsByCustomer(customer : Principal.Principal) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query bookings");
    };

    if (caller != customer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only query your own bookings");
    };

    let customerBookings = bookings.values().filter(
      func(b : Booking) : Bool { b.customer == customer }
    );
    customerBookings.toArray().sort(Booking.compareByPrice);
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query bookings");
    };

    let myBookings = bookings.values().filter(
      func(b : Booking) : Bool { b.customer == caller or b.serviceProvider == caller }
    );
    myBookings.toArray().sort(Booking.compareByPrice);
  };

  public query ({ caller }) func getQuotesByDeliveryType(deliveryType : DeliveryType) : async [Quote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query quotes");
    };

    let filteredQuotes = quotes.values().filter(
      func(q : Quote) : Bool {
        q.deliveryType == deliveryType and (q.customer == caller or AccessControl.isAdmin(accessControlState, caller));
      }
    );
    filteredQuotes.toArray().sort();
  };

  public query ({ caller }) func getQuotesByDeliveryTypeAndWeightRange(deliveryType : DeliveryType, weightRangeLabel : Text) : async [Quote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query quotes");
    };

    let filteredQuotes = quotes.values().filter(
      func(q : Quote) : Bool {
        q.deliveryType == deliveryType and q.weightRange.rangeLabel == weightRangeLabel and (q.customer == caller or AccessControl.isAdmin(accessControlState, caller));
      }
    );
    filteredQuotes.toArray().sort();
  };

  public query ({ caller }) func getQuotesByWeightRange(weightRangeLabel : Text) : async [Quote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query quotes");
    };

    let filteredQuotes = quotes.values().filter(
      func(q : Quote) : Bool {
        q.weightRange.rangeLabel == weightRangeLabel and (q.customer == caller or AccessControl.isAdmin(accessControlState, caller));
      }
    );
    filteredQuotes.toArray().sort();
  };

  public query ({ caller }) func getMyQuotes() : async [Quote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query quotes");
    };

    let myQuotes = quotes.values().filter(
      func(q : Quote) : Bool { q.customer == caller }
    );
    myQuotes.toArray().sort();
  };

  // ------ Service Provider Profile Management ------

  public shared ({ caller }) func createServiceProviderProfile(profile : ServiceProviderProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create provider profiles");
    };

    // Ensure user can only create their own profile
    if (profile.id != caller) {
      Runtime.trap("Unauthorized: Can only create your own profile");
    };

    serviceProviderProfiles.add(profile.id, profile);
  };

  public shared ({ caller }) func updateServiceProviderProfile(profile : ServiceProviderProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update provider profiles");
    };

    if (profile.id != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own profile");
    };

    serviceProviderProfiles.add(profile.id, profile);
  };

  public query ({ caller }) func getServiceProviderProfiles() : async [ServiceProviderProfile] {
    // Allow guests to view service provider profiles for browsing and booking
    serviceProviderProfiles.values().toArray().sort();
  };

  public query ({ caller }) func getServiceProviderProfile(providerId : Principal.Principal) : async ?ServiceProviderProfile {
    // Allow guests to view service provider profiles for browsing and booking
    serviceProviderProfiles.get(providerId);
  };

  // ------ Utilities ------

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func makeGetOutcall(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };

  public shared func geocodeAddress(address : Text) : async Text {
    // Public utility function - guests can geocode addresses for instant quotes
    // No authentication required as this is needed for price estimation
    let url = "https://nominatim.openstreetmap.org/search?countrycodes=IN&format=json&q="
      # address
      # "&addressdetails=1&limit=50&bounded=1&viewbox=72.85,19.40,73.45,18.70";
    await makeGetOutcall(url);
  };

  func computeManhattanDistance(startLat : Float, startLng : Float, endLat : Float, endLng : Float) : Int {
    func abs(x : Float) : Float {
      if (x < 0) { -x } else { x };
    };

    let latDiff = abs(startLat - endLat);
    let lngDiff = abs(startLng - endLng);
    ((latDiff + lngDiff) * 10000).toInt();
  };

  public shared func getRouteDistance(startLat : Float, startLng : Float, endLat : Float, endLng : Float) : async Int {
    // Public utility function - guests can calculate distances for instant quotes
    // No authentication required as this is needed for price estimation
    computeManhattanDistance(startLat, startLng, endLat, endLng);
  };

  // ------ Stripe Integration ------

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check payment status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };
};
