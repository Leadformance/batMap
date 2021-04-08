import { Provider } from '../constants';

import { ApiKey } from './ApiKey';
import { Config } from './Config';

export type ProviderConstructorArgs<T extends Provider> = [
  domSelector: HTMLElement | string,
  apiKey: ApiKey<T>,
  configuration: Partial<Config<T>>,
  callback?: () => void,
];
