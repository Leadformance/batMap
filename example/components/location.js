// LocationPage Component

class MyMap {
    constructor(domSelector, attributes = {}) {
        this.el = document.querySelector(domSelector);
        this.attr = attributes;

        this.init();
    }

    init() {
        const script = document.createElement('script');
        script.setAttribute('src', `/${this.attr.provider}.js`)
        document.head.appendChild(script);

        script.addEventListener('load', () => {
            this.map = new BatMap(
                this.el,
                this.attr.apiKey,
                this.attr.locale,
                this.attr.showCluster,
                this.attr.showLabel,
                this.attr.showPosition,
                this.initMap.bind(this)
            );
        });
    }

    initMap() {
        this.map.setMapOptions(this.attr.options, this.attr.markers, this.attr.labels);

        this.map.initMap();

        this.map.setMarkerIcons();

        [].forEach.call(this.attr.locations, location => {
            this.map.setPoint(location, 'location');
        });

        this.map.addMarkers();

        this.map.fitBounds(this.map.getBounds(), this.attr.options.locationZoom);
    }
}

window.MyMap = MyMap;
