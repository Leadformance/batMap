import { Provider } from '../constants';

import { IconType } from './IconType';
import { LabelsOptions } from './LabelsOptions';
import { WithProvider } from './WithProvider';

export type Icon<T extends Provider> = WithProvider<
  T,
  GmapsIcon,
  LeafletIcon,
  MappyIcon
>;

interface CommonIcon {
  type: IconType;
}

type GmapsIcon = {
  labelOptions: LabelsOptions;
} & CommonIcon &
  google.maps.Icon;

type LeafletIcon = {
  options: {
    labelOptions: LabelsOptions;
  };
} & CommonIcon &
  L.Icon;

type MappyIcon = {
  options: {
    labelOptions: LabelsOptions;
  };
} & CommonIcon &
  L.Icon;
