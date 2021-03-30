import objectAssign from 'object-assign';

import { domUtils } from './utils';

import './style.css';

export class AbstractMap {
  constructor(
    domSelector,
    apiKey,
    locale,
    showCluster = false,
    showLabel = false,
    showPosition = false,
    callback = () => {},
  ) {
    this.domElement = domUtils.isHTMLElement(domSelector)
      ? domSelector
      : document.querySelector(domSelector);
    this.domId = this.domElement.id || '';

    this.apiKey = apiKey;
    this.locale = locale || 'en';
    this.provider = '[No provider defined]';

    this.showCluster = showCluster;
    this.showLabel = showLabel;
    this.showPosition = showPosition;

    this.map = null;
    this.points = [];
    this.markers = [];
    this.icons = [];
    this.bounds = null;
    this.cluster = null;

    this.defaultOptions = {
      zoom: 12,
      locationZoom: 16,
    };

    this.load(callback);
  }

  load(callback) {
    callback();
  }

  setMapOptions(options = {}, markers = {}, labels = {}, clusters = {}) {
    this.mapOptions = objectAssign(this.defaultOptions, options);
    this.markersOptions = markers;
    this.labelsOptions = labels;
    this.clustersOptions = clusters;
  }

  getPoints() {
    return this.points;
  }

  getMarkers() {
    return this.markers;
  }

  getMarker(marker) {
    if (typeof marker === 'string') {
      marker = this.markers.find(m => {
        return m.id === marker;
      });
    }

    return marker;
  }

  getMarkerIcons() {
    return this.icons;
  }

  getMarkerIconByType(iconType) {
    if (this.icons[iconType]) {
      return this.icons[iconType];
    }

    return false;
  }

  getMarkerIconType(marker) {
    marker = this.getMarker(marker);
    return marker.iconType;
  }

  getGeolocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          maximumAge: 60000,
          timeout: 20000,
          enableHighAccuracy: true,
        });
      } else {
        reject(new Error());
      }
    });
  }

  initMap() {
    console.error(`${this.provider} has no 'initMap' method implemented.`);
  }

  setPoint() {
    console.error(`${this.provider} has no 'setPoint' method implemented.`);
  }

  addMarkers() {
    console.error(`${this.provider} has no 'addMarkers' method implemented.`);
  }

  addUserMarker() {
    console.error(
      `${this.provider} has no 'addUserMarker' method implemented.`,
    );
  }

  addMarker() {
    console.error(`${this.provider} has no 'addMarker' method implemented.`);
  }

  removeMarker() {
    console.error(`${this.provider} has no 'removeMarker' method implemented.`);
  }

  setMarkerIcons() {
    console.error(
      `${this.provider} has no 'setMarkerIcons' method implemented.`,
    );
  }

  setIconOnMarker() {
    console.error(
      `${this.provider} has no 'setIconOnMarker' method implemented.`,
    );
  }

  focusOnMarker() {
    console.error(
      `${this.provider} has no 'focusOnMarker' method implemented.`,
    );
  }

  addCluster() {
    console.error(`${this.provider} has no 'addCluster' method implemented.`);
  }

  setCenter() {
    console.error(`${this.provider} has no 'setCenter' method implemented.`);
  }

  fitBounds() {
    console.error(`${this.provider} has no 'fitBounds' method implemented.`);
  }

  extendBounds() {
    console.error(`${this.provider} has no 'extendBounds' method implemented.`);
  }

  getBounds() {
    console.error(`${this.provider} has no 'getBounds' method implemented.`);
  }

  panTo() {
    console.error(`${this.provider} has no 'panTo' method implemented.`);
  }

  setZoom() {
    console.error(`${this.provider} has no 'setZoom' method implemented.`);
  }

  listenZoomChange() {
    console.error(
      `${this.provider} has no 'listenZoomChange' method implemented.`,
    );
  }

  minifyMarkerIcons() {
    console.error(
      `${this.provider} has no 'minifyMarkerIcons' method implemented.`,
    );
  }
}
