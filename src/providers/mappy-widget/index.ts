/**
 * Mappy Map
 * API Documentation: https://leafletjs.com/reference-1.0.3.html
 * MarkerCluster Documentation: https://leaflet.github.io/Leaflet.markercluster/
 */

// eslint-disable-next-line import/no-unresolved
import * as L from 'leaflet';

import { Provider } from '../../constants';
import { ProviderConstructorArgs } from '../../types';
import { DomUtils, LoaderUtils } from '../../utils';
import { Mappy } from '../mappy';

type provider = Provider.mappy;

export default MappyWidget;

export class MappyWidget extends Mappy {
  private static iframeSelector = 'iframe[data-reactroot]';

  constructor(...args: ProviderConstructorArgs<provider>) {
    super(...args);

    if (!MappyWidget.iframe) {
      throw new Error(
        `The element "${MappyWidget.iframeSelector}" could not be found`,
      );
    }

    // @ts-ignore
    window.L = this.iframe.contentWindow?.L;
  }

  static get iframe(): HTMLFrameElement | null {
    return document.querySelector<HTMLFrameElement>(this.iframeSelector);
  }

  static setIframeWindowVars(): void {
    const iframe = MappyWidget.iframe;
    if (iframe) {
      // @ts-ignore
      iframe.contentWindow.GoogleMapWidget = GoogleMapsWidget;
      // @ts-ignore
      iframe.contentWindow.BatMap = GoogleMapsWidget;
    }
  }

  load(callback?: () => void): void {
    this.domElement.classList.add('batmap__map', 'batmap-mappy');

    // @ts-ignore
    if (window.L && window.L.Mappy && callback) {
      setTimeout(callback, 0);
      return;
    }

    DomUtils.addResources(
      document.head,
      [
        DomUtils.createStyle(
          '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css',
        ),
        DomUtils.createScript(
          '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.js',
        ),
      ],
      () => {
        const resources = [
          DomUtils.createScript(
            '//d11lbkprc85eyb.cloudfront.net/Mappy/7.5.0/L.Mappy.js',
          ),
          DomUtils.createStyle(
            '//d11lbkprc85eyb.cloudfront.net/Mappy/7.5.0/L.Mappy.css',
          ),
        ];

        if (this.config.showCluster) {
          resources.push(
            DomUtils.createScript(
              '//d11lbkprc85eyb.cloudfront.net/plugins/mappy/7.5.0/leaflet.markercluster.js',
            ),
          );
          resources.push(
            DomUtils.createStyle(
              '//d11lbkprc85eyb.cloudfront.net/plugins/mappy/7.5.0/MarkerCluster.Default.css',
            ),
          );
          resources.push(
            DomUtils.createStyle(
              '//d11lbkprc85eyb.cloudfront.net/plugins/mappy/7.5.0/MarkerCluster.css',
            ),
          );
        }

        DomUtils.addResources(document.head, resources, () => {
          L.Mappy.setImgPath(
            '//d11lbkprc85eyb.cloudfront.net/Mappy/7.5.0/images/',
          );
          LoaderUtils.addLoader(this.domElement, callback);
        });
      },
    );
  }
}

MappyWidget.setIframeWindowVars();
