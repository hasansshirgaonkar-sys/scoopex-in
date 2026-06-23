// Google Maps JavaScript API Type Declarations
// This file provides TypeScript type definitions for Google Maps API

declare namespace google {
  namespace maps {
    // biome-ignore lint/suspicious/noShadowRestrictedNames: Google Maps API declares `Map` class inside a namespace
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
      getBounds(): LatLngBounds | undefined;
      getCenter(): LatLng;
      getDiv(): HTMLElement;
      getZoom(): number;
      panTo(latLng: LatLng | LatLngLiteral): void;
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      addListener(
        eventName: string,
        handler: (...args: any[]) => void,
      ): MapsEventListener;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      gestureHandling?: string;
      mapTypeId?: MapTypeId;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      equals(other: LatLng): boolean;
      toString(): string;
      toJSON(): LatLngLiteral;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      contains(latLng: LatLng | LatLngLiteral): boolean;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toString(): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      getPosition(): LatLng | undefined;
      setMap(map: Map | null): void;
      setPosition(latlng: LatLng | LatLngLiteral): void;
      setTitle(title: string): void;
      setLabel(label: string | MarkerLabel): void;
      setIcon(icon: string | Icon | Symbol): void;
      addListener(
        eventName: string,
        handler: (...args: any[]) => void,
      ): MapsEventListener;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      label?: string | MarkerLabel;
      icon?: string | Icon | Symbol;
      animation?: Animation;
      clickable?: boolean;
      draggable?: boolean;
      visible?: boolean;
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    interface Icon {
      url: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
    }

    interface Symbol {
      path: string | SymbolPath;
      anchor?: Point;
      fillColor?: string;
      fillOpacity?: number;
      labelOrigin?: Point;
      rotation?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    enum Animation {
      BOUNCE = 1,
      DROP = 2,
    }

    enum SymbolPath {
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW,
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
    }

    class Size {
      constructor(
        width: number,
        height: number,
        widthUnit?: string,
        heightUnit?: string,
      );
      width: number;
      height: number;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      close(): void;
      getContent(): string | Node | undefined;
      getPosition(): LatLng | undefined;
      open(map?: Map, anchor?: Marker): void;
      setContent(content: string | Node): void;
      setPosition(position: LatLng | LatLngLiteral): void;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
      pixelOffset?: Size;
    }

    class Geocoder {
      constructor();
      geocode(
        request: GeocoderRequest,
        callback: (results: GeocoderResult[], status: GeocoderStatus) => void,
      ): void;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      placeId?: string;
      bounds?: LatLngBounds | LatLngBoundsLiteral;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderComponentRestrictions {
      administrativeArea?: string;
      country?: string | string[];
      locality?: string;
      postalCode?: string;
      route?: string;
    }

    interface GeocoderResult {
      address_components: GeocoderAddressComponent[];
      formatted_address: string;
      geometry: GeocoderGeometry;
      place_id: string;
      types: string[];
      partial_match?: boolean;
      postcode_localities?: string[];
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface GeocoderGeometry {
      location: LatLng;
      location_type: GeocoderLocationType;
      viewport: LatLngBounds;
      bounds?: LatLngBounds;
    }

    enum GeocoderStatus {
      ERROR = "ERROR",
      INVALID_REQUEST = "INVALID_REQUEST",
      OK = "OK",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
      ZERO_RESULTS = "ZERO_RESULTS",
    }

    enum GeocoderLocationType {
      APPROXIMATE = "APPROXIMATE",
      GEOMETRIC_CENTER = "GEOMETRIC_CENTER",
      RANGE_INTERPOLATED = "RANGE_INTERPOLATED",
      ROOFTOP = "ROOFTOP",
    }

    enum MapTypeId {
      HYBRID = "hybrid",
      ROADMAP = "roadmap",
      SATELLITE = "satellite",
      TERRAIN = "terrain",
    }

    interface MapsEventListener {
      remove(): void;
    }

    interface MapMouseEvent {
      latLng: LatLng | null;
      stop(): void;
    }

    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
        getBounds(): LatLngBounds | undefined;
        getPlace(): PlaceResult;
        setBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
        setComponentRestrictions(restrictions: ComponentRestrictions): void;
        setFields(fields: string[]): void;
        setTypes(types: string[]): void;
        addListener(eventName: string, handler: () => void): MapsEventListener;
      }

      interface AutocompleteOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        fields?: string[];
        strictBounds?: boolean;
        types?: string[];
      }

      interface ComponentRestrictions {
        country?: string | string[];
      }

      interface PlaceResult {
        address_components?: GeocoderAddressComponent[];
        formatted_address?: string;
        geometry?: PlaceGeometry;
        name?: string;
        place_id?: string;
        types?: string[];
        html_attributions?: string[];
        icon?: string;
        photos?: PlacePhoto[];
        rating?: number;
        url?: string;
        vicinity?: string;
      }

      interface PlaceGeometry {
        location: LatLng;
        viewport: LatLngBounds;
      }

      interface PlacePhoto {
        height: number;
        width: number;
        getUrl(opts: PhotoOptions): string;
        html_attributions: string[];
      }

      interface PhotoOptions {
        maxHeight?: number;
        maxWidth?: number;
      }

      class PlacesService {
        constructor(attrContainer: HTMLDivElement | Map);
        findPlaceFromQuery(
          request: FindPlaceFromQueryRequest,
          callback: (
            results: PlaceResult[],
            status: PlacesServiceStatus,
          ) => void,
        ): void;
        getDetails(
          request: PlaceDetailsRequest,
          callback: (result: PlaceResult, status: PlacesServiceStatus) => void,
        ): void;
        nearbySearch(
          request: PlaceSearchRequest,
          callback: (
            results: PlaceResult[],
            status: PlacesServiceStatus,
          ) => void,
        ): void;
      }

      interface FindPlaceFromQueryRequest {
        query: string;
        fields: string[];
        locationBias?: LocationBias;
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields?: string[];
      }

      interface PlaceSearchRequest {
        location: LatLng | LatLngLiteral;
        radius: number;
        keyword?: string;
        type?: string;
      }

      type LocationBias = LatLng | LatLngBounds | LatLngBoundsLiteral;

      enum PlacesServiceStatus {
        INVALID_REQUEST = "INVALID_REQUEST",
        NOT_FOUND = "NOT_FOUND",
        OK = "OK",
        OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
        REQUEST_DENIED = "REQUEST_DENIED",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
        ZERO_RESULTS = "ZERO_RESULTS",
      }
    }
  }
}

// Extend Window interface to include google and callback functions
interface Window {
  google: typeof google;
  initGoogleMaps?: () => void;
  initGoogleMapsEstimator?: () => void;
}
