import {
  ApiKey,
  BatMapProvider,
  BatMapConfig,
  LatLngBounds,
  Location,
  LocationPoint,
  Marker,
  Provider,
} from '@bridge/batMap';

import { getBatMapProvider, makeLocations } from '../utils';

export class ResultsMapModule<T extends Provider = Provider> {
  readonly config: BatMapConfig;
  readonly locations: Location[];
  readonly batMap: BatMapProvider<T>;

  private readonly locationListSelector = '#locationsList';
  private readonly locationIdAttribute = 'data-location';

  constructor(
    domSelector: string,
    config: BatMapConfig<T>,
    readonly provider: T,
    apiKey: ApiKey<T>,
  ) {
    const domElement = document.querySelector<HTMLElement>(domSelector);

    if (!domElement) {
      throw new Error(`"${domSelector}" element not found`);
    }

    this.config = {
      ...config,
    };

    this.locations = makeLocations(20);
    this.fillDomLocationsList();

    this.batMap = (getBatMapProvider(
      provider,
      domElement,
      apiKey,
      this.config,
      this.initMap.bind(this),
    ) as unknown) as BatMapProvider<T>;
  }

  bindEvents(): void {
    document.querySelectorAll('[data-location]').forEach(location => {
      const markerId = location.getAttribute(this.locationIdAttribute);

      if (markerId) {
        location.addEventListener(
          'click',
          this.handleClickOnLocation(markerId),
        );

        location.addEventListener(
          'mouseenter',
          this.handleMouseEnterOnLocation(markerId),
        );

        location.addEventListener(
          'mouseleave',
          this.handleMouseLeaveOnLocation(markerId),
        );
      }
    });
  }

  fillDomLocationsList(): void {
    this.locations.forEach(location => {
      const li = document.createElement('li');
      li.classList.add('location');
      li.setAttribute('data-location', location._id);
      li.innerText = location.name;

      document.querySelector(this.locationListSelector)?.appendChild(li);
    });
  }

  initMap(): void {
    this.batMap.initMap();
    this.setMarkerIcons();
    this.locateOnMap();
    this.setPoints();
    this.addMarkers();

    if (!this.config.showLabel && !this.config.showCluster) {
      this.batMap.listenZoomChange(zoom => {
        this.batMap.minifyMarkerIcons(zoom);
      });
    }

    this.panToAllMarkers();
    this.bindEvents();
  }

  setPoints(): void {
    this.locations.forEach((location, index) => {
      if (this.config.showLabel) {
        this.batMap.setPoint(location, 'default', `${index}`);
        return;
      }

      this.batMap.setPoint(location, 'default');
    });
  }

  getPoints(): LocationPoint<T>[] {
    return this.batMap.getPoints();
  }

  setMarkerIcons(): void {
    this.batMap.setMarkerIcons();
  }

  setIconOnMarker(marker: string | Marker<T>, iconType: string): void {
    this.batMap.setIconOnMarker(marker, iconType);
  }

  focusOnMarker(marker: string | Marker<T>): void {
    this.batMap.focusOnMarker(marker);
  }

  addMarkers(): void {
    this.batMap.addMarkers({
      click: this.handleClickOnMarker.bind(this),
      mouseover: this.handleMouseEnterOnMarker.bind(this),
      mouseout: this.handleMouseLeaveOnMarker.bind(this),
    });
  }

  getMarkers(): Marker<T>[] {
    return this.batMap.getMarkers();
  }

  locateOnMap(): void {
    if (this.config.showPosition) {
      this.batMap
        .getGeolocation()
        .then(position => {
          const coords = this.batMap.makeLatLng(
            position.coords.latitude,
            position.coords.longitude,
          );

          this.batMap.addUserMarker(coords, 'user');
          this.panToAllMarkers();
        })
        .catch((error: Error) => {
          console.error('locateOnMap(): ' + error.message);
        });
    }
  }

  panToAllMarkers(): void {
    const bounds = this.batMap.getBounds() as LatLngBounds<T>;
    this.batMap.fitBounds(bounds, { zoom: this.config.zoom });
  }

