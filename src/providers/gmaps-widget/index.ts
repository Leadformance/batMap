/**
 * Google Map v3
 * API Documentation: https://developers.google.com/maps/documentation/javascript/
 * MarkerClusterer: https://gmaps-marker-clusterer.github.io/gmaps-marker-clusterer/
 */

import { Provider } from '../../constants';
import { ProviderConstructorArgs } from '../../types';
import { DomUtils, LoaderUtils } from '../../utils';
import { GoogleMaps } from '../gmaps';
import { GmapsPremium } from '../gmaps/GmapsPremium';

type provider = Provider.gmaps;

export default GoogleMapsWidget;

export class GoogleMapsWidget extends GoogleMaps {
  private static iframeSelector = 'iframe[data-reactroot]';

  constructor(...args: ProviderConstructorArgs<provider>) {
    super(...args);

    if (!GoogleMapsWidget.iframe) {
      throw new Error(
        `The element "${GoogleMapsWidget.iframeSelector}" could not be found`,
      );
    }

    // @ts-ignore
    window.google = this.iframe.contentWindow?.google;
  }

  static get iframe(): HTMLFrameElement | null {
    return document.querySelector<HTMLFrameElement>(this.iframeSelector);
  }

  static setIframeWindowVars(): void {
    const iframe = GoogleMapsWidget.iframe;
    if (iframe) {
      // @ts-ignore
      iframe.contentWindow.GoogleMapWidget = GoogleMapsWidget;
      // @ts-ignore
      iframe.contentWindow.BatMap = GoogleMapsWidget;
    }
  }

  load(callback?: () => void): void {
    this.domElement.classList.add('batmap__map', 'batmap-gmaps');

    if (window.google && window.google.maps && callback) {
      setTimeout(callback, 0);
      return;
    }

    let urlParams = `?v=3.40&language=${this.config.locale}`;

    if (Array.isArray(this.apiKey)) {
      const [client, secret, channel] = this.apiKey;

      urlParams += `&client=${client}`;
      urlParams += GmapsPremium.sign(
        'https://maps.googleapis.com/maps/api/js',
        secret,
      );

      if (channel) {
        urlParams += `&channel=${channel}`;
      }
    } else {
      urlParams += `&key=${this.apiKey}`;
    }

    const resources = [
      DomUtils.createScript(`//maps.googleapis.com/maps/api/js${urlParams}`),
    ];

    DomUtils.addResources(
      GoogleMapsWidget.iframe?.contentDocument?.head as HTMLHeadElement,
      resources,
      LoaderUtils.addLoader(this.domElement, callback),
    );
  }
}

GoogleMapsWidget.setIframeWindowVars();
