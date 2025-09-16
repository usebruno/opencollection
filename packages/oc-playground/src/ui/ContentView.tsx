import React, { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import '../styles/index.css';
import { OpenCollectionItem, HttpRequest } from '../types';

interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  name?: string;
  description?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  requestBody?: any;
  brunoUrl?: string;
}

interface ApiResponse {
  status: number;
  description?: string;
  body?: any;
}

interface ApiEndpointWithResponses extends ApiEndpoint {
  responses?: ApiResponse[];
  isFolder?: boolean;
}

export interface ContentViewProps {
  endpoint: ApiEndpointWithResponses | OpenCollectionItem;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

const ContentView: React.FC<ContentViewProps> = ({ endpoint, theme = 'light', className = '' }) => {
  const processedEndpoint = useMemo(() => {
    if (endpoint && 'type' in endpoint) {
      const item = endpoint as OpenCollectionItem;
      const itemName = item.type === 'http' ? (item as HttpRequest).name || item.type : item.type;
      const itemId = itemName.replace(/\s+/g, '-').toLowerCase();
      
      if (item.type !== 'http') {
        return {
          id: itemId,
          method: item.type.toUpperCase(),
          path: itemName,
          name: itemName,
          description: item.type === 'folder' ? (item as any).docs || '' : '',
          isFolder: item.type === 'folder',
        } as ApiEndpointWithResponses & { isFolder?: boolean };
      }
      
      const httpItem = item as HttpRequest;
      const normalizedEndpoint: ApiEndpointWithResponses = {
        id: itemId,
        name: httpItem.name || 'Untitled',
        method: httpItem.method || 'GET',
        path: httpItem.url || '',
        description: httpItem.docs || '',
        headers: {},
        queryParams: {},
      };
      
      if (httpItem.headers) {
        normalizedEndpoint.headers = httpItem.headers.reduce(
          (acc: Record<string, string>, header: any) => {
            if (header.disabled !== true) {
              acc[header.name] = header.value;
            }
            return acc;
          }, {}
        );
      }
      
      if (httpItem.params) {
        normalizedEndpoint.queryParams = httpItem.params.reduce(
          (acc: Record<string, string>, param: any) => {
            if (param.enabled !== false) {
              acc[param.name] = param.value;
            }
            return acc;
          }, {}
        );
      }
      
      if (httpItem.body && typeof httpItem.body === 'object' && 'data' in httpItem.body) {
        const rawBody = httpItem.body as any;
        if (rawBody.type === 'json') {
          try {
            normalizedEndpoint.requestBody = JSON.parse(rawBody.data || '{}');
          } catch {
            normalizedEndpoint.requestBody = rawBody.data;
          }
        } else {
          normalizedEndpoint.requestBody = rawBody.data;
        }
      }
      
      return normalizedEndpoint;
    }
    
    return endpoint as ApiEndpointWithResponses;
  }, [endpoint]);

  const md = useMemo(() => {
    const markdownIt = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      highlight: function (str: string, lang: string) {
        return `<pre class="language-${lang}"><code class="language-${lang}">${str}</code></pre>`;
      }
    });

    const defaultRender = markdownIt.renderer.rules.heading_open || function(tokens: any, idx: number, options: any, env: any, self: any) {
      return self.renderToken(tokens, idx, options);
    };

    markdownIt.renderer.rules.heading_open = function(tokens: any, idx: number, options: any, env: any, self: any) {
      const token = tokens[idx];
      const level = token.tag.substr(1); // h1 -> 1, h2 -> 2, etc.
      
      // Add custom classes based on heading level
      if (level === '1') {
        token.attrJoin('class', 'text-2xl font-bold mt-6 mb-3 heading-1');
      } else if (level === '2') {
        token.attrJoin('class', 'text-xl font-semibold mt-5 mb-2 heading-2');
      } else if (level === '3') {
        token.attrJoin('class', 'text-lg font-semibold mt-4 mb-2 heading-3');
      } else {
        token.attrJoin('class', 'font-semibold mt-3 mb-1 heading-4');
      }
      
      return defaultRender(tokens, idx, options, env, self);
    };

    return markdownIt;
  }, []);

  return (
    <div className={`content-view ${className}`} id={`content-${processedEndpoint.id}`}>
      
      <div className="endpoint-header mb-4">
        <div className="flex items-center">
          {processedEndpoint.isFolder ? (
            <div className="folder-badge flex items-center justify-center" style={{ 
              width: '28px',
              height: '28px',
            }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          ) : (
            <div className="method-badge" style={{ 
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '600',
              backgroundColor: `var(--method-${processedEndpoint.method.toLowerCase()}-bg)`,
              color: `var(--method-${processedEndpoint.method.toLowerCase()}-text, var(--text-primary))`
            }}>
              {processedEndpoint.method}
            </div>
          )}
          <h2 className="ml-2 text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {processedEndpoint.name || processedEndpoint.path.split('/').pop()}
          </h2>
          {processedEndpoint.brunoUrl && (
            <a
              href={processedEndpoint.brunoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs px-2 py-1 rounded-md font-medium hover-lift transition-all"
              style={{ 
                backgroundColor: 'var(--primary-color)', 
                color: 'white'
              }}
            >
              Open in Bruno
            </a>
          )}
        </div>
        <div className="endpoint-path text-sm font-mono mt-1 break-words" style={{ color: 'var(--text-secondary)' }}>
          {processedEndpoint.path}
        </div>
      </div>

      
      <div className="endpoint-content" style={{ color: 'var(--text-primary)' }}>
        
        {processedEndpoint.description && (
          <section className="documentation-section mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Documentation</h3>
            <div 
              className="prose prose-headings:my-0 prose-headings:font-semibold prose-sm md:prose lg:prose-lg dark:prose-invert max-w-none markdown-documentation" 
              dangerouslySetInnerHTML={{ __html: md.render(processedEndpoint.description) }}
            />
          </section>
        )}

        
        <section className="request-section mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Request</h3>
          
          
          {processedEndpoint.headers && Object.keys(processedEndpoint.headers).length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Headers</h4>
              <div className="overflow-x-auto rounded-apple shadow-apple-sm">
                <table className="api-table w-full" style={{ 
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th scope="col" style={{ backgroundColor: 'var(--table-header-bg)' }}>Name</th>
                      <th scope="col" style={{ backgroundColor: 'var(--table-header-bg)' }}>Value</th>
                      <th scope="col" style={{ backgroundColor: 'var(--table-header-bg)' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(processedEndpoint.headers).map(([key, value]) => (
                      <tr key={key} style={{ borderBottom: '1px solid var(--border-color)' }} className="themed-row">
                        <td className="font-medium" style={{ color: 'var(--text-primary)' }}>{key}</td>
                        <td>
                          <code className="text-xs px-1.5 py-0.5 rounded" style={{ 
                            backgroundColor: 'var(--code-bg)', 
                            color: 'var(--code-text)' 
                          }}>
                            {String(value)}
                          </code>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }} className="italic">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          
          {processedEndpoint.queryParams && Object.keys(processedEndpoint.queryParams).length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Query Parameters</h4>
              <div className="overflow-x-auto rounded-apple shadow-apple-sm">
                <table className="api-table w-full" style={{ 
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th scope="col" style={{ backgroundColor: 'var(--table-header-bg)' }}>Name</th>
                      <th scope="col" style={{ backgroundColor: 'var(--table-header-bg)' }}>Value</th>
                      <th scope="col" style={{ backgroundColor: 'var(--table-header-bg)' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(processedEndpoint.queryParams).map(([key, value]) => (
                      <tr key={key} style={{ borderBottom: '1px solid var(--border-color)' }} className="themed-row">
                        <td className="font-medium" style={{ color: 'var(--text-primary)' }}>{key}</td>
                        <td>
                          <code className="text-xs px-1.5 py-0.5 rounded" style={{ 
                            backgroundColor: 'var(--code-bg)', 
                            color: 'var(--code-text)' 
                          }}>
                            {String(value)}
                          </code>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }} className="italic">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          
          {processedEndpoint.requestBody && (
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Request Body</h4>
              <div className="code-block rounded-apple p-4 shadow-apple-sm overflow-auto" style={{ 
                backgroundColor: 'var(--code-bg)',
                color: 'var(--code-text)',
                maxHeight: '400px'
              }}>
                <pre style={{ color: 'var(--code-text)' }}>{JSON.stringify(processedEndpoint.requestBody, null, 2)}</pre>
              </div>
            </div>
          )}
        </section>
        
        
        {processedEndpoint.responses && processedEndpoint.responses.length > 0 && (
          <section className="response-section mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Responses</h3>
            
            {processedEndpoint.responses.map((response: ApiResponse, index: number) => (
              <div key={`response-${index}`} className="mb-6">
                <div className="flex items-center mb-2">
                  <h4 className="text-md font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Status: <span className={`status-${response.status}`}>{response.status}</span>
                  </h4>
                  {response.description && (
                    <span className="ml-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {response.description}
                    </span>
                  )}
                </div>
                
                {response.body && (
                  <div className="code-block rounded-apple p-4 shadow-apple-sm overflow-auto" style={{ 
                    backgroundColor: 'var(--code-bg)',
                    color: 'var(--code-text)',
                    maxHeight: '400px'
                  }}>
                    <pre style={{ color: 'var(--code-text)' }}>{JSON.stringify(response.body, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ContentView; 