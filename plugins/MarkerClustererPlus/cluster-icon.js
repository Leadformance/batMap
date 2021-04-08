/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* globals google */

import objectAssign from 'object-assign';

import { OverlayViewSafe } from './overlay-view-safe';

/**
 *
 * @hidden
 */
function toCssText(styles) {
  return Object.keys(styles)
    .reduce((acc, key) => {
      if (styles[key]) {
        acc.push(key + ':' + styles[key]);
      }
      return acc;
    }, [])
    .join(';');
}

/**
 *
 * @hidden
 */
function coercePixels(pixels) {
  return pixels ? pixels + 'px' : undefined;
}

/**
 * A cluster icon.
 */
export class ClusterIcon extends OverlayViewSafe {
  /**
   * @param cluster_ The cluster with which the icon is to be associated.
   * @param styles_ An array of {@link ClusterIconStyle} defining the cluster icons
   *  to use for various cluster sizes.
   */
  constructor(cluster_, styles_) {
    super();
    this.cluster_ = cluster_;
    this.styles_ = styles_;
    this.center_ = null;
    this.div_ = null;
    this.sums_ = null;
    this.visible_ = false;
    this.style = null;
    this.setMap(cluster_.getMap()); // Note: this causes onAdd to be called
  }
  /**
   * Adds the icon to the DOM.
   */
  onAdd() {
    let cMouseDownInCluster;
    let cDraggingMapByCluster;
    const mc = this.cluster_.getMarkerClusterer();
    const [major, minor] = google.maps.version.split('.');
    const gmVersion = parseInt(major, 10) * 100 + parseInt(minor, 10);
    this.div_ = document.createElement('div');
    if (this.visible_) {
      this.show();
    }
    this.getPanes().overlayMouseTarget.appendChild(this.div_);
    // Fix for Issue 157
    this.boundsChangedListener_ = google.maps.event.addListener(
      this.getMap(),
      'bounds_changed',
      function () {
        cDraggingMapByCluster = cMouseDownInCluster;
      },
    );
    google.maps.event.addDomListener(this.div_, 'mousedown', () => {
      cMouseDownInCluster = true;
      cDraggingMapByCluster = false;
    });
    // March 1, 2018: Fix for this 3.32 exp bug, https://issuetracker.google.com/issues/73571522
    // But it doesn't work with earlier releases so do a version check.
    if (gmVersion >= 332) {
      // Ugly version-dependent code
      google.maps.event.addDomListener(this.div_, 'touchstart', e => {
        e.stopPropagation();
      });
    }
    google.maps.event.addDomListener(this.div_, 'click', e => {
      cMouseDownInCluster = false;
      if (!cDraggingMapByCluster) {
        /**
         * This event is fired when a cluster marker is clicked.
         * @name MarkerClusterer#click
         * @param {Cluster} c The cluster that was clicked.
         * @event
         */
        google.maps.event.trigger(mc, 'click', this.cluster_);
        google.maps.event.trigger(mc, 'clusterclick', this.cluster_); // deprecated name
        // The default click handler follows. Disable it by setting
        // the zoomOnClick property to false.
        if (mc.getZoomOnClick()) {
          // Zoom into the cluster.
          const mz = mc.getMaxZoom();
          const theBounds = this.cluster_.getBounds();
          mc.getMap().fitBounds(theBounds);
          // There is a fix for Issue 170 here:
          setTimeout(function () {
            mc.getMap().fitBounds(theBounds);
            // Don't zoom beyond the max zoom level
            if (mz !== null && mc.getMap().getZoom() > mz) {
              mc.getMap().setZoom(mz + 1);
            }
          }, 100);
        }
        // Prevent event propagation to the map:
        e.cancelBubble = true;
        if (e.stopPropagation) {
          e.stopPropagation();
        }
      }
    });
    google.maps.event.addDomListener(this.div_, 'mouseover', () => {
      /**
       * This event is fired when the mouse moves over a cluster marker.
       * @name MarkerClusterer#mouseover
       * @param {Cluster} c The cluster that the mouse moved over.
       * @event
       */
      google.maps.event.trigger(mc, 'mouseover', this.cluster_);
    });
    google.maps.event.addDomListener(this.div_, 'mouseout', () => {
      /**
       * This event is fired when the mouse moves out of a cluster marker.
       * @name MarkerClusterer#mouseout
       * @param {Cluster} c The cluster that the mouse moved out of.
       * @event
       */
      google.maps.event.trigger(mc, 'mouseout', this.cluster_);
    });
  }
  /**
   * Removes the icon from the DOM.
   */
  onRemove() {
    if (this.div_ && this.div_.parentNode) {
      this.hide();
      google.maps.event.removeListener(this.boundsChangedListener_);
      google.maps.event.clearInstanceListeners(this.div_);
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  }
  /**
   * Draws the icon.
   */
  draw() {
    if (this.visible_) {
      const pos = this.getPosFromLatLng_(this.center_);
      this.div_.style.top = pos.y + 'px';
      this.div_.style.left = pos.x + 'px';
    }
  }
  /**
   * Hides the icon.
   */
  hide() {
    if (this.div_) {
      this.div_.style.display = 'none';
    }
    this.visible_ = false;
  }
  /**
   * Positions and shows the icon.
   */
  show() {
    if (this.div_) {
      this.div_.className = this.className_;
      this.div_.style.cssText = this.createCss_(
        this.getPosFromLatLng_(this.center_),
      );
      this.div_.innerHTML =
        (this.style.url ? this.getImageElementHtml() : '') +
        this.getLabelDivHtml();
      if (typeof this.sums_.title === 'undefined' || this.sums_.title === '') {
        this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
      } else {
        this.div_.title = this.sums_.title;
      }
      this.div_.style.display = '';
    }
    this.visible_ = true;
  }
  getLabelDivHtml() {
    const mc = this.cluster_.getMarkerClusterer();
    const ariaLabel = mc.ariaLabelFn(this.sums_.text);
    const divStyle = {
      position: 'absolute',
      top: coercePixels(this.anchorText_[0]),
      left: coercePixels(this.anchorText_[1]),
      color: this.style.textColor,
      'font-size': coercePixels(this.style.textSize),
      'font-family': this.style.fontFamily,
      'font-weight': this.style.fontWeight,
      'font-style': this.style.fontStyle,
      'text-decoration': this.style.textDecoration,
      'text-align': 'center',
      width: coercePixels(this.style.width),
      'line-height': coercePixels(this.style.textLineHeight),
    };
    return `
<div aria-label='${ariaLabel}' style='${toCssText(divStyle)}' tabindex='0'>
  <span aria-hidden='true'>${this.sums_.text}</span>
</div>
`;
  }
  getImageElementHtml() {
    // NOTE: values must be specified in px units
    const bp = (this.style.backgroundPosition || '0 0').split(' ');
    const spriteH = parseInt(bp[0].replace(/^\s+|\s+$/g, ''), 10);
    const spriteV = parseInt(bp[1].replace(/^\s+|\s+$/g, ''), 10);
    let dimensions = {};
    if (this.cluster_.getMarkerClusterer().getEnableRetinaIcons()) {
      dimensions = {
        width: coercePixels(this.style.width),
        height: coercePixels(this.style.height),
      };
    } else {
      const [Y1, X1, Y2, X2] = [
        -1 * spriteV,
        -1 * spriteH + this.style.width,
        -1 * spriteV + this.style.height,
        -1 * spriteH,
      ];
      dimensions = {
        clip: `rect(${Y1}px, ${X1}px, ${Y2}px, ${X2}px)`,
      };
    }
    const cssText = toCssText(
      objectAssign(
        {
          position: 'absolute',
          top: coercePixels(spriteV),
          left: coercePixels(spriteH),
        },
        dimensions,
      ),
    );
    return `<img alt='${this.sums_.text}' aria-hidden='true' src='${this.style.url}' style='${cssText}'/>`;
  }
  /**
   * Sets the icon styles to the appropriate element in the styles array.
   *
   * @ignore
   * @param sums The icon label text and styles index.
   */
  useStyle(sums) {
    this.sums_ = sums;
    let index = Math.max(0, sums.index - 1);
    index = Math.min(this.styles_.length - 1, index);
    this.style = this.styles_[index];
    this.anchorText_ = this.style.anchorText || [0, 0];
    this.anchorIcon_ = this.style.anchorIcon || [
      Math.floor(this.style.height / 2),
      Math.floor(this.style.width / 2),
    ];
    this.className_ =
      this.cluster_.getMarkerClusterer().getClusterClass() +
      ' ' +
      (this.style.className || 'cluster-' + index);
  }
  /**
   * Sets the position at which to center the icon.
   *
   * @param center The latlng to set as the center.
   */
  setCenter(center) {
    this.center_ = center;
  }
  /**
   * Creates the `cssText` style parameter based on the position of the icon.
   *
   * @param pos The position of the icon.
   * @return The CSS style text.
   */
  createCss_(pos) {
    return toCssText({
      'z-index': `${this.cluster_.getMarkerClusterer().getZIndex()}`,
      top: coercePixels(pos.y),
      left: coercePixels(pos.x),
      width: coercePixels(this.style.width),
      height: coercePixels(this.style.height),
      cursor: 'pointer',
      position: 'absolute',
      '-webkit-user-select': 'none',
      '-khtml-user-select': 'none',
      '-moz-user-select': 'none',
      '-o-user-select': 'none',
      'user-select': 'none',
    });
  }
  /**
   * Returns the position at which to place the DIV depending on the latlng.
   *
   * @param latlng The position in latlng.
   * @return The position in pixels.
   */
  getPosFromLatLng_(latlng) {
    const pos = this.getProjection().fromLatLngToDivPixel(latlng);
    pos.x = Math.floor(pos.x - this.anchorIcon_[1]);
    pos.y = Math.floor(pos.y - this.anchorIcon_[0]);
    return pos;
  }
}
