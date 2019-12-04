require('./style.css');
const objectAssign = require('object-assign');
const dom = require('./utils/dom');

if (typeof Promise === 'undefined') {
    require('promise/lib/rejection-tracking').enable();
    window.Promise = require('promise/lib/es6-extensions.js');
}

class AbstractMap {
    constructor(
        domSelector,
        apiKey,
        locale,
        showCluster = false,
        showLabel = false,
        showPosition = false,
        callback = () => {}
    ) {
        this.domElement = dom.isHTMLElement(domSelector)
            ? domSelector
            : document.querySelector(domSelector);
        this.domId = this.domElement.id || '';

        this.apiKey = apiKey;
        this.locale = locale || 'en';
        this.provider = '[No provider defined]';

        this.showCluster = showCluster;
        this.showLabel = showLabel;
        this.showPosition = showPosition;

        this.map = null;
        this.points = [];
        this.markers = [];
        this.icons = [];
        this.bounds = null;
        this.cluster = null;

        this.defaultOptions = {
            zoom: 12,
            locationZoom: 16
        };

        this.load(callback);
    }

    load(callback) {
        callback();
    }

    setMapOptions(options = {}, markers = {}, labels = {}, clusters = {}) {
        this.mapOptions = objectAssign(this.defaultOptions, options);
        this.markersOptions = markers;
        this.labelsOptions = labels;
        this.clustersOptions = clusters;
    }

    getPoints() {
        return this.points;
    }

    getMarkers() {
        return this.markers;
    }

    getMarker(marker) {
        if (typeof marker === 'string') {
            // eslint-disable-next-line no-param-reassign
            marker = this.markers.find(m => {
                return m.id === marker;
            });
        }

        return marker;
    }

    getMarkerIcons() {
        return this.icons;
    }

    getMarkerIconByType(iconType) {
        if (this.icons[iconType]) {
            return this.icons[iconType];
        }

        return false;
    }

    getMarkerIconType(marker) {
        marker = this.getMarker(marker); // eslint-disable-line no-param-reassign
        return marker.iconType;
    }

    getGeolocation() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    maximumAge: 60000,
                    timeout: 20000,
                    enableHighAccuracy: true
                });
            } else {
                reject(new Error());
            }
        });
    }

    initMap() {
        throw new Error(
            `${this.provider} has no 'initMap' method implemented.`
        );
    }

    setPoint() {
        throw new Error(
            `${this.provider} has no 'setPoint' method implemented.`
        );
    }

    addMarkers() {
        throw new Error(
            `${this.provider} has no 'addMarkers' method implemented.`
        );
    }

    addUserMarker() {
        throw new Error(
            `${this.provider} has no 'addUserMarker' method implemented.`
        );
    }

    addMarker() {
        throw new Error(
            `${this.provider} has no 'addMarker' method implemented.`
        );
    }

    removeMarker() {
        throw new Error(
            `${this.provider} has no 'removeMarker' method implemented.`
        );
    }

    setMarkerIcons() {
        throw new Error(
            `${this.provider} has no 'setMarkerIcons' method implemented.`
        );
    }

    setIconOnMarker() {
        throw new Error(
            `${this.provider} has no 'setIconOnMarker' method implemented.`
        );
    }

    focusOnMarker() {
        throw new Error(
            `${this.provider} has no 'focusOnMarker' method implemented.`
        );
    }

    addCluster() {
        throw new Error(
            `${this.provider} has no 'addCluster' method implemented.`
        );
    }

    setCenter() {
        throw new Error(
            `${this.provider} has no 'setCenter' method implemented.`
        );
    }

    fitBounds() {
        throw new Error(
            `${this.provider} has no 'fitBounds' method implemented.`
        );
    }

    extendBounds() {
        throw new Error(
            `${this.provider} has no 'extendBounds' method implemented.`
        );
    }

    getBounds() {
        throw new Error(
            `${this.provider} has no 'getBounds' method implemented.`
        );
    }

    panTo() {
        throw new Error(`${this.provider} has no 'panTo' method implemented.`);
    }

    setZoom() {
        throw new Error(
            `${this.provider} has no 'setZoom' method implemented.`
        );
    }

    listenZoomChange() {
        throw new Error(
            `${this.provider} has no 'listenZoomChange' method implemented.`
        );
    }

    minifyMarkerIcons() {
        throw new Error(
            `${this.provider} has no 'minifyMarkerIcons' method implemented.`
        );
    }
}

module.exports = AbstractMap;
