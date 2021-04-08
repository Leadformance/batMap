import { Provider } from '../constants';

import { WithProvider } from './WithProvider';

export type ApiKey<T extends Provider> = WithProvider<
  T,
  GmapsApiKey,
  LeafletApiKey,
  MappyApiKey
>;

type GmapsApiKey = string | [client: string, secret: string, channel?: string];

type LeafletApiKey = never;

type MappyApiKey = string;
