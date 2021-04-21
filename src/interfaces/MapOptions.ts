import { Provider } from '../constants';

import { WithProvider } from './WithProvider';

export type MapOptions<T extends Provider> = WithProvider<
  T,
  GmapsMapOptions,
  LeafletMapOptions,
  MappyMapOptions
>;

type GmapsMapOptions = google.maps.MapOptions;

type LeafletMapOptions = L.MapOptions & {
  tileLayerProvider: string;
  tileLayerOptions?: L.TileLayerOptions;
};

type MappyMapOptions = L.Mappy.MapOptions;
