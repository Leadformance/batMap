import { LabelsOptions } from './LabelsOptions';

export interface MarkersOptions {
  [iconType: string]: MarkerOptions;
}

export interface MarkerOptions {
  url: string;
  width: number;
  height: number;
  anchor?: [x: number, y: number];
  label?: LabelsOptions;
}
