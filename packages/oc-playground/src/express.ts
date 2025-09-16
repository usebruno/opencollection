import { Request, Response, Express } from 'express';
import { renderPlayground, ServerRenderOptions } from './server';

export interface PlaygroundHandlerOptions extends Omit<ServerRenderOptions, 'opencollection'> {
  collection?: any;
  name?: string;
  description?: string;
  docs?: string;
  environments?: any[];
  base?: any;
  items?: any[];
}

export interface PlaygroundMiddlewareOptions {
  /** Path to serve playground assets from (default: '/playground-assets') */
  assetsPath?: string;
  /** Custom path to playground dist-standalone directory (required) */
  playgroundDistPath: string;
}

export function playgroundHandler(options: PlaygroundHandlerOptions) {
  return (req: Request, res: Response) => {
    try {
      let collection = options.collection;
      
      if (!collection && (options.name || options.description || options.items)) {
        collection = {
          name: options.name || 'API Documentation',
          description: options.description,
          docs: options.docs,
          environments: options.environments,
          base: options.base,
          items: options.items || []
        };
      }

      if (!collection) {
        throw new Error('No collection data provided. Please provide either a "collection" object or individual properties like "name", "items", etc.');
      }

      const renderOptions: ServerRenderOptions = {
        opencollection: collection,
        theme: options.theme,
        logo: options.logo,
        customPages: options.customPages,
        hideSidebar: options.hideSidebar,
        hideHeader: options.hideHeader,
        onlyShow: options.onlyShow,
        title: options.title || collection.name || 'API Documentation',
        cdnUrl: options.cdnUrl,
        assetsPath: options.assetsPath || '/playground-assets',
        useLocalAssets: options.useLocalAssets !== false // Default to true for Express
      };

      const html = renderPlayground(renderOptions);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Error rendering playground:', error);
      res.status(500).send(`
        <html>
          <head><title>Error</title></head>
          <body>
            <h1>Error rendering API playground</h1>
            <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
          </body>
        </html>
      `);
    }
  };
}

/**
 * Sets up static asset serving for the playground files.
 * Call this before using playgroundHandler to ensure assets are available.
 * 
 * @param app Express application instance
 * @param expressStatic Express static middleware function (pass express.static)
 * @param options Configuration options for asset serving
 */
export function setupPlaygroundAssets(app: Express, expressStatic: any, options: PlaygroundMiddlewareOptions) {
  const { 
    assetsPath = '/playground-assets',
    playgroundDistPath 
  } = options;

  // Serve static assets using the provided express.static function
  try {
    app.use(assetsPath, expressStatic(playgroundDistPath));
    console.log(`📦 OpenCollection playground assets served from: ${assetsPath}`);
    console.log(`📁 Assets directory: ${playgroundDistPath}`);
  } catch (error) {
    throw new Error(`Failed to setup static assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// For CommonJS compatibility
export default playgroundHandler; 