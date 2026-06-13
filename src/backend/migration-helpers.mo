import Map "mo:core/Map";

module {
  type OldInstantQuoteRequest = {
    pickupLocation : Text;
    dropOffLocation : Text;
    moveType : {
      #rk;
      #bhk : { size : Text };
      #office;
    };
    vehicleType : Text;
    addOnServices : [Text];
    schedule : Text;
    priceBreakdown : {
      baseFare : Int;
      goodsType : Int;
      vehicleType : Int;
      addOns : Int;
      distance : Int;
      timeSlot : Int;
      bulkDiscount : Int;
      finalPrice : Int;
    };
    totalPrice : Int;
  };

  type NewInstantQuoteRequest = {
    pickupLocation : Text;
    dropOffLocation : Text;
    moveType : {
      #rk;
      #bhk : { size : Text };
      #office;
    };
    vehicleType : Text;
    addOnServices : [Text];
    schedule : Text;
    priceBreakdown : {
      baseFare : Int;
      goodsType : Int;
      vehicleType : Int;
      addOns : Int;
      distance : Int;
      timeSlot : Int;
      bulkDiscount : Int;
      finalPrice : Int;
    };
    totalPrice : Int;
    advancePercentage : Int;
    advanceAmount : Int;
  };

  public func mapInstantQuotesToNewFormat(oldQuotes : Map.Map<Text, OldInstantQuoteRequest>) : Map.Map<Text, NewInstantQuoteRequest> {
    oldQuotes.map<Text, OldInstantQuoteRequest, NewInstantQuoteRequest>(
      func(_key, oldQuote) {
        {
          oldQuote with
          advancePercentage = 25; // Default value for old entries
          advanceAmount = (oldQuote.totalPrice * 25) / 100; // Default calculation for old entries
        };
      }
    );
  };
};
