/**
 * Google Map v3
 * API Documentation: https://developers.google.com/maps/documentation/javascript/
 * MarkerClusterer: https://gmaps-marker-clusterer.github.io/gmaps-marker-clusterer/
 */

/*jshint -W079 */
const AbstractMap = require('../../AbstractMap');
/* jshint +W079 */

const domUtils = require('../../utils/dom');
const loaderUtils = require('../../utils/loader');
const objectAssign = require('object-assign');

const MarkerClusterer = require('@google/markerclusterer');

class GoogleMap extends AbstractMap {
    constructor(...args) {
        super(...args);

        this.provider = 'GoogleMap';
        window.google = document.querySelector(
            '[data-reactroot]'
        ).contentWindow.google;
    }

    load(callback) {
        this.domElement.classList.add('batmap__map', 'batmap-gmaps');

        if (window.google && window.google.maps) {
            setTimeout(callback, 0);
            return;
        }

        callback = loaderUtils.addLoader(this.domElement, callback); //eslint-disable-line no-param-reassign

        const iframe = document.querySelector('[data-reactroot]');
        const resources = [];

        const urlParams =
            '?v=3.37&language=' + this.locale + '&key=' + this.apiKey;
        resources.push(
            domUtils.createScript(
                '//maps.googleapis.com/maps/api/js' + urlParams
            )
        );

        domUtils.addResources(iframe.contentDocument.head, resources, callback);
    }

    setMapOptions(options = {}, markers = {}, labels = {}, clusters = {}) {
        this.mapOptions = objectAssign(
            {
                center: { lat: 0, lng: 0 },
                zoom: 12,
                locationZoom: 16,
                mapTypeControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT //eslint-disable-line no-undef
                },
                streetViewControl: false
            },
            options
        );

        this.markersOptions = markers;

        this.labelsOptions = labels;

