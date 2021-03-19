"use strict";
// LocationPage Component
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
    MyMap.prototype.initMap = function () {
        var _this = this;
        this.map.setMapOptions(this.attr.options, this.attr.markers, this.attr.labels);
        this.map.initMap();
        this.map.setMarkerIcons();
        [].forEach.call(this.attr.locations, function (location) {
            _this.map.setPoint(location, 'location');
        });
        this.map.addMarkers();
        const coords = this.attr.locations[0].localisation.coordinates;
        this.map.setCenter(this.map.makeLatLng(coords.latitude, coords.longitude));
        this.map.setZoom(this.attr.options.locationZoom);
    };
    return MyMap;
}());
window.MyMap = MyMap;
