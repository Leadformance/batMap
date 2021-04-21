import { Provider } from '../constants';

import { LatLng } from './LatLng';
import { Location } from './Location';

export interface LocationPoint<T extends Provider> {
  id: string;
  position: LatLng<T>;
  iconType: string;
  label?: string;
  location?: Location;
}
