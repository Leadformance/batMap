/**
 * Leaflet Map
 * API Documentation: http://leafletjs.com/reference.html
 * MarkerCluster Documentation: https://leaflet.github.io/Leaflet.markercluster/
 * Free providers: https://leaflet-extras.github.io/leaflet-providers/preview/
 */

import objectAssign from 'object-assign';

import { AbstractMap } from '../../AbstractMap';
import { domUtils, loaderUtils } from '../../utils';

let L;

export default class Leaflet extends AbstractMap {
  constructor(...args) {
    super(...args);

    this.provider = 'Leaflet';
  }

  load(callback) {
    this.domElement.classList.add('batmap__map', 'batmap-leaflet');

    if (window.L) {
      callback();
      return;
    }

    callback = loaderUtils.addLoader(this.domElement, callback);

    domUtils.addResources(
      document.head,
      [
        domUtils.createStyle('//unpkg.com/leaflet@1.5.1/dist/leaflet.css'),
        domUtils.createScript('//unpkg.com/leaflet@1.5.1/dist/leaflet.js'),
      ],
      () => {
        const resources = [];

        if (this.showCluster) {
          resources.push(
            domUtils.createStyle(
              '//unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.css',
            ),
          );
          resources.push(
            domUtils.createStyle(
              '//unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.Default.css',
            ),
          );
          resources.push(
            domUtils.createScript(
              '//unpkg.com/leaflet.markercluster@1.1.0/dist/leaflet.markercluster.js',
            ),
          );
        }

        domUtils.addResources(document.head, resources, () => {
          L = window.L;
          callback();
        });
      },
    );
  }

  setMapOptions(options = {}, markers = {}, labels = {}, clusters = {}) {
    this.mapOptions = objectAssign(
      {
        center: [0, 0],
        zoom: 12,
        locationZoom: 16,
        tileLayerProvider: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tileLayerOptions: {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        },
      },
      options,
    );

    this.markersOptions = markers;

    this.labelsOptions = labels;

    this.clustersOptions = clusters;
  }

  initMap() {
    this.bounds = new L.latLngBounds([]);
    this.map = L.map(this.domElement, this.mapOptions);

    L.tileLayer(
      this.mapOptions.tileLayerProvider,
      this.mapOptions.tileLayerOptions,
    ).addTo(this.map);
  }
  setPoint(location, iconType, label = false) {
    const point = {
      position: L.latLng(
        location.localisation.coordinates.latitude,
        location.localisation.coordinates.longitude,
      ),
      id: `${location._id}`,
      location,
      iconType,
    };

    if (this.showLabel && label) {
      point.label = `${label}`;
    }

    this.points.push(point);
  }

  addMarkers(eventCallback = {}) {
    if (this.showCluster && this.icons.cluster) {
      this.addCluster();
    }

    [].forEach.call(this.points, point => {
      this.addMarker(point, eventCallback);
    });
  }

  addMarker(point, eventCallback = {}) {
    const marker = L.marker(point.position, point);
    marker.id = point.id;
    marker.location = point.location;

    if (this.showCluster && this.icons.cluster) {
      this.cluster.addLayer(marker);
    } else {
      marker.addTo(this.map);
    }

    [].forEach.call(Object.keys(eventCallback), event => {
      const callback = eventCallback[event];
      marker.on(event, callback(marker));
    });

    this.extendBounds(marker.getLatLng());

    this.markers.push(marker);

    this.setIconOnMarker(marker, point.iconType);
  }

  removeMarker(marker) {
    marker = this.getMarker(marker);

    marker.removeFrom(this.map);
    this.markers = this.markers.filter(m => m.id !== marker.id);
  }

  removeCluster() {
    this.cluster.remove();
  }

  setMarkerIcons() {
    Object.keys(this.markersOptions).forEach(type => {
      const options = this.markersOptions[type];
      const iconAnchor = options.anchor || [options.width / 2, options.height];
      const iconLabelOptions = options.label || {};

      this.icons[type] = new L.Icon({
        className: `batmap-marker-${type}`,
        iconUrl: options.url,
        iconSize: [options.width, options.height],
        iconAnchor,
        labelOptions: this.getLabelOptions(iconLabelOptions),
      });
    });
  }

  getLabelOptions(options) {
    return {
      origin: options.origin ||
        this.labelsOptions.origin || [options.width / 2, options.height / 2],
      color: options.color || this.labelsOptions.color,
      font: options.font || this.labelsOptions.font,
      size: options.size || this.labelsOptions.size,
      weight: options.weight || this.labelsOptions.weight,
    };
  }

