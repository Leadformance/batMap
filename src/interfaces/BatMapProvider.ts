import { AbstractMap } from '../AbstractMap';
import { Provider } from '../constants';

import { EventCallbacks } from './EventCallbacks';
import { LatLng } from './LatLng';
import { LatLngBounds } from './LatLngBounds';
import { LatLngBoundsLiteral } from './LatLngBoundsLiteral';
import { LatLngObject } from './LatLngObject';
import { Location } from './Location';
import { LocationPoint } from './LocationPoint';
import { Marker } from './Marker';
import { Padding } from './Padding';
import { Point } from './Point';

export interface BatMapProvider<T extends Provider> extends AbstractMap<T> {
  /**
   * Create map object and add it to the DOM
   */
  initMap(): void;

  /**
   * Set a point
   */
  setPoint(location: Location, iconType: string, label?: string): void;

  /**
   * Add markers
   */
  addMarkers(eventCallbacks?: EventCallbacks<T>): void;

  /**
   * Add marker
   */
  addMarker(point: LocationPoint<T>, eventCallbacks?: EventCallbacks<T>): void;

  /**
   * Focus on marker
   */
  focusOnMarker(marker: Marker<T> | string, offset?: Point<T>): void;

  /**
   * Add user marker
   */
  addUserMarker(position: LatLng<T>, iconType: string, id?: string): void;

  /**
   * Remove marker
   */
  removeMarker(markerId: Marker<T> | string): void;

  /**
   * Set marker icons
   */
  setMarkerIcons(): void;

  /**
   * Set icon on marker
   * TODO: check if the arg `hasLabel` can't be remove and use `marker.label` instead
   */
  setIconOnMarker(
    markerId: Marker<T> | string,
    iconType: string,
    hasLabel?: boolean,
  ): void;

  /**
   * Add cluster
   */
  addCluster(): void;

  /**
   * Remove cluster
   */
  removeCluster(): void;

  /**
   * Make lat lng
   */
  makeLatLng(latitude: number, longitude: number): LatLng<T>;

  /**
   * Set center
   */
  setCenter(position: LatLng<T>, zoom?: number): void;

  /**
   * Get center lat lng
   */
  getCenterLatLng(): LatLngObject;

  /**
   * Fit bounds
   */
  fitBounds(
    bounds: LatLngBounds<T>,
    options: { padding?: Padding; zoom?: number },
  ): void;

  /**
   * Extend bounds
   */
  extendBounds(position: LatLng<T>): LatLngBounds<T> | undefined;

  /**
   * Get bounds
   */
  getBounds(): LatLngBounds<T> | null | undefined;

  /**
   * Get bounds lat lng
   */
  getBoundsLiteral(): LatLngBoundsLiteral;

  /**
   * Pan to
   */
  panTo(position: LatLng<T>, zoom?: number): void;

  /**
   * Pan by
   */
  panBy(x: number, y: number): void;

  /**
   * Get zoom
   */
  getZoom(): number | undefined;

  /**
   * Set zoom
   */
  setZoom(zoom: number): void;

  /**
   * Listen zoom change
   */
  listenZoomChange(callback: (zoom: number) => void): void;

  /**
   * Listen bounds change
   */
  listenBoundsChange(
    callback: (bounds: LatLngObject) => void,
    ignoreFocusOnMarker?: boolean,
  ): void;

  /**
   * Minify marker icons
   */
  minifyMarkerIcons(breakZoom?: number, minifier?: number): void;
}
