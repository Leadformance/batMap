import GoogleMaps from '../../src/providers/gmaps';
import Leaflet from '../../src/providers/leaflet';
import Mappy from '../../src/providers/mappy';

export function getBatMapInstance(provider, ...rest) {
  switch (provider) {
    case 'gmaps':
      return new GoogleMaps(...rest);

    case 'leaflet':
      return new Leaflet(...rest);

    case 'mappy':
    default:
      return new Mappy(...rest);
  }
}
