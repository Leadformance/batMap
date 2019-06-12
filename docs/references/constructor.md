# References

[&#8672; Go Back](../references/)

## constructor

> constructor(domSelector, apiKey, locale, showCluster = false, showLabel = false, showPosition = false, callback = () => {})

Create a map instance.

### Parameters

#### `domElement` - String|Node

The DOM container where the map will be added or a selector to found it using `document.querySelector()`.

#### `apiKey` - String

Provider API Key that will be used to request the API.

#### `locale` - String

Specific locale to use when loading the Map.

#### `showCluster` - Boolean

Enable/disable markers clustering.

#### `showLabel` - Boolean

Enable/disable label on markers.

#### `showPosition` - Boolean

Enable/disable user geolocation on the map.

#### `callback` - Function

The function to execute when all map provider dependencies are loaded.
