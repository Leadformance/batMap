# BatMap

The goal of this tiny lib is to offer a common interface to allow basic usage of multiple map providers.

The only thing that change will be the chosen provider and its API Key. All your map interaction logic will stay the same regardless of the provider chosen. On the other hand, it is possible to overload all methods if it is needed for customization.

Providers available:

- gmaps
- mappy

## References

[References documentation](references/)

## Getting Started

### Set options

Set the provider in `parameters.yml`

```yml
# app/config/parameters.yml

bridge_front_components.map.provider: 'provider' # chosen provider
bridge_front_components.map.api_key: 'api_key'   # client api key
```

Set map options in `theme.yml`.
[More informations](parameters/theme)

### Usage

1. Add the provider script.

Using bower:

```bash
bower install marierigal/batMap
```

```js
// component

require(`batMap/dist/${provider}`);
```

Or directly in html:

```html
<script src="path/to/batMap/dist/{{ provider }}.min.js"></script>
```

2. Create a new map instance and display it.

```js
const map = new window.BatMap(
    domSelector,
    apiKey,
    locale,
    showCluster,
    showLabel,
    showPosition,
    callback
);

map.setMapOptions();
map.init();
```
