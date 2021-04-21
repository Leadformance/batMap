import './style.scss';
import { DEFAULT_CONFIG, Provider } from './constants';
import {
  ApiKey,
  Cluster,
  BatMapConfig,
  DefaultOptions,
  Icon,
  LocationPoint,
  MapObject,
  Marker,
} from './interfaces';
import { DomUtils } from './utils';

export class AbstractMap<T extends Provider> {
  protected readonly domElement: HTMLElement;
  protected readonly config: BatMapConfig<T>;

  protected points: LocationPoint<T>[] = [];
  protected markers: Marker<T>[] = [];
  protected icons: Icon<T>[] = [];
  protected focusInProgress = false;
  protected isMinifiedMarkerIcons = false;

  protected map?: MapObject<T>;
  protected cluster?: Cluster<T>;
  protected userMarker?: Marker<T>;

  constructor(
    domSelector: HTMLElement | string,
    protected readonly apiKey: ApiKey<T>,
    configuration: Partial<BatMapConfig<T>>,
    callback?: () => void,
    defaultOptions?: DefaultOptions<T>,
  ) {
    this.domElement = DomUtils.isHTMLElement(domSelector)
      ? (domSelector as HTMLElement)
      : document.querySelector(domSelector as string) || document.body;

    const config: BatMapConfig<T> = Object.assign(
      {},
      DEFAULT_CONFIG,
      configuration,
    );
    this.config = {
      ...config,
      mapOptions: Object.assign(
        {},
        defaultOptions?.mapOptions,
        config.mapOptions,
      ),
      markersOptions: Object.assign(
        {},
        defaultOptions?.markersOptions,
        config.markersOptions,
      ),
      labelsOptions: Object.assign(
        {},
        defaultOptions?.labelsOptions,
        config.labelsOptions,
      ),
    };

    this.load(callback);
  }

  load(callback?: () => void): void {
    callback && callback();
  }

  getPoints(): LocationPoint<T>[] {
    return this.points;
  }

  getMarkers(): Marker<T>[] {
    return this.markers;
  }

  getMarker(markerId: Marker<T> | string): Marker<T> | undefined {
    if (typeof markerId === 'string') {
      return this.markers.find(marker => marker.id === markerId);
    }

    return markerId;
  }

  getMarkerIcons(): Icon<T>[] {
    return this.icons;
  }

  getMarkerIconByType(iconType: string): Icon<T> | undefined {
    return this.icons.find(icon => icon.type === iconType);
  }

  getMarkerIconType(marker: Marker<T> | string): string | undefined {
    return this.getMarker(marker)?.iconType;
  }

  async getGeolocation(): Promise<GeolocationPosition> {
    if (!navigator.geolocation) {
      throw new Error('The browser does not support geolocation');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        maximumAge: 60000,
        timeout: 20000,
        enableHighAccuracy: true,
      });
    });
  }

  clearPoints(): void {
    this.points.length = 0;
  }

  removeAllMarkers(): void {
    this.removeCluster();

    this.markers.forEach(marker => {
      this.removeMarker(marker);
    });
  }

  removeCluster(): void {
    this.cluster && delete this.cluster;
  }

  removeMarker(markerId: Marker<T> | string): void {
    this.markers = this.markers.filter(
      marker => marker.id !== this.getMarker(markerId)?.id,
    );
  }
}
