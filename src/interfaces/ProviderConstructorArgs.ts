import { Provider } from '../constants';

import { ApiKey } from './ApiKey';
import { BatMapConfig } from './BatMapConfig';

export type ProviderConstructorArgs<T extends Provider> = [
  domSelector: HTMLElement | string,
  apiKey: ApiKey<T>,
  configuration: Partial<BatMapConfig<T>>,
  callback?: () => void,
];
