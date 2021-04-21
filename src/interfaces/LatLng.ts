import { Provider } from '../constants';

import { WithProvider } from './WithProvider';

export type LatLng<T extends Provider> = WithProvider<
  T,
  GmapsLatLng,
  LeafletLatLng,
  MappyLatLng
>;

type GmapsLatLng = google.maps.LatLng;

type LeafletLatLng = L.LatLng;

type MappyLatLng = L.LatLng;