  getMarkerIconType(marker: Marker<T>): string | undefined {
    return this.batMap.getMarkerIconType(marker);
  }

  handleClickOnMarker(marker: Marker<T>) {
    return (): void => {
      if (this.getMarkerIconType(marker) !== 'active') {
        this.getMarkers().forEach(m => {
          this.setIconOnMarker(m, 'default');
        });

        this.setIconOnMarker(marker, 'active');
        this.focusOnMarker(marker);
        this.scrollToLocation(marker.id);
        this.highlightLocation(marker.id, true);
      }
    };
  }

  handleMouseEnterOnMarker(marker: Marker<T>) {
    return (): void => {
      /**
       * NOTE: Set all non active markers to default icon for Mappy and Leaflet
       *   prevent markers to not update correctly when showLabel is set to true
       */
      if (
        this.config.showLabel &&
        (this.provider === 'mappy' || this.provider === 'leaflet')
      ) {
        this.getMarkers()
          .filter(m => {
            const type = this.getMarkerIconType(m);
            return (
              type !== 'active' && type !== 'default' && marker.id !== m.id
            );
          })
          .forEach(m => {
            this.setIconOnMarker(m, 'default');
          });
      }

      if (
        this.getMarkerIconType(marker) !== 'active' &&
        this.getMarkerIconType(marker) !== 'hover'
      ) {
        this.setIconOnMarker(marker, 'hover');
        this.highlightLocation(marker.id);
      }
    };
  }

  handleMouseLeaveOnMarker(marker: Marker<T>) {
    return (): void => {
      if (
        this.getMarkerIconType(marker) !== 'active' &&
        this.getMarkerIconType(marker) !== 'default'
      ) {
        this.setIconOnMarker(marker, 'default');
        this.highlightLocation();
      }
    };
  }

  handleClickOnLocation(markerId: string) {
    return (): void => {
      this.getMarkers().forEach(m => {
        this.setIconOnMarker(m, 'default');
      });

      const marker = this.batMap.getMarker(markerId);
      if (marker) {
        this.setIconOnMarker(marker, 'active');
        this.focusOnMarker(marker);
        this.highlightLocation(markerId, true);
      }
    };
  }

  handleMouseEnterOnLocation(markerId: string) {
    return (): void => {
      const marker = this.batMap.getMarker(markerId);
      if (marker) {
        if (this.getMarkerIconType(marker) !== 'active') {
          this.setIconOnMarker(marker, 'hover');
          this.highlightLocation(markerId);
        } else {
          this.highlightLocation(markerId, true);
        }
      }
    };
  }

  handleMouseLeaveOnLocation(markerId: string) {
    return (): void => {
      const marker = this.batMap.getMarker(markerId);
      if (marker) {
        if (this.getMarkerIconType(marker) !== 'active') {
          this.setIconOnMarker(marker, 'default');
          this.highlightLocation();
        } else {
          this.highlightLocation(markerId, true);
        }
      }
    };
  }

  highlightLocation(markerId?: string, isActive = false): void {
    document.querySelectorAll('[data-location]').forEach(l => {
      l.classList.remove('hover');
    });

    if (markerId) {
      const location = this.getLocationElement(markerId);

      if (location) {
        location.classList.add('hover');

        if (isActive) {
          document
            .querySelectorAll(`[${this.locationIdAttribute}]`)
            .forEach(l => {
              l.classList.remove('active');
            });

          location.classList.add('active');
        }
      }
    }
  }

  scrollToLocation(markerId: string): void {
    const location = this.getLocationElement(markerId);
    const list = this.getLocationListElement();

    if (location && list) {
      list.scrollTo({
        top: location.offsetTop - location.clientHeight - list.offsetTop,
        behavior: 'smooth',
      });
    }
  }

  getLocationElement(markerId: string): HTMLElement | null {
    return document.querySelector<HTMLElement>(
      `[${this.locationIdAttribute}="${markerId}"]`,
    );
  }

  getLocationListElement(): HTMLElement | null {
    return document.querySelector<HTMLElement>(this.locationListSelector);
  }
}
