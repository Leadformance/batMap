import { mapConfig } from '../config';
import { getBatMapInstance, makeLocations } from '../utils';

class LocationMapModule {
  constructor(domSelector, attributes = {}) {
    this.el = document.querySelector(domSelector);

    if (!this.el) {
      throw new Error(`"${domSelector}" element not found`);
    }

    this.attr = {
      ...attributes,
      showCluster: false,
      showLabel: false,
      showPosition: false,
      locations: makeLocations(1),
    };

    this.init();
  }

  init() {
    this.batMap = getBatMapInstance(
      this.attr.provider,
      this.el,
      this.attr.apiKey,
      this.attr.locale,
      this.attr.showCluster,
      this.attr.showLabel,
      this.attr.showPosition,
      this.initMap.bind(this),
    );
  }

  initMap() {
    this.batMap.setMapOptions(
      this.attr.options,
      this.attr.markers,
      this.attr.labels,
    );

    this.batMap.initMap();
    this.batMap.setMarkerIcons();

    this.attr.locations.forEach(location => {
      this.batMap.setPoint(location, 'location');
    });

    this.batMap.addMarkers();

    const coords = this.attr.locations[0].localisation.coordinates;
    this.map.setCenter(this.map.makeLatLng(coords.latitude, coords.longitude));
    this.map.setZoom(this.attr.options.locationZoom);
  }
}

new LocationMapModule('#myMap', mapConfig);