  setIconOnMarker(marker, iconType, isLabeled = true) {
    marker = this.getMarker(marker);
    const icon = this.icons[iconType];

    if (marker && icon) {
      marker.iconType = iconType;

      if (this.showLabel && isLabeled) {
        const labelOptions = icon.options.labelOptions;
        const span = document.createElement('span');
        span.innerText = marker.options.label;

        span.style.position = 'absolute';
        span.style.top = `${labelOptions.origin[0]}px`;
        span.style.left = `${labelOptions.origin[1]}px`;
        span.style.transform = 'translate(-50%, -50%)';
        span.style.color = `${labelOptions.color}`;
        span.style.fontFamily = `${labelOptions.font}`;
        span.style.fontWeight = `${labelOptions.weight}`;
        span.style.fontSize = `${labelOptions.size}px`;

        marker.setIcon(
          new L.DivIcon({
            className: icon.options.className,
            iconSize: icon.options.iconSize,
            iconAnchor: icon.options.iconAnchor,
            html: `<img src="${icon.options.iconUrl}" class="map-marker-${iconType}__image">${span.outerHTML}`,
          }),
        );
      } else {
        marker.setIcon(icon);
      }
    }
  }

  focusOnMarker(marker) {
    this.focusInProgress = true;
    marker = this.getMarker(marker);

    const onMoveEnd = () => {
      this.focusInProgress = false;
      this.map.off('moveend', onMoveEnd, this);
    };
    this.map.on('moveend', onMoveEnd, this);

    this.panTo(marker.getLatLng());
  }

  addUserMarker(position, iconType, id = 0) {
    if (position) {
      this.userMarker = new L.marker(
        L.latLng(position.latitude, position.longitude),
      );
      this.userMarker.id = id;
      this.userMarker.addTo(this.map);

      this.setIconOnMarker(this.userMarker, iconType, false);
      this.extendBounds(this.userMarker.getLatLng());
    }
  }

  addCluster() {
    const icon = this.icons.cluster;

    this.cluster = L.markerClusterGroup(
      objectAssign(
        {
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          spiderfyOnMaxZoom: true,
          iconCreateFunction: cluster => {
            const labelOptions = icon.options.labelOptions;
            const span = document.createElement('span');
            span.innerText = cluster.getChildCount();

            span.style.position = 'absolute';
            span.style.top = `${labelOptions.origin[0]}px`;
            span.style.left = `${labelOptions.origin[1]}px`;
            span.style.transform = 'translate(-50%, -50%)';
            span.style.color = `${labelOptions.color}`;
            span.style.fontFamily = `${labelOptions.font}`;
            span.style.fontWeight = `${labelOptions.weight}`;
            span.style.fontSize = `${labelOptions.size}px`;

            return L.divIcon({
              className: icon.options.className,
              html:
                `<img src="${icon.options.iconUrl}" class="map-marker-cluster__image">` +
                span.outerHTML,
              iconSize: icon.options.iconSize,
            });
          },
        },
        this.clustersOptions,
      ),
    );

    this.map.addLayer(this.cluster);
  }

  getZoom() {
    return this.map.getZoom();
  }

  setZoom(zoom) {
    this.map.setZoom(zoom);
  }

  setCenter(position, zoom = this.mapOptions.zoom) {
    this.map.setView(position, zoom);
  }

  getCenterLatLng() {
    return this.map.getCenter();
  }

  getBounds() {
    return this.bounds;
  }

  getBoundsLatLng() {
    const bounds = this.map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    return [southWest.lat, southWest.lng, northEast.lat, northEast.lng];
  }

  extendBounds(position) {
    return this.bounds.extend(position);
  }

  fitBounds(bounds, zoom = this.mapOptions.zoom) {
    if (this.markers.length > 1) {
      this.map.fitBounds(bounds, {
        padding: L.point(50, 50),
        maxZoom: zoom,
      });
    } else {
      this.setCenter(this.markers[0].getLatLng(), zoom);
    }
  }

  panTo(position, zoom = this.mapOptions.locationZoom) {
    this.map.flyTo(position, zoom);
  }

  listenZoomChange(callback) {
    this.map.on('zoomend', () => {
      return callback(this.map.getZoom());
    });
  }

  listenBoundsChange(callback, ignoreFocusOnMarker = true) {
    this.map.on('move', () => {
      if (ignoreFocusOnMarker && this.focusInProgress) {
        return;
      }
      return callback(this.getCenterLatLng());
    });
  }

  minifyMarkerIcons(zoom, breakZoom = 8, minifier = 0.8) {
    if (zoom < breakZoom + 1 && !this.isMinifiedMarkerIcons) {
      [].forEach.call(Object.keys(this.icons), key => {
        const size = this.icons[key].options.iconSize;
        this.icons[key].options.iconSize = [
          size[0] * minifier,
          size[1] * minifier,
        ];
      });
      this.isMinifiedMarkerIcons = true;
      this.updateAllMarkerIconsOnMap();
    } else if (zoom > breakZoom && this.isMinifiedMarkerIcons) {
      [].forEach.call(Object.keys(this.icons), key => {
        const size = this.icons[key].options.iconSize;
        this.icons[key].options.iconSize = [
          size[0] / minifier,
          size[1] / minifier,
        ];
      });
      this.isMinifiedMarkerIcons = false;
      this.updateAllMarkerIconsOnMap();
    }
  }

  updateAllMarkerIconsOnMap() {
    [].forEach.call(this.markers, marker => {
      this.setIconOnMarker(marker, marker.iconType, false);
    });

    if (this.userMarker) {
      this.setIconOnMarker(this.userMarker, this.userMarker.iconType, false);
    }
  }
}
