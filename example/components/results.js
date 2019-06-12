// ResultsPage Component

class MyMap {
    constructor(domSelector, attributes = {}) {
        this.el = document.querySelector(domSelector);
        this.attr = attributes;

        this.init();
    }

    init() {
        const script = document.createElement('script');
        script.setAttribute('src', `../dist/${this.attr.provider}.js`)
        document.head.appendChild(script);

        script.addEventListener('load', () => {
            this.map = new OneMap(
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

    bindEvents() {
        [].forEach.call(document.querySelectorAll('[data-location]'), location => {
            const id = location.getAttribute('data-location');
            location.addEventListener('click', this.handleClickOnLocation(id));
            location.addEventListener('mouseenter', this.handleMouseEnterOnLocation(id));
            location.addEventListener('mouseleave', this.handleMouseLeaveOnLocation(id));
        });
    }

    initMap() {
        this.setMapOptions();

        this.map.initMap();

        this.setMarkerIcons();
        this.setPoints();

        this.addMarkers();

        this.geolocateOnMap();

        this.panToAllMarkers();

        this.bindEvents();
    }

    setMapOptions() {
        this.map.setMapOptions(this.attr.options, this.attr.markers, this.attr.labels, this.attr.clusters);
    }

    setPoints() {
        let i = 1;

        [].forEach.call(this.attr.locations, location => {
            let label = false;

            if (this.attr.showLabel) {
                label = i++;
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
        if(this.attr.showPosition) {
            this.map.getGeolocation()
                .then(position => {
                    this.map.addUserMarker(position.coords, 'user');
                })
                .catch(error => {
                    console.error(`geolocateOnMap(): ${error.message}`);
                    return false;
                });
        } else {
            return false;
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

            this.highlightLocation(marker.id, true);
        }
    }

    handleMouseEnterOnMarker(marker) {
        return () => {
            if (this.getMarkerIconType(marker) !== 'active') {
                this.setIconOnMarker(marker, 'hover');
            }

            this.highlightLocation(marker.id);
        }
    }

    handleMouseLeaveOnMarker(marker) {
        return () => {
            if (this.getMarkerIconType(marker) !== 'active') {
                this.setIconOnMarker(marker, 'default');
            }

            this.highlightLocation(false);
        }
    }

    // NOTE: LocationOnMap
    handleClickOnLocation(id) {
        return () => {
            [].forEach.call(this.getMarkers(), m => {
                this.setIconOnMarker(m, 'default');
            });

            const marker = this.map.getMarker(id);
            this.setIconOnMarker(marker, 'active');

            this.focusOnMarker(marker);

            this.highlightLocation(id, true);
        }
    }

    handleMouseEnterOnLocation(id) {
        return () => {
            const marker = this.map.getMarker(id);
            if (this.getMarkerIconType(marker) !== 'active') {
                this.setIconOnMarker(marker, 'hover');
                this.highlightLocation(id);
            } else {
                this.highlightLocation(id, true);
            }
        }
    }

    handleMouseLeaveOnLocation(id) {
        return () => {
            const marker = this.map.getMarker(id);
            if (this.getMarkerIconType(marker) !== 'active') {
                this.setIconOnMarker(marker, 'default');
                this.highlightLocation();
            } else {
                this.highlightLocation(id, true);
            }
        }
    }

    highlightLocation(id = false, isActive = false) {
        [].forEach.call(document.querySelectorAll('[data-location]'), l => {
            l.classList.remove('hover');
        });

        if (id) {
            const location = document.querySelector(`[data-location="${id}"]`);
            if (isActive) {
                [].forEach.call(document.querySelectorAll('[data-location]'), l => {
                    l.classList.remove('active');
                });
                location.classList.add('active');
            }

            location.classList.add('hover');
        }
    }
}

window.MyMap = MyMap;
