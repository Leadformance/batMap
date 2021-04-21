import {
  GoogleMaps,
  Leaflet,
  Mappy,
  Provider,
  ProviderConstructorArgs,
  BatMapProvider,
} from '@bridge/batMap/src';

export function getBatMapProvider<T extends Provider = Provider>(
  provider: T,
  ...rest: ProviderConstructorArgs<T>
): BatMapProvider<T> {
  switch (provider) {
    case Provider.gmaps:
      return (new GoogleMaps(
        ...(rest as ProviderConstructorArgs<Provider.gmaps>),
      ) as unknown) as BatMapProvider<T>;

    case Provider.leaflet:
      return (new Leaflet(
        ...(rest as ProviderConstructorArgs<Provider.leaflet>),
      ) as unknown) as BatMapProvider<T>;

    case Provider.mappy:
      return (new Mappy(
        ...(rest as ProviderConstructorArgs<Provider.mappy>),
      ) as unknown) as BatMapProvider<T>;

    default:
      throw new Error(`${provider} is not a BatMap provider`);
  }
}
