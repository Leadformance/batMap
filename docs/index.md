# BatMap

The goal of this tiny lib is to offer a common interface to allow basic usage of multiple map providers.

The only thing that change will be the chosen provider and its API Key. All your map interaction logic will stay the same regardless of the provider chosen. On the other hand, it is possible to overload all methods if it is needed for customization.

**Providers available:**

-   [Google Maps](https://developers.google.com/maps/documentation/javascript/) - `gmaps`
-   [Mappy (Leaflet)](http://leafletjs.com/reference-1.0.3.html) - `mappy`
-   [Leaflet](http://leafletjs.com/reference-1.5.1.html) - `leaflet`

## References

[References documentation](references/)

## Getting Started

### Starter Kit

[Integration example](example/starter-kit)

### Basics

#### Set provider

##### Google Maps

```js
const config = {
    provider: "gmaps",
    apiKey: "API_KEY" | ["CLIENT_ID", "API_KEY_PREMIUM"],
    // ...
};
```

##### Mappy

```js
const config = {
    provider: "mappy",
    apiKey: "CLIENT_ID",
    // ...
};
```

##### Leaflet

```js
const config = {
    provider: "leaflet",
    // ...
};
```

#### Set options

```js
const config = {
    provider: 'provider',
    apiKey: 'api_key',
    locale: 'en',
    locations: [...],
    showCluster: true,
    showLabel: true,
    showPosition: true,
    options: {
        zoom: 12,
        locationZoom: 16,
    },
    markers: {
        default: {
            url: 'marker-default.svg',
            width: 38,
            height: 50
        }
    },
    labels: {
        origin: [19, 19],
        color: 'white',
        font: 'Arial, sans-serif',
        size: '14px',
        weight: 'normal'
    },
    clusters: {}
};
```

#### Usage

1. Add the provider script.

Using bower:

```bash
bower install Leadformance/batMap
```

```js
require(`batMap/dist/${provider}`);
```

Or directly in html:

```html
<script src="path/to/batMap/dist/{{ provider }}.min.js"></script>
```

2. Create a new map instance and display it.

```js
const map = new window.BatMap(
    "#my-map",
    config.apiKey,
    config.locale,
    config.showCluster,
    config.showLabel,
    config.showPosition,
    callback
);

function callback() {
    map.setMapOptions(
        config.options,
        config.markers,
        config.labels,
        config.clusters
    );

    map.init();

    map.setMarkerIcons();

    [].forEach.call(config.locations, (location) => {
        map.setPoint(location, "default");
    });

    map.addMarkers({
        click: handleClickOnMarker,
    });

    map.fitBounds(map.getBounds(), config.options.zoom);
}

function handleClickOnMarker(marker) {
    return () => {
        map.focusOnMarker(marker);
    };
}
```
