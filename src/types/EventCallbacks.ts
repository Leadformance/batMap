import { Provider } from '../constants';

import { Marker } from './Marker';

export interface EventCallbacks<T extends Provider> {
  [event: string]: (marker: Marker<T>) => void;
}
