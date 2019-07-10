# BatMap

The goal of this tiny lib is to offer a common interface to allow basic usage of multiple map providers.

The only thing that change will be the chosen provider and its API Key. All your map interaction logic will stay the same regardless of the provider chosen. On the other hand, it is possible to overload all methods if it is needed for customization.

**Providers available:**

- [Google Maps](https://developers.google.com/maps/documentation/javascript/) - `gmaps`
- [Mappy (Leaflet)](http://leafletjs.com/reference-1.0.3.html) - `mappy`
- [Leaflet](http://leafletjs.com/reference-1.5.1.html) - `leaflet`

## Getting Started

See the [documentation](https://leadformance.github.io/batMap/)

## Development

### Run the example project

Run `npm run build-dev` and launch the example folder on a local server.
Any changes will be watched.

### Testing your devs

If you need to test your developments before releasing, you can push the compiled filed to Github Pages.
To do this, just run `npm run gh-deploy`.

You'll find the generated files on this link: https://leadformance.github.io/batMap/dist/[PROVIDER].js

### Deploy your devs

To deploy and release your code you have to merge your branch on master.

Now you can switch on master and run `npm run deploy <versions>` (version: major|minor|patch).
It will generate the folder **dist** with every provider js (normal and minified).

Now you can use this version in your project.

## Compatibility

|         |         Google Map         |         Mappy         |        Leaflet        |         SVG Marker         |
| ------- |         :--------:         |      :--------:       |      :--------:       |         :--------:         |
| Chrome  |     :white_check_mark:     |   :white_check_mark:  |   :white_check_mark:  |     :white_check_mark:     |
| Firefox |     :white_check_mark:     |   :white_check_mark:  |   :white_check_mark:  |     :white_check_mark:     |
| Opera   |     :white_check_mark:     |   :white_check_mark:  |   :white_check_mark:  |     :white_check_mark:     |
| Safari  |     :white_check_mark:     |   :white_check_mark:  |   :white_check_mark:  |     :white_check_mark:     |
| IE11    |     :white_check_mark:     |   :white_check_mark:  |   :white_check_mark:  |     :white_check_mark:     |
| EDGE    |     :white_check_mark:     |   :white_check_mark:  |   :white_check_mark:  |     :white_check_mark:     |

- need to include [es5-shim && es5-sham](https://github.com/es-shims/es5-shim)
