import { Provider } from '../constants';

export type WithProvider<
  T extends Provider,
  GmapsType,
  LeafletType,
  MappyType,
  DefaultType = undefined
> = T extends Provider.gmaps
  ? GmapsType
  : T extends Provider.leaflet
  ? LeafletType
  : T extends Provider.mappy
  ? MappyType
  : DefaultType;
