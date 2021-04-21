import { Config, Provider } from '@bridge/batMap';

export const mapConfig: Config<Provider> = {
  locale: 'en',
  showCluster: true,
  showLabel: true,
  showPosition: true,
  zoom: 12,
  locationZoom: 16,
  mapOptions: {},
  markersOptions: {
    default: {
      url: './assets/markers/marker-default.svg',
      width: 38,
      height: 50,
    },
    hover: {
      url: './assets/markers/marker-hover.svg',
      width: 38,
      height: 50,
    },
    active: {
      url: './assets/markers/marker-active.svg',
      width: 38,
      height: 50,
    },
    location: {
      url: './assets/markers/marker-location.svg',
      width: 38,
      height: 50,
    },
    user: {
      url: './assets/markers/marker-user.svg',
      width: 38,
      height: 50,
    },
    cluster: {
      url: './assets/markers/marker-cluster.svg',
      width: 50,
      height: 50,
      label: {
        origin: [25, 25],
        size: '14', // TODO: should be number for clusters --> adapt providers for a string
      },
    },
  },
  labelsOptions: {
    origin: [19, 19],
    color: 'white',
    font: 'Arial, sans-serif',
    size: '14px',
    weight: 'normal',
  },
};
