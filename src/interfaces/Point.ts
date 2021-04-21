import { Provider } from '../constants';

import { WithProvider } from './WithProvider';

export type Point<T extends Provider> = WithProvider<
  T,
  GmapsPoint,
  LeafletPoint,
  MappyPoint
>;

type GmapsPoint = google.maps.Point;

type LeafletPoint = L.Point;

type MappyPoint = L.Point;
