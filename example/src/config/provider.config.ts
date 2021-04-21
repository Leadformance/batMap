import { ApiKey, Provider } from '@bridge/batMap';

export type ProviderConfig<T extends Provider> = [
  provider: Provider,
  apiKey: ApiKey<T>,
];

/**
 * GoogleMaps
 */
export const providerConfig: ProviderConfig<Provider.gmaps> = [
  Provider.gmaps,
  'AIzaSyBgMN26G65UEgkWVDIPKTq-VpvktLmezjQ',
];

/**
 * GoogleMaps Premium
 */
// export const providerConfig: ProviderConfig<Provider.gmaps> = [
//   Provider.gmaps,
//   'AIzaSyBgMN26G65UEgkWVDIPKTq-VpvktLmezjQ',
// ];

/**
 * Leaflet
 */
// export const providerConfig: ProviderConfig<Provider.leaflet> = [
//   Provider.leaflet,
//   d,
// ];

/**
 * Mappy
 */
// export const providerConfig: ProviderConfig<Provider.mappy> = [
//   Provider.mappy,
//   'PJ_Bridge',
// ];
