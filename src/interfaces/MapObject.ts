import { Provider } from '../constants';

import { WithProvider } from './WithProvider';

export type MapObject<T extends Provider> = WithProvider<
  T,
  GmapsMap,
  LeafletMap,
  MappyMap
>;

type GmapsMap = google.maps.Map;

type LeafletMap = L.Map;

type MappyMap = L.Map;
