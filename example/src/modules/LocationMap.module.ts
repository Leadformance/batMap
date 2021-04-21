import {
  ApiKey,
  BatMapConfig,
  BatMapProvider,
  Provider,
  Location,
} from '@bridge/batMap';

import { getBatMapProvider, makeLocations } from '../utils';

export class LocationMapModule<T extends Provider = Provider> {
  readonly config: BatMapConfig<T>;
  readonly locations: Location[];
  readonly batMap: BatMapProvider<T>;

  constructor(
    domSelector: string,
    config: BatMapConfig,
    provider: T,
    apiKey: ApiKey<T>,
  ) {
    const domElement = document.querySelector<HTMLElement>(domSelector);

    if (!domElement) {
      throw new Error(`"${domSelector}" element not found`);
    }

    this.config = {
      ...config,
      showCluster: false,
      showLabel: false,
      showPosition: false,
    };

    this.locations = makeLocations(1);

    this.batMap = (getBatMapProvider<T>(
      provider,
      domElement,
      apiKey,
      this.config,
      this.initMap.bind(this),
    ) as unknown) as BatMapProvider<T>;
  }

  initMap(): void {
    this.batMap.initMap();
    this.batMap.setMarkerIcons();

    this.locations.forEach(location => {
      this.batMap.setPoint(location, 'location');
    });

    this.batMap.addMarkers();

    const coords = this.locations[0].localisation.coordinates;
    this.batMap.setCenter(
      this.batMap.makeLatLng(coords.latitude, coords.longitude),
    );
    this.batMap.setZoom(this.config.locationZoom);
  }
}
