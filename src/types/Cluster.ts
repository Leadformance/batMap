import { Provider } from '../constants';

import { WithProvider } from './WithProvider';

// TODO: get Cluster types from providers
export type Cluster<T extends Provider> = WithProvider<
  T,
  GmapsCluster,
  LeafletCluster,
  MappyCluster
>;

type GmapsCluster = any; // TODO: set correct type

type LeafletCluster = L.MarkerClusterGroup;

type MappyCluster = L.MarkerClusterGroup;
