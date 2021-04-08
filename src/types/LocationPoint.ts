import { Provider } from '../constants';

import { IconType } from './IconType';
import { LatLng } from './LatLng';
import { Location } from './Location';

export interface LocationPoint<T extends Provider> {
  id: string;
  position: LatLng<T>;
  iconType: IconType;
  label?: string;
  location?: Location;
}
