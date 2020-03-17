"use strict";
// ResultsPage Component
var MyMap = /** @class */ (function () {
    function MyMap(domSelector, attributes) {
        if (attributes === void 0) { attributes = {}; }
        this.el = document.querySelector(domSelector);
        this.attr = attributes;
        this.init();
    }
    MyMap.prototype.init = function () {
        var _this = this;
        var script = document.createElement('script');
        script.setAttribute('src', "/" + this.attr.provider + ".js");
        document.head.appendChild(script);
        script.addEventListener('load', function () {
            _this.map = new BatMap(_this.el, _this.attr.apiKey, _this.attr.locale, _this.attr.showCluster, _this.attr.showLabel, _this.attr.showPosition, _this.initMap.bind(_this));
        });
    };
    MyMap.prototype.bindEvents = function () {
        var _this = this;
        [].forEach.call(document.querySelectorAll('[data-location]'), function (location) {
            var id = location.getAttribute('data-location');
            location.addEventListener('click', _this.handleClickOnLocation(id));
            location.addEventListener('mouseenter', _this.handleMouseEnterOnLocation(id));
            location.addEventListener('mouseleave', _this.handleMouseLeaveOnLocation(id));
        });
    };
    MyMap.prototype.initMap = function () {
        var _this = this;
        this.setMapOptions();
        this.map.initMap();
        this.setMarkerIcons();
        this.geolocateOnMap();
        this.setPoints();
        this.addMarkers();
        if (!this.attr.showLabel && !this.attr.showCluster) {
            this.map.listenZoomChange(function (zoom) {
                _this.map.minifyMarkerIcons(zoom);
            });
        }
        this.panToAllMarkers();
        this.bindEvents();
    };
    MyMap.prototype.setMapOptions = function () {
        this.map.setMapOptions(this.attr.options, this.attr.markers, this.attr.labels, this.attr.clusters);
    };
    MyMap.prototype.setPoints = function () {
        var _this = this;
        var i = 1;
        [].forEach.call(this.attr.locations, function (location) {
            var label = false;
            if (_this.attr.showLabel) {
                label = i++;
            }
            _this.map.setPoint(location, 'default', label);
        });
    };
    MyMap.prototype.getPoints = function () {
        return this.map.getPoints();
    };
    MyMap.prototype.setMarkerIcons = function () {
        this.map.setMarkerIcons();
    };
    MyMap.prototype.setIconOnMarker = function (marker, iconType) {
        this.map.setIconOnMarker(marker, iconType);
    };
    MyMap.prototype.focusOnMarker = function (marker) {
        this.map.focusOnMarker(marker);
    };
    MyMap.prototype.addMarkers = function () {
        this.map.addMarkers({
            click: this.handleClickOnMarker.bind(this),
            mouseover: this.handleMouseEnterOnMarker.bind(this),
            mouseout: this.handleMouseLeaveOnMarker.bind(this)
        });
    };
    MyMap.prototype.getMarkers = function () {
        return this.map.getMarkers();
    };
    MyMap.prototype.geolocateOnMap = function () {
        var _this = this;
        if (this.attr.showPosition) {
            this.map.getGeolocation()
                .then(function (position) {
                _this.map.addUserMarker(position.coords, 'user');
            })
                .catch(function (error) {
                console.error("geolocateOnMap(): " + error.message);
                return false;
            });
        }
        else {
            return false;
        }
    };
    MyMap.prototype.panToAllMarkers = function () {
        this.map.fitBounds(this.map.getBounds(), this.attr.options.zoom);
    };
    MyMap.prototype.getMarkerIconType = function (marker) {
        return this.map.getMarkerIconType(marker);
    };
    MyMap.prototype.handleClickOnMarker = function (marker) {
        var _this = this;
        return function () {
            if (_this.getMarkerIconType(marker) !== 'active') {
                [].forEach.call(_this.getMarkers(), function (m) {
                    _this.setIconOnMarker(m, 'default');
                });
                _this.setIconOnMarker(marker, 'active');
                _this.focusOnMarker(marker);
                _this.scrollToLocation(marker.id);
                _this.highlightLocation(marker.id, true);
            }
        };
    };
    MyMap.prototype.handleMouseEnterOnMarker = function (marker) {
        var _this = this;
        return function () {
            if (_this.getMarkerIconType(marker) !== 'active' && _this.getMarkerIconType(marker) !== 'hover') {
                _this.setIconOnMarker(marker, 'hover');
                _this.highlightLocation(marker.id);
            }
        };
    };
    MyMap.prototype.handleMouseLeaveOnMarker = function (marker) {
        var _this = this;
        return function () {
            if (_this.getMarkerIconType(marker) !== 'active' && _this.getMarkerIconType(marker) !== 'default') {
                _this.setIconOnMarker(marker, 'default');
                _this.highlightLocation(false);
            }
        };
    };
    // NOTE: LocationOnMap
    MyMap.prototype.handleClickOnLocation = function (id) {
        var _this = this;
        return function () {
            [].forEach.call(_this.getMarkers(), function (m) {
                _this.setIconOnMarker(m, 'default');
            });
            var marker = _this.map.getMarker(id);
            if (marker) {
                _this.setIconOnMarker(marker, 'active');
                _this.focusOnMarker(marker);
                _this.highlightLocation(id, true);
            }
        };
    };
    MyMap.prototype.handleMouseEnterOnLocation = function (id) {
        var _this = this;
        return function () {
            var marker = _this.map.getMarker(id);
            if (marker) {
                if (_this.getMarkerIconType(marker) !== 'active') {
                    _this.setIconOnMarker(marker, 'hover');
                    _this.highlightLocation(id);
                }
                else {
                    _this.highlightLocation(id, true);
                }
            }
        };
    };
    MyMap.prototype.handleMouseLeaveOnLocation = function (id) {
        var _this = this;
        return function () {
            var marker = _this.map.getMarker(id);
            if (marker) {
                if (_this.getMarkerIconType(marker) !== 'active') {
                    _this.setIconOnMarker(marker, 'default');
                    _this.highlightLocation();
                }
                else {
                    _this.highlightLocation(id, true);
                }
            }
        };
    };
    MyMap.prototype.highlightLocation = function (id, isActive) {
        if (id === void 0) { id = false; }
        if (isActive === void 0) { isActive = false; }
        [].forEach.call(document.querySelectorAll('[data-location]'), function (l) {
            l.classList.remove('hover');
        });
        if (id) {
            var location = document.querySelector("[data-location=\"" + id + "\"]");
            if (location) {
                location.classList.add('hover');
                if (isActive) {
                    [].forEach.call(document.querySelectorAll('[data-location]'), function (l) {
                        l.classList.remove('active');
                    });
                    location.classList.add('active');
                }
            }
        }
    };
    MyMap.prototype.scrollToLocation = function (id) {
        var location = document.querySelector("[data-location=\"" + id + "\"]");
        var list = document.querySelector('#locationsList');
        if (location && list) {
            list.scrollTo({
                top: location.offsetTop - location.clientHeight - list.offsetTop,
                behavior: 'smooth'
            });
        }
    };
    return MyMap;
}());
window.MyMap = MyMap;
