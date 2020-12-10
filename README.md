# BatMap

The goal of this tiny lib is to offer a common interface to allow basic usage of multiple map providers.

The only thing that change will be the chosen provider and its API Key. All your map interaction logic will stay the same regardless of the provider chosen. On the other hand, it is possible to overload all methods if it is needed for customization.

**Providers available:**

- [Google Maps](https://developers.google.com/maps/documentation/javascript/) - `gmaps`
- [Mappy (Leaflet)](http://leafletjs.com/reference-1.0.3.html) - `mappy`
- [Leaflet](http://leafletjs.com/reference-1.5.1.html) - `leaflet`

## Getting Started

See the full [documentation](https://leadformance.github.io/batMap/).

## Development

### Run the example project

Run `yarn build-dev` and launch the example folder on a local server.
To sync the browser with changes run `yarn start` in another terminal.

### Validate your code

Run `yarn test` to launch the tests (Jest - [documentation](https://jestjs.io/)).

### Testing your devs

If you need to test your developments before releasing, you can push the compiled filed to Github Pages.
To do this, just run `yarn gh-deploy`.

You'll find the generated files on this link: https://leadformance.github.io/batMap/dist/[PROVIDER].[min].js

### Deploy your devs

To deploy and release your code you have to merge your branch on master.

Now you can switch on master and run `yarn deploy <versions>` (version: major|minor|patch).
It will generate the folder **dist** with every provider js (normal and minified).

Now you can use this version in your project.

## Compatibility

|         | Google Map |   Mappy   |  Leaflet  | SVG Marker |
| ------- | :--------: | :-------: | :-------: | :--------: |
| Chrome  |     ✔      |     ✔     |     ✔     |     ✔      |
| Firefox |     ✔      |     ✔     |     ✔     |     ✔      |
| Opera   |     ✔      |     ✔     |     ✔     |     ✔      |
| Safari  |     ✔      |     ✔     |     ✔     |     ✔      |
| IE11    |     ✔      |     ✔     |     ✔     |     ✔      |
| EDGE    |     ✔      |     ✔     |     ✔     |     ✔      |

- need to include [es5-shim && es5-sham](https://github.com/es-shims/es5-shim)
