
export interface ServerRenderOptions {
  opencollection: any;
  theme?: 'light' | 'dark' | 'auto';
  logo?: string;
  customPages?: Array<{
    name: string;
    content?: string;
    contentPath?: string;
  }>;
  hideSidebar?: boolean;
  hideHeader?: boolean;
  onlyShow?: string[];
  title?: string;
  cdnUrl?: string;
  /** Base path for serving static assets locally (e.g., '/static/playground') */
  assetsPath?: string;
  /** Whether to use local assets instead of CDN */
  useLocalAssets?: boolean;
}

export function renderPlayground(options: ServerRenderOptions): string {
  const {
    opencollection,
    theme = 'light',
    logo,
    customPages,
    hideSidebar = false,
    hideHeader = false,
    onlyShow,
    title = 'API Playground',
    cdnUrl = 'https://cdn.jsdelivr.net/npm/@opencollection/playground@latest/dist-standalone',
    assetsPath = '/playground-assets',
    useLocalAssets = false
  } = options;

  const processedCollection = opencollection;

  const config = {
    opencollection: processedCollection,
    theme,
    logo,
    customPages,
    hideSidebar,
    hideHeader,
    onlyShow
  };

  const configJson = JSON.stringify(config).replace(/</g, '\\u003c');
  
  const baseAssetUrl = useLocalAssets ? assetsPath : cdnUrl;
  const cssUrl = `${baseAssetUrl}/playground.css`;
  const jsUrl = `${baseAssetUrl}/playground.umd.js`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="${cssUrl}">
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        #playground {
            height: 100vh;
            width: 100vw;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-size: 18px;
            color: #666;
        }
    </style>
</head>
<body>
    <div id="playground">
        <div class="loading">Loading API Playground...</div>
    </div>

    <script>
        window.__PLAYGROUND_CONFIG__ = ${configJson};
    </script>
    <script src="${jsUrl}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            try {
                // Use window.OpenCollection for standalone builds
                const PlaygroundClass = window.OpenCollection || OpenCollection;
                if (!PlaygroundClass) {
                    throw new Error('OpenCollection is not available. Make sure the playground script is loaded correctly.');
                }
                
                const playground = new PlaygroundClass({
                    target: document.getElementById('playground'),
                    ...window.__PLAYGROUND_CONFIG__
                });
                console.log('Playground initialized successfully');
            } catch (error) {
                console.error('Failed to initialize playground:', error);
                document.getElementById('playground').innerHTML = 
                    '<div class="loading" style="color: red;">Failed to load API Playground: ' + error.message + '</div>';
            }
        });
    </script>
</body>
</html>`;
}

// For CommonJS compatibility
export default renderPlayground; 