// jshint ignore: start
"use strict";

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
import { ClusterIcon } from "./cluster-icon";
/**
 * Creates a single cluster that manages a group of proximate markers.
 *  Used internally, do not call this constructor directly.
 */
export class Cluster {
    /**
     *
     * @param markerClusterer_ The `MarkerClusterer` object with which this
     *  cluster is associated.
     */
    constructor(markerClusterer_) {
        this.markerClusterer_ = markerClusterer_;
        this.map_ = this.markerClusterer_.getMap();
        this.minClusterSize_ = this.markerClusterer_.getMinimumClusterSize();
        this.averageCenter_ = this.markerClusterer_.getAverageCenter();
        this.markers_ = []; // TODO: type;
        this.center_ = null;
        this.bounds_ = null;
        this.clusterIcon_ = new ClusterIcon(
            this,
            this.markerClusterer_.getStyles()
        );
    }
    /**
     * Returns the number of markers managed by the cluster. You can call this from
     * a `click`, `mouseover`, or `mouseout` event handler for the `MarkerClusterer` object.
     *
     * @return The number of markers in the cluster.
     */
    getSize() {
        return this.markers_.length;
    }
    /**
     * Returns the array of markers managed by the cluster. You can call this from
     * a `click`, `mouseover`, or `mouseout` event handler for the `MarkerClusterer` object.
     *
     * @return The array of markers in the cluster.
     */
    getMarkers() {
        return this.markers_;
    }
    /**
     * Returns the center of the cluster. You can call this from
     * a `click`, `mouseover`, or `mouseout` event handler
     * for the `MarkerClusterer` object.
     *
     * @return The center of the cluster.
     */
    getCenter() {
        return this.center_;
    }
    /**
     * Returns the map with which the cluster is associated.
     *
     * @return The map.
     * @ignore
     */
    getMap() {
        return this.map_;
    }
    /**
     * Returns the `MarkerClusterer` object with which the cluster is associated.
     *
     * @return The associated marker clusterer.
     * @ignore
     */
    getMarkerClusterer() {
        return this.markerClusterer_;
    }
    /**
     * Returns the bounds of the cluster.
     *
     * @return the cluster bounds.
     * @ignore
     */
    getBounds() {
        const bounds = new google.maps.LatLngBounds(this.center_, this.center_);
        const markers = this.getMarkers();
        for (let i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
        return bounds;
    }
    /**
     * Removes the cluster from the map.
     *
     * @ignore
     */
    remove() {
        this.clusterIcon_.setMap(null);
        this.markers_ = [];
        delete this.markers_;
    }
    /**
     * Adds a marker to the cluster.
     *
     * @param marker The marker to be added.
     * @return True if the marker was added.
     * @ignore
     */
    addMarker(marker) {
        if (this.isMarkerAlreadyAdded_(marker)) {
            return false;
        }
        if (!this.center_) {
            this.center_ = marker.getPosition();
            this.calculateBounds_();
        } else {
            if (this.averageCenter_) {
                const l = this.markers_.length + 1;
                const lat =
                    (this.center_.lat() * (l - 1) +
                        marker.getPosition().lat()) /
                    l;
                const lng =
                    (this.center_.lng() * (l - 1) +
                        marker.getPosition().lng()) /
                    l;
                this.center_ = new google.maps.LatLng(lat, lng);
                this.calculateBounds_();
            }
        }
        marker.isAdded = true;
        this.markers_.push(marker);
        const mCount = this.markers_.length;
        const mz = this.markerClusterer_.getMaxZoom();
        if (mz !== null && this.map_.getZoom() > mz) {
            // Zoomed in past max zoom, so show the marker.
            if (marker.getMap() !== this.map_) {
                marker.setMap(this.map_);
            }
        } else if (mCount < this.minClusterSize_) {
            // Min cluster size not reached so show the marker.
            if (marker.getMap() !== this.map_) {
                marker.setMap(this.map_);
            }
        } else if (mCount === this.minClusterSize_) {
            // Hide the markers that were showing.
            for (let i = 0; i < mCount; i++) {
                this.markers_[i].setMap(null);
            }
        } else {
            marker.setMap(null);
        }
        return true;
    }
    /**
     * Determines if a marker lies within the cluster's bounds.
     *
     * @param marker The marker to check.
     * @return True if the marker lies in the bounds.
     * @ignore
     */
    isMarkerInClusterBounds(marker) {
        return this.bounds_.contains(marker.getPosition());
    }
    /**
     * Calculates the extended bounds of the cluster with the grid.
     */
    calculateBounds_() {
        const bounds = new google.maps.LatLngBounds(this.center_, this.center_);
        this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
    }
    /**
     * Updates the cluster icon.
     */
    updateIcon() {
        const mCount = this.markers_.length;
        const mz = this.markerClusterer_.getMaxZoom();
        if (mz !== null && this.map_.getZoom() > mz) {
            this.clusterIcon_.hide();
            return;
        }
        if (mCount < this.minClusterSize_) {
            // Min cluster size not yet reached.
            this.clusterIcon_.hide();
            return;
        }
        const numStyles = this.markerClusterer_.getStyles().length;
        const sums = this.markerClusterer_.getCalculator()(
            this.markers_,
            numStyles
        );
        this.clusterIcon_.setCenter(this.center_);
        this.clusterIcon_.useStyle(sums);
        this.clusterIcon_.show();
    }
    /**
     * Determines if a marker has already been added to the cluster.
     *
     * @param marker The marker to check.
     * @return True if the marker has already been added.
     */
    isMarkerAlreadyAdded_(marker) {
        if (this.markers_.indexOf) {
            return this.markers_.indexOf(marker) !== -1;
        } else {
            for (let i = 0; i < this.markers_.length; i++) {
                if (marker === this.markers_[i]) {
                    return true;
                }
            }
        }
        return false;
    }
}
