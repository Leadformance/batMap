# BatMap

The goal of this tiny lib is to offer a common interface to allow basic usage of multiple map providers.

The only thing that change will be the chosen provider and its API Key. All your map interaction logic will stay the same regardless of the provider chosen. On the other hand, it is possible to overload all methods if it is needed for customization.

**Providers available:**

-   [Google Maps](https://developers.google.com/maps/documentation/javascript/) - `gmaps`
-   [Mappy (Leaflet)](http://leafletjs.com/reference-1.0.3.html) - `mappy`
-   [Leaflet](http://leafletjs.com/reference-1.5.1.html) - `leaflet`

## Getting Started

See the full [documentation](https://leadformance.github.io/batMap/).

## Development

### Run the example project

Run `yarn start` and browse to `http://localhost:8888`. Any changes will be watched.

### Validate your code

Run `yarn test` to launch the tests (Jest - [documentation](https://jestjs.io/)).
