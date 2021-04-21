import { Provider } from '../constants';

import { LabelsOptions } from './LabelsOptions';
import { MapOptions } from './MapOptions';
import { MarkersOptions } from './MarkersOptions';

export interface DefaultOptions<T extends Provider> {
  mapOptions?: MapOptions<T>;
  markersOptions?: MarkersOptions;
  labelsOptions?: LabelsOptions;
}
