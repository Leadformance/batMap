declare namespace L {
  export namespace Mappy {
    export class Map extends L.Map {
      constructor(domElement: HTMLElement | string, options: MapOptions);
    }

    export function setClientId(clientId: string): void;

    export function setLocale(locale: string): void;

    export function enableHttps(): void;

    export function setImgPath(path: string): void;

    export function disableTooltip(): void;

    export function enableTooltip(): void;

    export function disableLogs(): void;

    export function enableLogs(): void;

    export enum Vehicles {
      car = 'car',
      bike = 'bike',
      walk = 'walk',
    }

    export type ControlPosition =
      | 'topleft'
      | 'topright'
      | 'bottomright'
      | 'bottomleft';

    export interface MapOptions extends L.MapOptions {
      clientId: string;
      logoControl?: LogoControlOptions;
      viewmode?: 'standard' | 'photo' | 'hybrid';
      layersControl?: boolean | LayersControlOptions;
      tileLayerOptions?: L.TileLayerOptions;
      attributionControl?: boolean | AttributionControlOptions;
      geolocationControl?: boolean | GeolocationControlOptions;
      tooltip?: boolean;
    }

    export interface LogoControlOptions {
      position: ControlPosition;
    }

    export interface LayersControlOptions {
      publicTransport?: boolean;
      traffic?: boolean;
      viewMode?: boolean;
      trafficLegend?: boolean;
    }

    export interface AttributionControlOptions {
      scale: boolean;
    }

    export interface GeolocationControlOptions {
      geolocationMarker?: boolean;
      locateOptions?: {
        setView?: boolean;
        maxZoom?: number;
        timeout?: number;
        maximumAge?: number;
      };
      position?: ControlPosition;
    }

    export namespace Services {
      export function geocodeForward(
        text: string,
        successCallback: (results: any) => void,
        failureCallback: (error: Error) => void,
      ): void;

      export function geocodeReverse(
        [lat, lng]: [number, number],
        successCallback: (results: any) => void,
        failureCallback: (error: Error) => void,
      ): void;

      export function route(
        options: RouteOptions,
        successCallback: (results: { routes: Route[] }) => void,
        failureCallback: (error: Error) => void,
      ): void;

      export function roadbook(
        options: RouteOptions,
        successCallback: (results: { sections: RoadbookSection[] }) => void,
        failureCallback: (error: Error) => void,
      ): void;

      export interface RouteOptions {
        providers: Vehicles;
        from: string; // "lat,lng"
        to: string; // "lat,lng"
      }

      export interface Route {
        length: number;
        time: number;
        price: number;
      }

      export interface RoadbookSection {
        actions: RoadbookAction[];
      }

      export interface RoadbookAction {
        icon: string; // icon class
        distance_label: string;
        label: string;
      }
    }
  }
}
