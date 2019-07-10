# Integration example - Starter Kit

[&#8672; Go Back](../)

## Options

```yml
# app/config/parameters.yml

# Map
bridge_front_starter_kit.map.markers.show_label: true     # enable label on markers
bridge_front_starter_kit.map.markers.show_position: true  # enable marker clustering
bridge_front_starter_kit.map.markers.show_cluster: true   # enable user geolocation on the map

## Mappy
bridge_front_starter_kit.map.provider: 'mappy'
bridge_front_starter_kit.map.api_key: 'PJ_Bridge'
bridge_front_starter_kit.map.itinerary:
    host: 'https://fr.mappy.com/#/2/M2/TItinerary/I'
    start_addr: 'FR'
    dest_addr: '|TO'

## Gmaps
bridge_front_starter_kit.map.provider: 'gmaps'
bridge_front_starter_kit.map.api_key: 'AIzaSyBgMN26G65UEgkWVDIPKTq-VpvktLmezjQ'
bridge_front_starter_kit.map.itinerary:
    host: 'https://www.google.com/maps'
    start_addr: '?saddr='
    dest_addr: '&daddr='

## Leaflet
bridge_front_starter_kit.map.provider: 'leaflet'
bridge_front_starter_kit.map.api_key: ''
```

```yml
# src/Bridge/FrontBundle/Resources/config/theme.yml

theme:
    all:
        javascript:
            components:
                map:
                    provider: "%bridge_front_starter_kit.map.provider%"
                    apiKey: "%bridge_front_starter_kit.map.api_key%"
                    showLabel: "%bridge_front_starter_kit.map.markers.show_label%"
                    showPosition: "%bridge_front_starter_kit.map.markers.show_position%"
                    showCluster: "%bridge_front_starter_kit.map.markers.show_cluster%"

                    # MAP OPTIONS
                    # It is possible to add native provider options here or directly in the component.
                    options:
                        zoom: 12          # default zoom on results page
                        locationZoom: 16  # default zoom on focus on marker and on location page

                    # MARKERS CONFIGURATION
                    # Each marker type have to had at least an image path (url) and a size (width, height) defined.
                    # Overload default label options for each marker by adding a label property.
                    # Don't set markers for using default provider markers.
                    markers:
                        default:
                            url: "/build/assets/images/markers/marker-default.svg"
                            width: 38
                            height: 50
                        hover:
                            url: "/build/assets/images/markers/marker-hover.svg"
                            width: 38
                            height: 50
                        active:
                            url: "/build/assets/images/markers/marker-active.svg"
                            width: 38
                            height: 50
                        location:
                            url: "/build/assets/images/markers/marker-location.svg"
                            width: 38
                            height: 50
                        user:
                            url: "/build/assets/images/markers/marker-user.svg"
                            width: 38
                            height: 50
                        cluster:
                            url: "/build/assets/images/markers/marker-cluster.svg"
                            width: 50
                            height: 50
                            label:
                                origin: [25, 25]
                                size: 14

                    # LABELS CONFIGURATION
                    # It is possible to overload these default options for each marker by adding a label property.
                    # Don't set labels for using default provider labels.
                    labels:
                        origin: [19, 19]
                        color: "white"
                        font: "'Montserrat', Arial, sans-serif"
                        size: "14px"
                        weight: "normal"

                    # CLUSTER CONFIGURATION
                    # It is possible here to add native provider cluster options
                    clusters:
                        # ...

    actions:
        - action: Bridge\FrontBundle\Controller\FrontController::locationAction
          javascript:
              components:
                    # Overload options (map, markers, labels, clusters) for each pages
                    map:
                        showLabel: false
                        showPosition: false
                        showCluster: false
```

## Results page

```js
// src/Bridge/FrontBundle/Resources/views/pages/results/index.js

import Map from '../../../scripts/modules/results/map';

module.exports = {
    map: {selector: '#lf-map', provider: Map}
};
```

```js
// src/Bridge/FrontBundle/Resources/scripts/modules/results/map/index.js

import Component from '../../../../scripts/base/Component';
import {mobile} from '../../../../scripts/utils/mobile';

const isMobile = mobile();

class Map extends Component {
    getDefaultAttributes() {
        return {
            showCluster: true,
            showPosition: true,
            showLabel: true,
            options: {
                zoom: 12,
                locationZoom: 16
            },
            markers: {},
            labels: {
                color: 'white',
                font: 'Arial, sans-serif',
                size: '14px',
                weight: 'normal'
            },
            clusters: {},
            pagination: {
                hitsStart: 1
            }
        };
    }

    init(eventEmitterService, urlService) {
        this.emitter = eventEmitterService;
        require(`batMap/dist/${this.attr.provider}`);

        this.userCoordinates = {
            latitude: urlService.getUrlParameter('lat'),
            longitude: urlService.getUrlParameter('lon')
        };

        this.map = new window.BatMap(
            this.el,
            this.attr.apiKey,
            this.attr.locale,
            this.attr.showCluster,
            this.attr.showLabel,
            this.attr.showPosition,
            this.initMap.bind(this)
        );
    }

    bindEvents() {
        this.emitter.on('modules.map.setIconOnMarker', this.setIconOnMarker.bind(this));
        this.emitter.on('modules.map.focusOnMarker', this.focusOnMarker.bind(this));
        this.emitter.on('modules.map.panToAllMarkers', this.panToAllMarkers.bind(this));
    }

    initMap() {
        this.setMapOptions();

        this.map.initMap();

        this.setMarkerIcons();
        this.geolocateOnMap();
        this.setPoints();
        this.addMarkers();

        if (!this.attr.showLabel && !this.attr.showCluster) {
            this.map.listenZoomChange(zoom => {
                this.map.minifyMarkerIcons(zoom);
            });
        }

        this.panToAllMarkers();

        this.bindEvents();
    }

    setMapOptions() {
        this.map.setMapOptions(this.attr.options, this.attr.markers, this.attr.labels, this.attr.clusters);
    }

    setPoints() {
        [].forEach.call(this.attr.locations, location => {
            let label = false;

            if (this.attr.showLabel) {
                label = `${this.attr.pagination.hitsStart++}`;
            }

            this.map.setPoint(location, 'default', label);
        });
    }

    getPoints() {
        return this.map.getPoints();
    }

    setMarkerIcons() {
        this.map.setMarkerIcons();
    }

    setIconOnMarker(marker, iconType) {
        this.map.setIconOnMarker(marker, iconType);
    }

    focusOnMarker(marker) {
        this.map.focusOnMarker(marker);
    }

    addMarkers() {
        this.map.addMarkers({
            click: this.handleClickOnMarker.bind(this),
            mouseover: this.handleMouseEnterOnMarker.bind(this),
            mouseout: this.handleMouseLeaveOnMarker.bind(this)
        });
    }

    getMarkers() {
        return this.map.getMarkers();
    }

    geolocateOnMap() {
        if(this.attr.showPosition && this.userCoordinates.latitude && this.userCoordinates.longitude) {
            this.map.addUserMarker({
                latitude: parseFloat(this.userCoordinates.latitude),
                longitude: parseFloat(this.userCoordinates.longitude)
            }, 'user');
        }
    }

    panToAllMarkers() {
        this.map.fitBounds(this.map.getBounds(), this.attr.options.zoom);
    }

    getMarkerIconType(marker) {
        return this.map.getMarkerIconType(marker);
    }

    handleClickOnMarker(marker) {
        return () => {
            [].forEach.call(this.getMarkers(), m => {
                this.setIconOnMarker(m, 'default');
            });

            this.setIconOnMarker(marker, 'active');

            this.focusOnMarker(marker);

            this.emitter.emit('modules.searchLocations.scroll', marker.id);
            this.emitter.emit('modules.searchLocations.highlight', marker.id);

            // On mobile, display the map panel
            if (isMobile) {
                this.emitter.emit('modules.toggleMap.toggleMapDisplay');
            }
        };
    }

    handleMouseEnterOnMarker(marker) {
        return () => {
            if (this.getMarkerIconType(marker) !== 'active') {
                this.setIconOnMarker(marker, 'hover');
            }
        };
    }

    handleMouseLeaveOnMarker(marker) {
        return () => {
            if (this.getMarkerIconType(marker) !== 'active') {
                this.setIconOnMarker(marker, 'default');
            }
        };
    }
}

Map.deps = ['eventEmitterService', 'urlService'];

export default Map;
```

## Location page

```js
// src/Bridge/FrontBundle/Resources/views/pages/location/index.js

import Map from '../../../scripts/modules/location/map';

module.exports = {
    map: {selector: '#lf-map', provider: Map}
};
```

```js
// src/Bridge/FrontBundle/Resources/scripts/modules/location/map/index.js

import Component from '../../../../scripts/base/Component';

class Map extends Component {
    getDefaultAttributes() {
        return {
            showCluster: false,
            showPosition: false,
            showLabel: false,
            options: {
                zoom: 12,
                locationZoom: 16
            },
            markers: {},
            labels: {
                color: 'white',
                font: 'Arial, sans-serif',
                size: '14px',
                weight: 'normal'
            }
        };
    }

    init(eventEmitterService) {
        this.emitter = eventEmitterService;
        require(`batMap/dist/${this.attr.provider}`);

        this.map = new window.BatMap(
            this.el,
            this.attr.apiKey,
            this.attr.locale,
            this.attr.showCluster,
            this.attr.showLabel,
            this.attr.showPosition,
            this.initMap.bind(this)
        );
    }

    initMap() {
        this.setMapOptions();

        this.map.initMap();

        this.setMarkerIcons();
        this.setPoints();

        this.addMarkers();

        this.panToAllMarkers();
    }

    setMapOptions() {
        this.map.setMapOptions(this.attr.options, this.attr.markers, this.attr.labels);
    }

    setPoints() {
        [].forEach.call(this.attr.locations, location => {
            this.map.setPoint(location, 'location');
        });
    }

    setMarkerIcons() {
        this.map.setMarkerIcons();
    }

    addMarkers() {
        this.map.addMarkers();
    }

    panToAllMarkers() {
        this.map.fitBounds(this.map.getBounds(), this.attr.options.locationZoom);
    }
}

export default Map;
```
