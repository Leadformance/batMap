import { Provider } from '../constants';

import { DefaultOptions } from './DefaultOptions';

export interface BatMapConfig<T extends Provider = Provider>
  extends Required<DefaultOptions<T>> {
  locale: string;
  showCluster: boolean;
  showLabel: boolean;
  showPosition: boolean;
  zoom: number;
  locationZoom: number;
}
