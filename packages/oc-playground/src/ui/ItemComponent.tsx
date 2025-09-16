import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import { OpenCollectionItem, OpenCollectionCollection, HttpRequest } from '../types';
import { generateSectionId, getItemId } from '../utils/itemUtils';
import {
  HeadersTable,
  VarsTable,
  AssertionsTable,
  MultipartFormTable,
  FormUrlEncodedTable
} from './TableHelpers';
import ItemListRenderer from './ItemListRenderer';
import BodyCard from './BodyCard';
import CodeBlock from './CodeBlock';

// This is a memoized component to render individual items
const ItemComponent = memo(({
  item,
  registerSectionRef,
  theme,
  md,
  parentPath = '',
  collection
}: {
  item: OpenCollectionItem;
  registerSectionRef: (id: string, ref: HTMLDivElement | null) => void;
  theme: 'light' | 'dark' | 'auto';
  md: any;
  parentPath?: string;
  collection?: OpenCollectionCollection;
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'fetch' | 'http'>('curl');
  const [codeCopied, setCodeCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const itemId = getItemId(item);
  const sectionId = generateSectionId(item, parentPath);
  
  const trackingId = parentPath ? `${parentPath}/${itemId}` : itemId;

  const sectionRefCallback = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      console.log('Registering section ref for:', sectionId, 'with element ID:', element.id);
      registerSectionRef(sectionId, element);
    }
  }, [sectionId, registerSectionRef]);

  const renderHeadersTable = (headers: Array<{ name: string; value: string; enabled?: boolean; description?: string; uid?: string }>) => {
    if (!headers || !headers.length) {
      return null;
    }
    return <HeadersTable headers={headers} />;
  };

  const renderVarsTable = (vars: Array<{ name: string; value: string; enabled?: boolean; local?: boolean; uid?: string }>) => {
    if (!vars || !vars.length) {
      return null;
    }
    return <VarsTable vars={vars} />;
  };

  const renderScripts = (script: Record<string, string>) => {
    if (!script || Object.keys(script).length === 0) {
      return null;
    }

    const [activeScriptTab, setActiveScriptTab] = useState<'req' | 'res'>('req');
    const scriptCodeRef = useRef<HTMLPreElement>(null);

    const scriptMap = {
      req: script.req || script.pre || '',
      res: script.res || script.post || ''
    };

    if (!scriptMap.req && !scriptMap.res) {
      return null;
    }

    useEffect(() => {
      if (scriptCodeRef.current) {
        Prism.highlightAllUnder(scriptCodeRef.current);
      }
    }, [activeScriptTab]);

    return (
      <div className="mb-6" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <div className="rounded-lg overflow-hidden shadow-apple-sm" style={{
          background: 'var(--background-color)',
          border: '1px solid var(--border-color)',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          
          <div className="flex border-b border-solid" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--table-header-bg)' }}>
            <div className="relative flex">

              <div
                className="absolute bottom-0 h-0.5 transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: 'var(--primary-color, #3b82f6)',
                  left: activeScriptTab === 'req' ? '0%' : '50%',
                  width: '50%',
                }}
              />


              <button
                className={`px-4 py-2 text-sm font-medium relative transition-colors duration-200 flex-1 ${activeScriptTab === 'req' ? 'text-primary-600' : 'text-gray-500'}`}
                style={{
                  color: activeScriptTab === 'req' ? 'var(--primary-color, #3b82f6)' : 'var(--text-secondary)',
                  minWidth: '120px'
                }}
                onClick={() => setActiveScriptTab('req')}
              >
                Pre Script
              </button>


              <button
                className={`px-4 py-2 text-sm font-medium relative transition-colors duration-200 flex-1 ${activeScriptTab === 'res' ? 'text-primary-600' : 'text-gray-500'}`}
                style={{
                  color: activeScriptTab === 'res' ? 'var(--primary-color, #3b82f6)' : 'var(--text-secondary)',
                  minWidth: '120px'
                }}
                onClick={() => setActiveScriptTab('res')}
              >
                Post Script
              </button>
            </div>
          </div>

          
          <div className="p-0" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            {activeScriptTab === 'req' && scriptMap.req && (
              <div className="transition-opacity duration-200" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                <pre ref={scriptCodeRef} className="language-javascript p-4" style={{
                  backgroundColor: 'var(--table-row-odd-bg)',
                  color: 'var(--code-text)',
                  margin: 0,
                  maxWidth: '100%',
                  whiteSpace: 'pre',
                  overflowX: 'auto',
                  wordWrap: 'normal'
                }}>
                  <code style={{ whiteSpace: 'pre' }}>{scriptMap.req}</code>
                </pre>
              </div>
            )}

            {activeScriptTab === 'res' && scriptMap.res && (
              <div className="transition-opacity duration-200" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                <pre ref={scriptCodeRef} className="language-javascript p-4" style={{
                  backgroundColor: 'var(--table-row-odd-bg)',
                  color: 'var(--code-text)',
                  margin: 0,
                  maxWidth: '100%',
                  whiteSpace: 'pre',
                  overflowX: 'auto'
                }}>
                  <code>{scriptMap.res}</code>
                </pre>
              </div>
            )}

            {activeScriptTab === 'req' && !scriptMap.req && (
              <div className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                No pre-request script available
              </div>
            )}

            {activeScriptTab === 'res' && !scriptMap.res && (
              <div className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                No post-response script available
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const formatCurlHeaders = (headers: Record<string, string> = {}) => {
    return Object.entries(headers)
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(" \\\n  ");
  };

  const formatQueryParams = (queryParams: Record<string, string> = {}) => {
    const params = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return params ? `?${params}` : "";
  };

  const formatRequestBody = (requestBody: any, contentType: string = "application/json") => {
    if (!requestBody) return "";

    if (typeof requestBody === "string") {
      if (contentType === "application/json") {
        try {
          const parsed = JSON.parse(requestBody);
          return JSON.stringify(parsed, null, 2);
        } catch {
          return requestBody;
        }
      } else if (contentType === "application/xml") {
        return requestBody;
      } else {
        return requestBody;
      }
    }

    return JSON.stringify(requestBody, null, 2);
  };

  const getNormalizedEndpoint = () => {
    if (item.type !== 'http') return null;

    const httpItem = item as HttpRequest;
    const headers: Record<string, string> = {};
    if (httpItem.headers) {
      httpItem.headers.forEach((header: any) => {
        if (header.disabled !== true) {
          headers[header.name] = header.value;
        }
      });
    }

    const queryParams: Record<string, string> = {};
    if (httpItem.params) {
      httpItem.params.forEach((param: any) => {
        if (param.enabled !== false) {
          queryParams[param.name] = param.value;
        }
      });
    }

    let requestBody = null;
    let contentType = "application/json";

    if (httpItem.body) {
      if (typeof httpItem.body === 'object' && 'data' in httpItem.body) {
        const rawBody = httpItem.body as any;
        if (rawBody.type === 'json') {
        try {
            requestBody = JSON.parse(rawBody.data);
          contentType = "application/json";
        } catch {
            requestBody = rawBody.data;
        }
        } else if (rawBody.type === 'text') {
          requestBody = rawBody.data;
        contentType = "text/plain";
        } else if (rawBody.type === 'xml') {
          requestBody = rawBody.data;
        contentType = "application/xml";
        }
      }
    }

    const itemName = httpItem.name || httpItem.type;
    return {
      id: itemName,
      method: httpItem.method || 'GET',
      path: httpItem.url || '',
      description: httpItem.docs || '',
      headers: headers,
      queryParams: queryParams,
      requestBody: requestBody,
      contentType: contentType
    };
  };

  const generateCodeSample = () => {
    const endpoint = getNormalizedEndpoint();
    if (!endpoint) return '';

    const { method, path, headers, queryParams, requestBody, contentType } = endpoint;
    const url = `${path}${formatQueryParams(queryParams)}`;

    const headersWithContentType = { ...headers };
    if (requestBody && !Object.keys(headers).some(key => key.toLowerCase() === 'content-type')) {
      headersWithContentType['Content-Type'] = contentType;
    }

    switch (activeCodeTab) {
      case 'curl':
        let curlCommand = `curl -X ${method} "${url}"`;
        if (Object.keys(headersWithContentType).length) {
          curlCommand += ` \\\n  ${formatCurlHeaders(headersWithContentType)}`;
        }
        if (requestBody) {
          const bodyStr = formatRequestBody(requestBody, contentType);
          curlCommand += ` \\\n  -d '${bodyStr.replace(/'/g, "\\'")}'`;
        }
        return curlCommand;

      case 'fetch':
        let fetchCode = `const options = {\n  method: "${method}"`;
        if (Object.keys(headersWithContentType).length) {
          fetchCode += `,\n  headers: {\n    ${Object.entries(headersWithContentType)
            .map(([key, value]) => `"${key}": "${value}"`)
            .join(",\n    ")}\n  }`;
        }
        if (requestBody) {
          if (contentType === "application/json") {
            fetchCode += `,\n  body: JSON.stringify(${formatRequestBody(requestBody, contentType)})`;
          } else {
            fetchCode += `,\n  body: \`${formatRequestBody(requestBody, contentType).replace(/`/g, "\\`")}\``;
          }
        }

        let responseHandling = "";
        if (contentType === "application/json") {
          responseHandling = ".then(response => response.json())\n  .then(json => console.log(json))";
        } else if (contentType === "application/xml") {
          responseHandling = ".then(response => response.text())\n  .then(text => console.log(text))";
        } else {
          responseHandling = ".then(response => response.text())\n  .then(text => console.log(text))";
        }

        fetchCode += `\n};\n\nfetch("${url}", options)\n  ${responseHandling}\n  .catch(err => console.error('error', err));`;
        return fetchCode;

      case 'http':
        let httpRequest = `${method} ${url} HTTP/1.1\n`;
        if (Object.keys(headersWithContentType).length) {
          httpRequest += Object.entries(headersWithContentType)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        }
        if (requestBody) {
          httpRequest += `\n\n${formatRequestBody(requestBody, contentType)}`;
        }
        return httpRequest;

      default:
        return '';
    }
  };

  const handleCopyCode = () => {
    const code = generateCodeSample();
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const renderAssertionsTable = (assertions: Array<{ name: string; value: string; enabled?: boolean; uid?: string }>) => {
    if (!assertions || !assertions.length) {
      return null;
    }
    return <AssertionsTable assertions={assertions} />;
  };

  const renderCodeSamples = () => {
    if (item.type !== 'http') return null;

    const code = generateCodeSample();
    const codeLanguage = activeCodeTab === 'curl' ? 'bash' : activeCodeTab === 'fetch' ? 'javascript' : 'http';

    const languageOptions = [
      {
        id: 'curl', label: 'cURL', icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
          </svg>
        )
      },
      {
        id: 'fetch', label: 'Fetch API', icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
            <line x1="16" y1="8" x2="2" y2="22"></line>
            <line x1="17.5" y1="15" x2="9" y2="15"></line>
          </svg>
        )
      },
      {
        id: 'http', label: 'HTTP', icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        )
      }
    ];

    const selectedLanguage = languageOptions.find(lang => lang.id === activeCodeTab) || languageOptions[0];

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
      const handleClickOutside = () => {
        setDropdownOpen(false);
      };

      if (dropdownOpen) {
        document.addEventListener('click', handleClickOutside);
      }

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [dropdownOpen]);

    return (
      <div className="code-block relative rounded-lg" style={{
        background: theme === 'light' ? 'var(--background-color)' : 'var(--prose-code-bg, var(--code-bg, #181818))',
        position: 'relative',
        border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
      }}>
        <div style={{
          padding: '10px 16px',
          background: theme === 'light' ? 'var(--table-header-bg)' : 'rgba(0, 0, 0, 0.2)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontFamily: 'monospace',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={toggleDropdown}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {selectedLanguage.icon}
                {selectedLanguage.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transition: 'transform 0.2s ease',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  backgroundColor: 'var(--background-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  width: '150px',
                  overflow: 'hidden'
                }}>
                  {languageOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setActiveCodeTab(option.id as 'curl' | 'fetch' | 'http');
                        setDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        width: '100%',
                        textAlign: 'left',
                        backgroundColor: activeCodeTab === option.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        color: activeCodeTab === option.id ? 'var(--primary-color, #3b82f6)' : 'var(--text-primary)',
                        border: 'none',
                        borderBottom: option.id !== languageOptions[languageOptions.length - 1].id ? '1px solid var(--border-color)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {option.icon}
                      {option.label}
                      {activeCodeTab === option.id && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginLeft: 'auto' }}
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </span>
          <button
            onClick={handleCopyCode}
            style={{
              background: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              padding: '4px 8px',
              fontSize: '12px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            {codeCopied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <pre ref={codeRef} style={{
          margin: 0,
          padding: '16px',
          overflowX: 'auto',
          fontSize: '13px',
          fontFamily: 'monospace',
          color: theme === 'light' ? 'var(--text-primary)' : 'var(--prose-code-text, var(--code-text, rgb(204, 204, 204)))',
          backgroundColor: theme === 'light' ? 'var(--background-color)' : 'var(--prose-code-bg, var(--code-bg, #181818))',
          lineHeight: 1.5
        }}>
          <code className={`language-${codeLanguage}`}>{code}</code>
        </pre>
      </div>
    );
  };

  // Highlight code when it changes or tab changes
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightAllUnder(codeRef.current);
    }
  }, [activeCodeTab, item]);

  if (item.type === 'folder' && [] && [].length > 0) {
    return (
      <div key={itemId} id={`section-${sectionId}`} ref={sectionRefCallback}>
        <div className="endpoint-header m-6" style={{ marginBottom: '1.5rem' }}>
          <h1 className="endpoint-name">{item.name}</h1>
          <div className="endpoint-method-url my-2">
            <span className="method-badge folder" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--folder-badge-bg, #6366f1)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              FOLDER
            </span>
          </div>
        </div>


        <div className='m-6'>
          <div className="text-sm text-gray-500">
            This folder contains configuration items. OpenCollection folders are simple containers without nested documentation.
          </div>
        </div>

        <div className="folder-content-grid">
          <div className="folder-main">
            <ItemListRenderer
              items={[]}
              registerSectionRef={registerSectionRef}
              theme={theme}
              md={md}
              parentPath={parentPath}
              collection={collection}
            />
          </div>
        </div>
      </div>
    );
  }
  else if (item.type === 'http') {
    const httpItem = item as HttpRequest;
    const endpoint = {
      id: itemId,
      name: httpItem.name || 'Untitled',
      method: httpItem.method || 'GET',
      url: httpItem.url || '',
      description: httpItem.docs || '',
      headers: httpItem.headers || [],
      body: httpItem.body || { mode: 'none' },
      params: httpItem.params || [],
      auth: httpItem.auth || { mode: 'none' },
      vars: httpItem.variables || {},
      assertions: httpItem.assertions || [],
      tests: '',
      script: httpItem.scripts || {}
    };

    return (
      <div className={`endpoint-content ${theme}`} id={`section-${sectionId}`} ref={sectionRefCallback}>
  
        <div className="endpoint-header">
          <h1 className="endpoint-name">{endpoint.name}</h1>
          <div className="endpoint-method-url my-2">
            <span className={`method-badge text-xs ${endpoint.method.toLowerCase()}`}>
              {endpoint.method}
            </span>
            <span className="endpoint-url text-sm">{endpoint.url}</span>
          </div>

          {endpoint.description && (
            <div className="prose prose-headings:my-0 prose-headings:font-semibold prose-sm md:prose lg:prose-lg dark:prose-invert max-w-none markdown-documentation">
              <div dangerouslySetInnerHTML={{ __html: md.render(endpoint.description) }} />
            </div>
          )}
        </div>

        <div className="endpoint-grid">
  
          <div className="endpoint-details flex flex-col gap-5">
  
            {false && endpoint.auth && (
              <div>
                <h3 className="text-lg font-semibold">Authentication</h3>
                <div className="auth-details" style={{
                  backgroundColor: theme === 'light' ? 'var(--background-color)' : 'var(--prose-code-bg, var(--code-bg, #181818))',
                  border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {(endpoint.auth as any)?.mode === 'basic' && (
                    <div className="auth-basic">
                      <div style={{
                        padding: '10px 16px',
                        background: theme === 'light' ? 'var(--table-header-bg)' : 'rgba(0, 0, 0, 0.2)',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderBottom: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Basic Authentication
                      </div>
                      <div style={{
                        padding: '16px',
                        color: theme === 'light' ? 'var(--text-primary)' : 'var(--prose-code-text, var(--code-text, rgb(204, 204, 204)))',
                        backgroundColor: theme === 'light' ? 'var(--background-color)' : 'var(--prose-code-bg, var(--code-bg, #181818))',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        lineHeight: 1.5
                      }}>
                        {(endpoint.auth as any)?.username && (
                          <div className="auth-param" style={{ marginBottom: '8px' }}>
                            <span style={{ color: 'var(--primary-color, #3b82f6)', fontWeight: 500 }}>Username:</span>
                            <code style={{
                              marginLeft: '8px',
                              padding: '2px 4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px'
                            }}>{(endpoint.auth as any)?.username}</code>
                          </div>
                        )}
                        {(endpoint.auth as any)?.password && (
                          <div className="auth-param">
                            <span style={{ color: 'var(--primary-color, #3b82f6)', fontWeight: 500 }}>Password:</span>
                            <code style={{
                              marginLeft: '8px',
                              padding: '2px 4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px'
                            }}>••••••••</code>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {(endpoint.auth as any)?.mode === 'bearer' && (
                    <div className="auth-bearer">
                      <div style={{
                        padding: '10px 16px',
                        background: theme === 'light' ? 'var(--table-header-bg)' : 'rgba(0, 0, 0, 0.2)',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderBottom: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Bearer Token Authentication
                      </div>
                      <div style={{
                        padding: '16px',
                        color: theme === 'light' ? 'var(--text-primary)' : 'var(--prose-code-text, var(--code-text, rgb(204, 204, 204)))',
                        backgroundColor: theme === 'light' ? 'var(--background-color)' : 'var(--prose-code-bg, var(--code-bg, #181818))',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        lineHeight: 1.5
                      }}>
                        {(endpoint.auth as any)?.bearer.token && (
                          <div className="auth-param">
                            <span style={{ color: 'var(--primary-color, #3b82f6)', fontWeight: 500 }}>Token:</span>
                            <code style={{
                              marginLeft: '8px',
                              padding: '2px 4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px',
                              wordBreak: 'break-all'
                            }}>{(endpoint.auth as any)?.token || 'token here'}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {(endpoint.auth as any)?.mode === 'oauth2' && (
                    <div className="auth-oauth2">
                      <div style={{
                        padding: '10px 16px',
                        background: theme === 'light' ? 'var(--table-header-bg)' : 'rgba(0, 0, 0, 0.2)',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderBottom: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                          <line x1="6" y1="1" x2="6" y2="4"></line>
                          <line x1="10" y1="1" x2="10" y2="4"></line>
                          <line x1="14" y1="1" x2="14" y2="4"></line>
                        </svg>
                        OAuth 2.0
                      </div>
                      <div style={{
                        padding: '16px',
                        color: theme === 'light' ? 'var(--text-primary)' : 'var(--prose-code-text, var(--code-text, rgb(204, 204, 204)))',
                        backgroundColor: theme === 'light' ? 'var(--background-color)' : 'var(--prose-code-bg, var(--code-bg, #181818))',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        lineHeight: 1.5
                      }}>
                        {(endpoint.auth as any)?.grantType && (
                          <div className="auth-param" style={{ marginBottom: '8px' }}>
                            <span style={{ color: 'var(--primary-color, #3b82f6)', fontWeight: 500 }}>Grant Type:</span>
                            <code style={{
                              marginLeft: '8px',
                              padding: '2px 4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px'
                            }}>{(endpoint.auth as any)?.grantType}</code>
                          </div>
                        )}
                        {(endpoint.auth as any)?.accessTokenUrl && (
                          <div className="auth-param" style={{ marginBottom: '8px' }}>
                            <span style={{ color: 'var(--primary-color, #3b82f6)', fontWeight: 500 }}>Access Token URL:</span>
                            <code style={{
                              marginLeft: '8px',
                              padding: '2px 4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px',
                              wordBreak: 'break-all'
                            }}>{(endpoint.auth as any)?.accessTokenUrl}</code>
                          </div>
                        )}
                        {(endpoint.auth as any)?.clientId && (
                          <div className="auth-param" style={{ marginBottom: '8px' }}>
                            <span style={{ color: 'var(--primary-color, #3b82f6)', fontWeight: 500 }}>Client ID:</span>
                            <code style={{
                              marginLeft: '8px',
                              padding: '2px 4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px'
                            }}>{(endpoint.auth as any)?.clientId}</code>
                          </div>
                        )}
                        {(endpoint.auth as any)?.scope && (
                          <div className="auth-param">
                            <span style={{ color: 'var(--primary-color, #3b82f6)', fontWeight: 500 }}>Scope:</span>
                            <code style={{
                              marginLeft: '8px',
                              padding: '2px 4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px'
                            }}>{(endpoint.auth as any)?.scope}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            
            {endpoint.params && endpoint.params.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Params</h3>
                <div className="table-container" style={{
                  border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: theme === 'light' ? 'var(--background-color)' : 'var(--prose-code-bg, var(--code-bg, #181818))',
                    color: theme === 'light' ? 'var(--text-primary)' : 'var(--prose-code-text, var(--code-text, rgb(204, 204, 204)))'
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          background: theme === 'light' ? 'var(--table-header-bg)' : 'rgba(0, 0, 0, 0.2)',
                          fontSize: '13px',
                          fontWeight: 500
                        }}>Name</th>
                        <th style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          background: theme === 'light' ? 'var(--table-header-bg)' : 'rgba(0, 0, 0, 0.2)',
                          fontSize: '13px',
                          fontWeight: 500
                        }}>Value</th>
                        <th style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          background: theme === 'light' ? 'var(--table-header-bg)' : 'rgba(0, 0, 0, 0.2)',
                          fontSize: '13px',
                          fontWeight: 500
                        }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.params.map((param: any, index: number) => (
                        <tr key={index} className={param.enabled === false ? 'disabled-row' : ''} style={{
                          borderBottom: index < endpoint.params.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                          opacity: param.enabled === false ? 0.6 : 1
                        }}>
                          <td style={{
                            padding: '10px 16px',
                            fontFamily: 'monospace',
                            fontSize: '13px',
                            fontWeight: 500,
                          }}>{param.name}</td>
                          <td style={{
                            padding: '10px 16px',
                            fontFamily: 'monospace',
                            fontSize: '13px'
                          }}>
                            <code style={{
                              padding: '2px 4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px',
                              wordBreak: 'break-all'
                            }}>{param.value}</code>
                          </td>
                          <td style={{
                            padding: '10px 16px'
                          }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 500,
                              backgroundColor: param.enabled !== false ? 'var(--success-bg, #10b981)' : 'var(--error-bg, #ef4444)',
                              color: 'white'
                            }}>
                              {param.enabled !== false ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            
            {endpoint.headers && endpoint.headers.length > 0 && renderHeadersTable(endpoint.headers)}

            
            {endpoint.body && (
              <div>
                <h3 className="text-lg font-semibold">Body</h3>
                <div className="body-content" style={{
                  backgroundColor: theme === 'light' ? 'var(--background-color)' : '#2d2d2d',
                  border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '5px',
                  overflow: 'hidden'
                }}>

                  {typeof endpoint.body === 'object' && 'type' in endpoint.body && 'data' in endpoint.body && (
                    <BodyCard language={(endpoint.body as any).type}>
                      {(endpoint.body as any).type === 'json' ? 
                        JSON.stringify(JSON.parse((endpoint.body as any).data || '{}'), null, 2) : 
                        (endpoint.body as any).data
                      }
                    </BodyCard>
                  )}
                  

                  {Array.isArray(endpoint.body) && endpoint.body.length > 0 && 
                   endpoint.body[0] && 'name' in endpoint.body[0] && 'value' in endpoint.body[0] && 
                   !('type' in endpoint.body[0]) && (
                    <FormUrlEncodedTable formData={endpoint.body as any} />
                  )}
                  

                  {Array.isArray(endpoint.body) && endpoint.body.length > 0 && 
                   endpoint.body[0] && 'type' in endpoint.body[0] && (
                    <MultipartFormTable formData={endpoint.body as any} />
                  )}
                  

                  {Array.isArray(endpoint.body) && endpoint.body.length > 0 && 
                   endpoint.body[0] && 'filePath' in endpoint.body[0] && (
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">Files:</h4>
                      {(endpoint.body as any).map((file: any, index: number) => (
                        <div key={index} className="mb-2">
                          <code>{file.filePath}</code> ({file.contentType})
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className='flex justify-end mt-1 mr-1'>
                    <p className='text-xs font-semibold text-gray-500'>
                      {typeof endpoint.body === 'object' && 'type' in endpoint.body ? 
                        (endpoint.body as any).type : 
                        Array.isArray(endpoint.body) ? 'form-data' : 'body'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            
            {endpoint.vars && Array.isArray(endpoint.vars) && renderVarsTable(endpoint.vars)}

            
            {endpoint.assertions && endpoint.assertions.length > 0 && renderAssertionsTable(endpoint.assertions.map((assertion: any) => ({
              name: assertion.expression || 'assertion',
              value: assertion.value || '',
              enabled: assertion.enabled !== false,
              uid: assertion.expression
            })))}

            
            {endpoint.tests && (
              <CodeBlock
                code={endpoint.tests}
                language="javascript"
                title="Tests"
              />
            )}

            
            {endpoint.script && Object.keys(endpoint.script).length > 0 && renderScripts({
              req: (endpoint.script as any).preRequest || '',
              res: (endpoint.script as any).postResponse || '',
              test: (endpoint.script as any).tests || '',
              hooks: (endpoint.script as any).hooks || ''
            })}
          </div>

          
          <div className="code-samples">
            <h3 className="text-lg font-semibold mb-2">Code Sample</h3>
            <div className=" overflow-visible">
              {renderCodeSamples()}
            </div>
          </div>
        </div>

        <style>{`
          .endpoint-content {
            padding: 1.5rem;
            max-width: 100%;
          }
          
          /* ContentLayout styles */
          .content-layout {
            padding: 1.5rem;
            max-width: 100%;
            overflow-x: hidden;
          }
          
          .content-header {
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
            padding-bottom: 1rem;
          }
          
          .content-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-primary);
          }
          
          .content-badge-container {
            display: flex;
            align-items: center;
            font-size: 1.1rem;
            margin: 0.5rem 0 1rem;
            flex-wrap: wrap;
          }
          
          .content-badge {
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.85rem;
            margin-right: 0.75rem;
            text-transform: uppercase;
          }
          
          .content-subtitle {
            font-family: monospace;
            padding: 0.35rem 0.5rem;
            background: var(--code-bg);
            border-radius: 4px;
            overflow-x: auto;
            word-break: break-all;
            max-width: 100%;
            color: var(--code-text);
          }
          
          .content-description {
            margin-top: 1rem;
            line-height: 1.6;
          }
          
          .content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            margin-top: 1rem;
          }
          
          .content-main,
          .content-side {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            overflow-x: hidden;
          }
          
          .content-side {
            width: 350px;
            min-width: 350px;
            max-width: 350px;
          }
          
          @media (max-width: 1100px) {
            .content-grid {
              grid-template-columns: 1fr;
            }
            
            .content-side {
              width: 100%;
              min-width: 100%;
              max-width: 100%;
            }
          }
          
          /* Method badge colors */
          .content-badge.get {
            background-color: var(--method-get-bg);
            color: white;
          }
          
          .content-badge.post {
            background-color: var(--method-post-bg);
            color: white;
          }
          
          .content-badge.put {
            background-color: var(--method-put-bg);
            color: white;
          }
          
          .content-badge.delete {
            background-color: var(--method-delete-bg);
            color: white;
          }
          
          .content-badge.patch {
            background-color: var(--method-patch-bg);
            color: white;
          }
          
          .content-badge.options, 
          .content-badge.head {
            background-color: var(--method-options-bg);
            color: white;
          }
          
          .content-badge.folder {
            background-color: var(--folder-bg, #6b7280);
            color: white;
          }
          
          .content-badge.overview {
            background-color: var(--overview-bg, #3b82f6);
            color: white;
          }
          
          .content-badge.custom {
            background-color: var(--custom-bg, #8b5cf6);
            color: white;
          }
          
          /* Original styles */
          .endpoint-header {
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
            padding-bottom: 1rem;
          }
          
          .endpoint-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-primary);
          }
          
          .endpoint-method-url {
            display: flex;
            align-items: center;
            font-size: 1.1rem;
            flex-wrap: wrap;
          }
          
          .method-badge {
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.85rem;
            margin-right: 0.75rem;
            text-transform: uppercase;
          }
          
          .method-badge.get {
            background-color: var(--method-get-bg);
            color: white;
          }
          
          .method-badge.post {
            background-color: var(--method-post-bg);
            color: white;
          }
          
          .method-badge.put {
            background-color: var(--method-put-bg);
            color: white;
          }
          
          .method-badge.delete {
            background-color: var(--method-delete-bg);
            color: white;
          }
          
          .method-badge.patch {
            background-color: var(--method-patch-bg);
            color: white;
          }
          
          .method-badge.options, 
          .method-badge.head {
            background-color: var(--method-options-bg);
            color: white;
          }
          
          .endpoint-url {
            font-family: monospace;
            background: var(--code-bg);
            border-radius: 4px;
            overflow-x: auto;
            word-break: break-all;
            max-width: 100%;
            color: var(--code-text);
          }
          
          .endpoint-description {
            margin-top: 1rem;
            line-height: 1.6;
          }
          
          .endpoint-grid {
            display: grid;
            grid-template-columns: 1fr 37%;
            gap: 1.5rem;
            margin-top: 1rem;
            width: 100%;
            max-width: 100%;
          }
          
          .endpoint-details {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          }
          
          .code-samples {
            width: 100%;
            min-width: 30%;
          }
          
          .code-samples-frame {
            width: 100%;
            min-width: 30%;
            height: fit-content;
          }
          
          .code-samples-container {
            width: 100%;
            overflow-x: auto;
          }
          
          .code-block {
            overflow: hidden;
            transition: all 0.2s ease;
          }
          
          .code-tab {
            transition: all 0.2s ease;
          }
          
          .code-tab:hover {
            opacity: 0.9;
          }
          
          @media (max-width: 1100px) {
            .endpoint-grid {
              grid-template-columns: 1fr;
            }
            
            .code-samples-container {
              position: static;
            }
          }
          
          .param-name, .param-value {
            font-family: monospace;
            word-break: break-all;
          }
          
          .param-name {
            font-weight: 600;
          }
          
          /* Dark theme adjustments */
          .dark {
            --heading-color: var(--text-dark);
            --border-color: var(--border-dark);
            --card-bg: var(--background-dark);
            --code-bg: var(--code-bg);
            --table-header-bg: var(--table-header-bg-dark);
            --badge-bg: var(--badge-bg-dark);
            --badge-color: var(--badge-text-dark);
          }
        `}</style>
      </div>
    );
  }
});

export default ItemComponent; 