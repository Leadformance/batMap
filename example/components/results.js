import { mapConfig } from '../config';
import { getBatMapInstance, makeLocations } from '../utils';

class ResultsMapModule {
  constructor(domSelector, attributes = {}) {
    this.el = document.querySelector(domSelector);

    if (!this.el) {
      throw new Error(`"${domSelector}" element not found`);
    }

    this.attr = {
      ...attributes,
      locations: makeLocations(20),
    };

    this.init();
  }

  init() {
    this.fillLocationsList('#locationsList');

    this.batMap = getBatMapInstance(
      this.attr.provider,
      this.el,
      this.attr.apiKey,
      this.attr.locale,
      this.attr.showCluster,
      this.attr.showLabel,
      this.attr.showPosition,
      this.initMap.bind(this),
    );
  }

  bindEvents() {
    document.querySelectorAll('[data-location]').forEach(location => {
      const id = location.getAttribute('data-location');

      location.addEventListener('click', this.handleClickOnLocation(id));
      location.addEventListener(
        'mouseenter',
        this.handleMouseEnterOnLocation(id),
      );
      location.addEventListener(
        'mouseleave',
        this.handleMouseLeaveOnLocation(id),
      );
    });
  }

  fillLocationsList(domSelector) {
    this.attr.locations.forEach(location => {
      const li = document.createElement('li');
      li.classList.add('location');
      li.setAttribute('data-location', location._id);
      li.innerText = location.name;
      document.querySelector(domSelector).appendChild(li);
    });
  }

  initMap() {
    this.setMapOptions();
    this.batMap.initMap();
    this.setMarkerIcons();
    this.geolocateOnMap();
    this.setPoints();
    this.addMarkers();

    if (!this.attr.showLabel && !this.attr.showCluster) {
      this.batMap.listenZoomChange(zoom => {
        this.batMap.minifyMarkerIcons(zoom);
      });
    }

    this.panToAllMarkers();
    this.bindEvents();
  }

  setMapOptions() {
    this.batMap.setMapOptions(
      this.attr.options,
      this.attr.markers,
      this.attr.labels,
      this.attr.clusters,
    );
  }

  setPoints() {
    let i = 1;

    this.attr.locations.forEach(location => {
      let label = false;
      if (this.attr.showLabel) {
        label = i++;
      }

      this.batMap.setPoint(location, 'default', label);
    });
  }

  getPoints() {
    return this.batMap.getPoints();
  }

  setMarkerIcons() {
    this.batMap.setMarkerIcons();
  }

  setIconOnMarker(marker, iconType) {
    this.batMap.setIconOnMarker(marker, iconType);
  }

  focusOnMarker(marker) {
    this.batMap.focusOnMarker(marker);
  }

  addMarkers() {
    this.batMap.addMarkers({
      click: this.handleClickOnMarker.bind(this),
      mouseover: this.handleMouseEnterOnMarker.bind(this),
      mouseout: this.handleMouseLeaveOnMarker.bind(this),
    });
  }

  getMarkers() {
    return this.batMap.getMarkers();
  }

  geolocateOnMap() {
    if (this.attr.showPosition) {
      this.batMap
        .getGeolocation()
        .then(position => {
          this.batMap.addUserMarker(
            this.map.makeLatLng(
              position.coords.latitude,
              position.coords.longitude,
            ),
            'user',
          );
          this.batMap.panToAllMarkers();
        })
        .catch(error => {
          console.error('geolocateOnMap(): ' + error.message);
          return false;
        });
    } else {
      return false;
    }
  }

  panToAllMarkers() {
    this.batMap.fitBounds(this.batMap.getBounds(), this.attr.options.zoom);
  }

  getMarkerIconType(marker) {
    return this.batMap.getMarkerIconType(marker);
  }

  handleClickOnMarker(marker) {
    return () => {
      if (this.getMarkerIconType(marker) !== 'active') {
        this.getMarkers().forEach(m => {
          this.setIconOnMarker(m, 'default');
        });

        this.setIconOnMarker(marker, 'active');
        this.focusOnMarker(marker);
        this.scrollToLocation(marker.id);
        this.highlightLocation(marker.id, true);
      }
    };
  }

  handleMouseEnterOnMarker(marker) {
    return () => {
      if (
        this.getMarkerIconType(marker) !== 'active' &&
        this.getMarkerIconType(marker) !== 'hover'
      ) {
        this.setIconOnMarker(marker, 'hover');
        this.highlightLocation(marker.id);
      }
    };
  }

  handleMouseLeaveOnMarker(marker) {
    return () => {
      if (
        this.getMarkerIconType(marker) !== 'active' &&
        this.getMarkerIconType(marker) !== 'default'
      ) {
        this.setIconOnMarker(marker, 'default');
        this.highlightLocation(false);
      }
    };
  }

  handleClickOnLocation(id) {
    return () => {
      this.getMarkers().forEach(m => {
        this.setIconOnMarker(m, 'default');
      });

      const marker = this.batMap.getMarker(id);
      if (marker) {
        this.setIconOnMarker(marker, 'active');
        this.focusOnMarker(marker);
        this.highlightLocation(id, true);
      }
    };
  }

  handleMouseEnterOnLocation(id) {
    return () => {
      const marker = this.batMap.getMarker(id);
      if (marker) {
        if (this.getMarkerIconType(marker) !== 'active') {
          this.setIconOnMarker(marker, 'hover');
          this.highlightLocation(id);
        } else {
          this.highlightLocation(id, true);
        }
      }
    };
  }

  handleMouseLeaveOnLocation(id) {
    return () => {
      const marker = this.batMap.getMarker(id);
      if (marker) {
        if (this.getMarkerIconType(marker) !== 'active') {
          this.setIconOnMarker(marker, 'default');
          this.highlightLocation();
        } else {
          this.highlightLocation(id, true);
        }
      }
    };
  }

  highlightLocation(id = false, isActive = false) {
    document.querySelectorAll('[data-location]').forEach(l => {
      l.classList.remove('hover');
    });

    if (id) {
      const location = document.querySelector('[data-location="' + id + '"]');

      if (location) {
        location.classList.add('hover');

        if (isActive) {
          document.querySelectorAll('[data-location]').forEach(l => {
            l.classList.remove('active');
          });

          location.classList.add('active');
        }
      }
    }
  }

  scrollToLocation(id) {
    const location = document.querySelector('[data-location="' + id + '"]');
    const list = document.querySelector('#locationsList');

    if (location && list) {
      list.scrollTo({
        top: location.offsetTop - location.clientHeight - list.offsetTop,
        behavior: 'smooth',
      });
    }
  }
}

new ResultsMapModule('#myMap', mapConfig);