        this.clustersOptions = clusters;
    }

    initMap() {
        this.bounds = new google.maps.LatLngBounds(); //eslint-disable-line no-undef
        this.map = new google.maps.Map(this.domElement, this.mapOptions); //eslint-disable-line no-undef
    }

    setPoint(location, iconType, label = false) {
        const point = {
            //eslint-disable-next-line no-undef
            position: new google.maps.LatLng(
                location.latitude,
                location.longitude
            ),
            id: `${location._id}`,
            location,
            iconType
        };

        if (this.showLabel && label) {
            point.label = {
                text: `${label}`
            };
        }

        this.points.push(point);
    }

    addMarkers(eventCallback = {}) {
        [].forEach.call(this.points, point => {
            this.addMarker(point, eventCallback);
        });

        if (this.showCluster && this.icons.cluster && this.points.length > 1) {
            this.addCluster();
        }
    }

    addMarker(point, eventCallback = {}) {
        const marker = new google.maps.Marker(point); //eslint-disable-line no-undef
        this.markers.push(marker);
        marker.setMap(this.map);

        this.setIconOnMarker(marker, point.iconType);

        [].forEach.call(Object.keys(eventCallback), event => {
            const callback = eventCallback[event];
            marker.addListener(event, callback(marker));
        });

        this.extendBounds(marker.position);
    }

    removeMarker(marker) {
        marker = this.getMarker(marker); //eslint-disable-line no-param-reassign

        marker.setMap(null);
        this.markers = this.markers.filter(m => m.id !== marker.id); //eslint-disable-line arrow-body-style
    }

    setMarkerIcons() {
        const divider = 2;

        Object.keys(this.markersOptions).forEach(type => {
            const options = this.markersOptions[type];
            const iconAnchor = options.anchor || [
                options.width / divider,
                options.height
            ];
            const iconLabelOptions = options.label || {};
            /* eslint-disable indent */
            const labelOrigin = options.origin ||
                this.labelsOptions.origin || [
                    options.width / divider,
                    options.height / divider
                ];
            /* eslint-enable indent */
            this.icons[type] = {
                url: options.url,
                scaledSize: new google.maps.Size(options.width, options.height), //eslint-disable-line no-undef
                anchor: new google.maps.Point(iconAnchor[0], iconAnchor[1]), //eslint-disable-line no-undef
                //eslint-disable-next-line no-undef
                labelOrigin: new google.maps.Point(
                    labelOrigin[0],
                    labelOrigin[1]
                ),
                labelOptions: this.getLabelOptions(iconLabelOptions)
            };
        });
    }

    getLabelOptions(options) {
        return {
            color: options.color || this.labelsOptions.color,
            font: options.font || this.labelsOptions.font,
            size: options.size || this.labelsOptions.size,
            weight: options.weight || this.labelsOptions.weight
        };
    }

    setIconOnMarker(marker, iconType, isLabeled = true) {
        marker = this.getMarker(marker); //eslint-disable-line no-param-reassign
        const icon = this.icons[iconType];

        if (marker && icon) {
            marker.setIcon(icon);
            marker.iconType = iconType;

            if (this.showLabel && isLabeled) {
                const iconLabelOptions = icon.labelOptions;
                const label = {
                    color: iconLabelOptions.color,
                    fontFamily: iconLabelOptions.family,
                    fontSize: iconLabelOptions.size,
                    fontWeight: iconLabelOptions.weight,
                    text: marker.label.text
                };
                marker.setLabel(label);
            }
        }
    }

    focusOnMarker(marker) {
        marker = this.getMarker(marker); //eslint-disable-line no-param-reassign

        this.map.setZoom(this.mapOptions.locationZoom);
        this.panTo(marker.position);
    }

    addUserMarker(position, iconType, id = 0) {
        if (position) {
            const point = {
                id: `${id}`,
                map: this.map,
                //eslint-disable-next-line no-undef
                position: new google.maps.LatLng(
                    position.latitude,
                    position.longitude
                ),
                iconType
            };

            this.userMarker = new google.maps.Marker(point); //eslint-disable-line no-undef

            this.setIconOnMarker(this.userMarker, iconType, false);
            this.extendBounds(this.userMarker.position);
        }
    }

    addCluster() {
        const icon = this.icons.cluster;

        this.cluster = new MarkerClusterer(
            this.map,
            this.markers,
            objectAssign(
                {
                    averageCenter: true,
                    styles: [
                        {
                            url: icon.url,
                            width: icon.scaledSize.width,
                            height: icon.scaledSize.height,
                            iconAnchor: icon.anchor,
                            textSize: icon.labelOptions.size,
                            textColor: icon.labelOptions.color
                        }
                    ]
                },
                this.clustersOptions
            )
        );
    }

    setZoom(zoom) {
        this.map.setZoom(zoom);
    }

    setCenter(position) {
        this.map.setCenter(position);
    }

    getBounds() {
        return this.bounds;
    }

    extendBounds(position) {
        return this.bounds.extend(position);
    }

    fitBounds(bounds, zoom = this.mapOptions.zoom) {
        if (this.markers.length > 1) {
            this.map.fitBounds(bounds);
        } else {
            this.setCenter(this.markers[0].position);
            this.setZoom(zoom);
        }
    }

    panTo(position) {
        this.map.panTo(position);
    }

    listenZoomChange(callback) {
        this.map.addListener('zoom_changed', () => {
            return callback(this.map.getZoom());
        });
    }

    //eslint-disable-next-line no-magic-numbers
    minifyMarkerIcons(zoom, breakZoom = 8, minifier = 0.8) {
        if (zoom < breakZoom + 1 && !this.isMinifiedMarkerIcons) {
            [].forEach.call(Object.keys(this.icons), key => {
                const size = this.icons[key].scaledSize;
                this.icons[key].scaledSize.width = size.width * minifier;
                this.icons[key].scaledSize.height = size.height * minifier;
            });
            this.isMinifiedMarkerIcons = true;
        } else if (zoom > breakZoom && this.isMinifiedMarkerIcons) {
            [].forEach.call(Object.keys(this.icons), key => {
                const size = this.icons[key].scaledSize;
                this.icons[key].scaledSize.width = size.width / minifier;
                this.icons[key].scaledSize.height = size.height / minifier;
            });
            this.isMinifiedMarkerIcons = false;
        }
    }
}

window.GoogleMap = GoogleMap;
window.BatMap = GoogleMap;
document.querySelector('[data-reactroot]').contentWindow.GoogleMap = GoogleMap;
document.querySelector('[data-reactroot]').contentWindow.BatMap = GoogleMap;
