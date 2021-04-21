/**
 * Google Maps v3
 * API Documentation: https://developers.google.com/maps/documentation/javascript/
 * MarkerClusterer: https://googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html
 */

import { AbstractMap } from '../../AbstractMap';
import { DefaultIconType, Provider } from '../../constants';
import {
  EventCallbacks,
  LabelsOptions,
  LatLng,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngObject,
  Location,
  LocationPoint,
  Marker,
  Padding,
  Point,
  BatMapProvider,
  ProviderConstructorArgs,
} from '../../interfaces';
import { MarkerClusterer } from '../../plugins/MarkerClustererPlus';
import { DomUtils, LoaderUtils } from '../../utils';

import { GmapsPremium } from './GmapsPremium';

type provider = Provider.gmaps;

export default GoogleMaps;

export class GoogleMaps
  extends AbstractMap<provider>
  implements BatMapProvider<provider> {
  private initialBoundsEvent = false;

  constructor(...args: ProviderConstructorArgs<provider>) {
    super(...args, {
      mapOptions: {
        center: { lat: 0, lng: 0 },
        zoom: 12,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: 1,
        },
        streetViewControl: false,
      },
    });
  }

  load(callback?: () => void): void {
    this.domElement.classList.add('batmap__map', 'batmap-gmaps');

    if (window.google && window.google.maps && callback) {
      callback();
      return;
    }

    let urlParams = `?v=3.40&language=${this.config.locale}`;

    if (Array.isArray(this.apiKey)) {
      const [client, secret, channel] = this.apiKey;

      urlParams += `&client=${client}`;
      urlParams += GmapsPremium.sign(
        'https://maps.googleapis.com/maps/api/js',
        secret,
      );

      if (channel) {
        urlParams += `&channel=${channel}`;
      }
    } else {
      urlParams += `&key=${this.apiKey}`;
    }

    const resources = [
      DomUtils.createScript(`//maps.googleapis.com/maps/api/js${urlParams}`),
    ];

    DomUtils.addResources(
      document.head,
      resources,
      LoaderUtils.addLoader(this.domElement, callback),
    );
  }

  initMap(): void {
    this.map = new google.maps.Map(this.domElement, this.config.mapOptions);
    this.initialBoundsEvent = true;
  }

  setPoint(location: Location, iconType: string, label?: string): void {
    const point: LocationPoint<provider> = {
      position: this.makeLatLng(
        location.localisation.coordinates.latitude,
        location.localisation.coordinates.longitude,
      ),
      id: `${location._id}`,
      location,
      iconType,
    };

    if (this.config.showLabel && label) {
      point.label = `${label}`;
    }

    this.points.push(point);
  }

  addMarkers(eventCallback: EventCallbacks<provider> = {}): void {
    this.points.forEach(point => {
      this.addMarker(point, eventCallback);
    });

    if (
      this.config.showCluster &&
      this.getMarkerIconByType(DefaultIconType.cluster)
    ) {
      this.addCluster();
    }
  }

  addMarker(
    point: LocationPoint<provider>,
    eventCallbacks: EventCallbacks<provider> = {},
  ): void {
    const marker = new google.maps.Marker({
      map: this.map,
      ...point,
    }) as Marker<provider>;

    this.markers.push(marker);
    this.setIconOnMarker(marker, point.iconType);

    Object.keys(eventCallbacks).forEach(event => {
      const callback = eventCallbacks[event];
      callback && marker.addListener(event as any, callback(marker));
    });

    const position = marker.getPosition();
    position && this.extendBounds(position);
  }

  removeMarker(markerId: Marker<provider> | string): void {
    const marker = this.getMarker(markerId);

    if (marker) {
      marker.setMap(null);
      this.markers = this.markers.filter(m => m.id !== marker.id);
    }
  }

  removeCluster(): void {
    this.cluster?.clearMarkers();
  }

  setMarkerIcons(): void {
    Object.keys(this.config.markersOptions).forEach(type => {
      if (type in this.config.markersOptions) {
        const options = this.config.markersOptions[type];
        const iconAnchor = options.anchor || [
          options.width / 2,
          options.height,
        ];
        const iconLabelOptions = options.label || {};
        const labelOrigin =
          options.label && options.label.origin
            ? options.label.origin
            : this.config.labelsOptions.origin || [
                options.width / 2,
                options.height / 2,
              ];

        this.icons.push({
          type,
          url: options.url,
          scaledSize: new google.maps.Size(options.width, options.height),
          anchor: new google.maps.Point(iconAnchor[0], iconAnchor[1]),
          labelOrigin: new google.maps.Point(labelOrigin[0], labelOrigin[1]),
          labelOptions: this.getLabelOptions(iconLabelOptions),
        });
      }
    });
  }

  setIconOnMarker(
    markerId: Marker<provider> | string,
    iconType: string,
    hasLabel = true,
  ): void {
    const marker = this.getMarker(markerId);
    const icon = this.getMarkerIconByType(iconType);

    if (marker && icon) {
      marker.setIcon(icon);
      marker.iconType = iconType;

      if (this.config.showLabel && hasLabel) {
        const { color, font, size, weight } = icon.labelOptions;

        marker.setLabel({
          color,
          fontFamily: font,
          fontSize: size,
          fontWeight: weight,
          text: marker.label || '',
        });
      }
    }
  }

  focusOnMarker(
    markerId: Marker<provider> | string,
    offset?: Point<provider>,
  ): void {
    this.focusInProgress = true;
    let hasOffset: number | boolean = offset?.x || offset?.y || false;

    const listener = this.map?.addListener('idle', () => {
      if (hasOffset) {
        hasOffset = false;
        this.map?.panBy(offset?.x || 0, offset?.y || 0);
      } else {
        this.focusInProgress = false;
        listener && google.maps.event.removeListener(listener);
      }
    });

    this.map?.setZoom(this.config.locationZoom);

    const marker = this.getMarker(markerId);
    const position = marker?.getPosition();
    marker && position && this.panTo(position);
  }

  addUserMarker(
    position: LatLng<provider>,
    iconType: string,
    id = 'user',
  ): void {
    const point: LocationPoint<provider> = {
      id: `${id}`,
      position,
      iconType,
    };

    this.userMarker = new google.maps.Marker(point) as Marker<provider>;

    if (this.userMarker && this.map) {
      this.userMarker.setMap(this.map);
      this.setIconOnMarker(this.userMarker, iconType, false);
      this.extendBounds(position);
    }
  }

  addCluster(): void {
    const icon = this.getMarkerIconByType(DefaultIconType.cluster);

    const options = icon && {
      averageCenter: true,
      clusterClass: 'batmap-marker-cluster',
      styles: [
        {
          url: icon.url,
          width: icon.scaledSize?.width,
          height: icon.scaledSize?.height,
          anchorText: [
            Math.ceil(
              icon.labelOrigin!.y -
                icon.scaledSize!.height / 2 +
                (icon.labelOptions!.size as any) * 1.2,
            ),
            Math.ceil(icon.labelOrigin!.x - icon.scaledSize!.width / 2),
          ], // [yOffset, xOffset]
          anchorIcon: [icon.anchor!.y, icon.anchor!.x], // [yOffset, xOffset]
          textSize: icon.labelOptions.size,
          textColor: icon.labelOptions.color,
          fontWeight: icon.labelOptions.weight,
          fontSize: icon.labelOptions.size,
          fontFamily: icon.labelOptions.font,
        },
      ],
    };

    this.cluster = new MarkerClusterer(this.map, this.markers as any, options);
  }

  getZoom(): number | undefined {
    return this.map?.getZoom();
  }

  setZoom(zoom: number): void {
    this.map?.setZoom(zoom);
  }

  makeLatLng(latitude: number, longitude: number): LatLng<provider> {
    return new google.maps.LatLng(latitude, longitude);
  }

  setCenter(position: LatLng<provider>): void {
    this.map?.setCenter(position);
  }

  getCenterLatLng(): LatLngObject {
    const center = this.map?.getCenter();

    return {
      lat: center?.lat() || 0,
      lng: center?.lng() || 0,
    };
  }

  getBounds(): LatLngBounds<provider> | null | undefined {
    return this.map?.getBounds();
  }

  getBoundsLiteral(): LatLngBoundsLiteral {
    const bounds = this.getBounds();

    if (!bounds) {
      return [0, 0, 0, 0];
    }

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    return [southWest.lat(), southWest.lng(), northEast.lat(), northEast.lng()];
  }

  extendBounds(position: LatLng<provider>): LatLngBounds<provider> | undefined {
    return this.map?.getBounds()?.extend(position);
  }

  fitBounds(
    bounds: LatLngBounds<provider>,
    { padding = 50 }: { padding?: Padding },
  ): void {
    this.map?.fitBounds(bounds, padding);
  }

  panTo(position: LatLng<provider>): void {
    this.map?.panTo(position);
  }

  panBy(x: number, y: number): void {
    this.map?.panBy(x, y);
  }

  listenZoomChange(callback: (zoom: number) => void): void {
    this.map?.addListener('zoom_changed', () => {
      return this.map && callback(this.map.getZoom());
    });
  }

  listenBoundsChange(
    callback: (bounds: LatLngObject) => void,
    ignoreFocusOnMarker = true,
  ): void {
    this.map?.addListener('bounds_changed', () => {
      if (ignoreFocusOnMarker && this.focusInProgress) {
        return;
      }

      if (this.initialBoundsEvent) {
        this.initialBoundsEvent = false;
        return;
      }

      return callback(this.getCenterLatLng());
    });
  }

  minifyMarkerIcons(breakZoom = 8, minifier = 0.8): void {
    const zoom = this.getZoom();

    if (zoom && zoom < breakZoom + 1 && !this.isMinifiedMarkerIcons) {
      this.icons.forEach(icon => {
        const size = icon.scaledSize;
        const width = (size?.width || 0) * minifier;
        const height = (size?.height || 0) * minifier;

        icon.scaledSize = new google.maps.Size(width, height);
        icon.anchor = new google.maps.Point(width / 2, height);
      });
      this.refreshAllMarkers();

      this.isMinifiedMarkerIcons = true;
    } else if (zoom && zoom > breakZoom && this.isMinifiedMarkerIcons) {
      this.icons.forEach(icon => {
        const size = icon.scaledSize;
        const width = (size?.width || 0) / minifier;
        const height = (size?.height || 0) / minifier;

        icon.scaledSize = new google.maps.Size(width, height);
        icon.anchor = new google.maps.Point(width / 2, height);
      });
      this.refreshAllMarkers();

      this.isMinifiedMarkerIcons = false;
    }
  }

  refreshAllMarkers(): void {
    this.getMarkers().forEach(marker => {
      const iconName = this.getMarkerIconType(marker);
      const icon = iconName && this.getMarkerIconByType(iconName);

      icon && marker.setIcon(icon);
    });

    if (this.userMarker) {
      const icon = this.getMarkerIconByType(DefaultIconType.user);
      icon && this.userMarker.setIcon(icon);
    }
  }

  private getLabelOptions(options: LabelsOptions): LabelsOptions {
    return {
      color: options.color || this.config.labelsOptions.color,
      font: options.font || this.config.labelsOptions.font,
      size: options.size || this.config.labelsOptions.size,
      weight: options.weight || this.config.labelsOptions.weight,
    };
  }
}
