"use strict";

/**
 * Google Map v3
 * API Documentation: https://developers.google.com/maps/documentation/javascript/
 * MarkerClusterer: https://googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html
 */

import { MarkerClusterer } from "./MarkerClustererPlus";

/*jshint -W079 */
const AbstractMap = require("../../AbstractMap");
/* jshint +W079 */

const domUtils = require("../../utils/dom");
const loaderUtils = require("../../utils/loader");
const objectAssign = require("object-assign");

const gmapsPremium = require("./GmapsPremium");

export class GoogleMap extends AbstractMap {
    constructor(...args) {
        super(...args);

        this.provider = "GoogleMap";
    }

    load(callback) {
        this.domElement.classList.add("batmap__map", "batmap-gmaps");

        if (this.maps.size > 0) {
            callback();
            return;
        }

        callback = loaderUtils.addLoader(this.domElement, callback);

        let resources = [];
        let urlParams = "?v=3.40&language=" + this.locale;

        if (Array.isArray(this.apiKey)) {
            urlParams = urlParams + "&client=" + this.apiKey[0];
            urlParams =
                urlParams +
                gmapsPremium.sign(
                    "https://maps.googleapis.com/maps/api/js",
                    this.apiKey[1]
                );
        } else {
            urlParams = urlParams + "&key=" + this.apiKey;
        }

        resources.push(
            domUtils.createScript(
                "//maps.googleapis.com/maps/api/js" + urlParams
            )
        );

        domUtils.addResources(document.head, resources, callback);
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
                    position: google.maps.ControlPosition.TOP_LEFT,
                },
                streetViewControl: false,
            },
            options
        );

        this.markersOptions = markers;

        this.labelsOptions = labels;

        this.clustersOptions = clusters;
    }

    initMap() {
        this.bounds = new google.maps.LatLngBounds();
        this.map = new google.maps.Map(this.domElement, this.mapOptions);
    }

    setPoint(location, iconType, label = false) {
        const point = {
            position: new google.maps.LatLng(
                location.localisation.coordinates.latitude,
                location.localisation.coordinates.longitude
            ),
            id: `${location._id}`,
            location,
            iconType,
        };

        if (this.showLabel && label) {
            point.label = {
                text: `${label}`,
            };
        }

        this.points.push(point);
    }

    addMarkers(eventCallback = {}) {
        [].forEach.call(this.points, (point) => {
            this.addMarker(point, eventCallback);
        });

        if (this.showCluster && this.icons.cluster && this.points.length > 1) {
            this.addCluster();
        }
    }

    addMarker(point, eventCallback = {}) {
        const marker = new google.maps.Marker(point);
        this.markers.push(marker);
        marker.setMap(this.map);

        this.setIconOnMarker(marker, point.iconType);

        [].forEach.call(Object.keys(eventCallback), (event) => {
            const callback = eventCallback[event];
            marker.addListener(event, callback(marker));
        });

        this.extendBounds(marker.position);
    }

    removeMarker(marker) {
        marker = this.getMarker(marker);

        marker.setMap(null);
        this.markers = this.markers.filter((m) => m.id !== marker.id);
    }

    setMarkerIcons() {
        Object.keys(this.markersOptions).forEach((type) => {
            const options = this.markersOptions[type];
            const iconAnchor = options.anchor || [
                options.width / 2,
                options.height,
            ];
            const iconLabelOptions = options.label || {};
            const labelOrigin =
                options.label && options.label.origin
                    ? options.label.origin
                    : this.labelsOptions.origin || [
                          options.width / 2,
                          options.height / 2,
                      ];

            this.icons[type] = {
                url: options.url,
                scaledSize: new google.maps.Size(options.width, options.height),
                anchor: new google.maps.Point(iconAnchor[0], iconAnchor[1]),
                labelOrigin: new google.maps.Point(
                    labelOrigin[0],
                    labelOrigin[1]
                ),
                labelOptions: this.getLabelOptions(iconLabelOptions),
            };
        });
    }

    getLabelOptions(options) {
        return {
            color: options.color || this.labelsOptions.color,
            font: options.font || this.labelsOptions.font,
            size: options.size || this.labelsOptions.size,
            weight: options.weight || this.labelsOptions.weight,
        };
    }

    setIconOnMarker(marker, iconType, isLabeled = true) {
        marker = this.getMarker(marker);
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
                    text: marker.label.text,
                };
                marker.setLabel(label);
            }
        }
    }

    focusOnMarker(marker) {
        marker = this.getMarker(marker);

        this.map.setZoom(this.mapOptions.locationZoom);
        this.panTo(marker.position);
    }

    addUserMarker(position, iconType, id = 0) {
        if (position) {
            const point = {
                id: `${id}`,
                map: this.map,
                position: new google.maps.LatLng(
                    position.latitude,
                    position.longitude
                ),
                iconType,
            };

            this.userMarker = new google.maps.Marker(point);

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
                    clusterClass: "batmap-marker-cluster",
                    styles: [
                        {
                            url: icon.url,
                            width: icon.scaledSize.width,
                            height: icon.scaledSize.height,
                            anchorText: [
                                icon.labelOrigin.y -
                                    icon.scaledSize.height / 2 +
                                    icon.labelOptions.size * 1.2,
                                icon.labelOrigin.x - icon.scaledSize.width / 2,
                            ], // [yoffset, xoffset]
                            anchorIcon: [icon.anchor.y, icon.anchor.x], // [yoffset, xoffset]
                            textSize: icon.labelOptions.size,
                            textColor: icon.labelOptions.color,
                            fontWeight: icon.labelOptions.weight,
                            fontSize: icon.labelOptions.size,
                            fontFamily: icon.labelOptions.font,
                        },
                    ],
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
        this.map.addListener("zoom_changed", () => {
            return callback(this.map.getZoom());
        });
    }

    minifyMarkerIcons(zoom, breakZoom = 8, minifier = 0.8) {
        if (zoom < breakZoom + 1 && !this.isMinifiedMarkerIcons) {
            [].forEach.call(Object.keys(this.icons), (key) => {
                const size = this.icons[key].scaledSize;
                this.icons[key].scaledSize.width = size.width * minifier;
                this.icons[key].scaledSize.height = size.height * minifier;
            });
            this.isMinifiedMarkerIcons = true;
        } else if (zoom > breakZoom && this.isMinifiedMarkerIcons) {
            [].forEach.call(Object.keys(this.icons), (key) => {
                const size = this.icons[key].scaledSize;
                this.icons[key].scaledSize.width = size.width / minifier;
                this.icons[key].scaledSize.height = size.height / minifier;
            });
            this.isMinifiedMarkerIcons = false;
        }
    }
}
