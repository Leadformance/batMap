import { Provider } from '../constants';

import { LocationPoint } from './LocationPoint';
import { WithProvider } from './WithProvider';

export type Marker<T extends Provider> = WithProvider<
  T,
  GmapsMarker,
  LeafletMarker,
  MappyMarker
>;

type CommonMarker<T extends Provider> = Omit<LocationPoint<T>, 'position'>;

type GmapsMarker = CommonMarker<Provider.gmaps> & google.maps.Marker;

type LeafletMarker = CommonMarker<Provider.leaflet> & L.Marker;

type MappyMarker = CommonMarker<Provider.mappy> & L.Marker;
