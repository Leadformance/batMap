import express from 'express';
import { isDefined } from 'simple-js-validator';

export class Server {
  constructor() {
    const app = express();
    app.use('/', express.static(__dirname + '/../../dist/'));
    this.app = app;
  }

  start(staticContent, config) {
    if (true === isDefined(staticContent)) {
      console.log(`serve static content from ${staticContent}`);
      this.app.use('/', express.static(staticContent));
    }
    this.server = this.app.listen(config.port);
    console.log('server listening on ' + config.port);
    return this;
  }

  stop() {
    this.server.close(() => {
      console.log('server stopped');
    });
  }
}

/**
 * start a node server that serve static content and js scripts for managing Maps of various providers (google, mappy, ...)
 * @param staticContent: a directory that contain static content to serve
 * @param config: an object for configuring the server:<ul>
 *     <li>port: the port the server listen. If undefined, will use 8000</li>
 * </ul>
 * @returns {Promise<*>}
 */
export async function startServer(staticContent, config = {}) {
  const myConfig = Object.assign(
    {
      port: 8000,
    },
    config,
  );

  return new Server().start(staticContent, myConfig);
}
