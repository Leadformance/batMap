import { Provider } from '../constants';

import { WithProvider } from './WithProvider';

export type LatLngBounds<T extends Provider> = WithProvider<
  T,
  GmapsLatLngBounds,
  LeafletLatLngBounds,
  MappyLatLngBounds
>;

type GmapsLatLngBounds = google.maps.LatLngBounds;

type LeafletLatLngBounds = L.LatLngBounds;

type MappyLatLngBounds = L.LatLngBounds;
