/**
 * Mappy Map
 * API Documentation: https://leafletjs.com/reference-1.0.3.html
 * MarkerCluster Documentation: https://leaflet.github.io/Leaflet.markercluster/
 */

import objectAssign from 'object-assign';

import { AbstractMap } from '../../AbstractMap';
import { domUtils, loaderUtils } from '../../utils';

let L;

export default class Mappy extends AbstractMap {
  constructor(...args) {
    super(...args);

    this.provider = 'Mappy';
  }

  load(callback) {
    this.domElement.classList.add('batmap__map', 'batmap-mappy');

    if (window.L && window.L.Mappy) {
      callback();
      return;
    }

    callback = loaderUtils.addLoader(this.domElement, callback);

    domUtils.addResources(
      document.head,
      [
        domUtils.createStyle(
          '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css',
        ),
        domUtils.createScript(
          '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.js',
        ),
      ],
      () => {
        const resources = [
          domUtils.createScript(
            '//d11lbkprc85eyb.cloudfront.net/Mappy/7.5.0/L.Mappy.js',
          ),
          domUtils.createStyle(
            '//d11lbkprc85eyb.cloudfront.net/Mappy/7.5.0/L.Mappy.css',
          ),
        ];

        if (this.showCluster) {
          resources.push(
            domUtils.createScript(
              '//d11lbkprc85eyb.cloudfront.net/plugins/mappy/7.5.0/leaflet.markercluster.js',
            ),
          );
          resources.push(
            domUtils.createStyle(
              '//d11lbkprc85eyb.cloudfront.net/plugins/mappy/7.5.0/MarkerCluster.Default.css',
            ),
          );
          resources.push(
            domUtils.createStyle(
              '//d11lbkprc85eyb.cloudfront.net/plugins/mappy/7.5.0/MarkerCluster.css',
            ),
          );
        }

        domUtils.addResources(document.head, resources, () => {
          L = window.L;
          L.Mappy.setImgPath(
            '//d11lbkprc85eyb.cloudfront.net/Mappy/7.5.0/images/',
          );
          callback();
        });
      },
    );
  }

  setMapOptions(options = {}, markers = {}, labels = {}, clusters = {}) {
    this.mapOptions = objectAssign(
      {
        clientId: this.apiKey,
        locale: this.locale,
        center: [0, 0],
        zoom: 12,
        locationZoom: 16,
        scrollwheel: true,
        mapTypeControl: false,
        panControl: false,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: false,
        layersControl: {
          publicTransport: false,
          traffic: true,
          viewMode: true,
          trafficLegend: true,
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
    this.map = new L.Mappy.Map(this.domElement, this.mapOptions);
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
    marker.options.alt = 'marker ' + point.location.name;

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
            html: `<img src="${icon.options.iconUrl}" class="map-marker-${iconType}__image" alt="${marker.options.alt}">${span.outerHTML}`,
          }),
        );
      } else {
        marker.setIcon(icon);
      }
    }
  }

  focusOnMarker(marker, offset = { x: 0, y: 0 }) {
    this.focusInProgress = true;
    let hasOffset = offset.x || offset.y;
    marker = this.getMarker(marker);

    const onMoveEnd = () => {
      if (hasOffset) {
        hasOffset = false;
        this.map.panBy(offset);
      } else {
        this.focusInProgress = false;
        this.map.off('moveend', onMoveEnd, this);
      }
    };
    this.map.on('moveend', onMoveEnd, this);

    this.panTo(marker.getLatLng());
  }

  addUserMarker(position, iconType, id = 0) {
    if (position) {
      // Backward compatibility
      const latLng =
        position.latitude && position.longitude
          ? this.makeLatLng(position.latitude, position.longitude)
          : position;

      this.userMarker = new L.marker(latLng);
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

  makeLatLng(latitude, longitude) {
    return L.latLng(latitude, longitude);
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

  fitBounds(bounds, zoom = this.mapOptions.zoom, padding = 50) {
    const options = {
      maxZoom: zoom,
    };

    if (!isNaN(padding)) {
      options['padding'] = L.point(padding, padding);
    } else {
      options['paddingTopLeft'] = L.point(padding.left || 0, padding.top || 0);
      options['paddingBottomRight'] = L.point(
        padding.right || 0,
        padding.bottom || 0,
      );
    }

    this.map.fitBounds(bounds, options);
  }

  panTo(position, zoom = this.mapOptions.locationZoom) {
    this.map.setView(position, zoom);
  }

  panBy(x, y) {
    this.map.panBy(L.point(x, y));
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
        const width = size[0] * minifier;
        const height = size[1] * minifier;

        this.icons[key].options.iconSize = [width, height];
        this.icons[key].options.iconAnchor = [width / 2, height];
      });

      this.refreshAllMarkers();

      this.isMinifiedMarkerIcons = true;
    } else if (zoom > breakZoom && this.isMinifiedMarkerIcons) {
      [].forEach.call(Object.keys(this.icons), key => {
        const size = this.icons[key].options.iconSize;
        const width = size[0] / minifier;
        const height = size[1] / minifier;

        this.icons[key].options.iconSize = [width, height];
        this.icons[key].options.iconAnchor = [width / 2, height];
      });

      this.refreshAllMarkers();

      this.isMinifiedMarkerIcons = false;
    }
  }

  refreshAllMarkers() {
    this.getMarkers().forEach(marker => {
      const iconName = this.getMarkerIconType(marker);
      marker.setIcon(this.icons[iconName]);
    });

    if (this.userMarker) {
      this.userMarker.setIcon(this.icons.user);
    }
  }
}
