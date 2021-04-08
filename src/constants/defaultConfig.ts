import { Config } from '../types';

import { Provider } from './providers';

export const DEFAULT_CONFIG: Config<Provider> = {
  locale: 'en',
  showCluster: true,
  showLabel: false,
  showPosition: true,
  zoom: 12,
  locationZoom: 16,
  mapOptions: {},
  markersOptions: {},
  labelsOptions: {},
};
