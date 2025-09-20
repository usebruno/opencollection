import React, { memo, useCallback, useState } from 'react';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-python';
import { OpenCollectionItem, HttpRequest, Script, Folder } from '../types';
import { generateSectionId, getItemId, generateSafeId, sortItemsWithFoldersFirst } from '../utils/itemUtils';
import {
  MinimalDataTable,
  CompactCodeView,
  StatusBadge,
  TabGroup
} from './MinimalComponents';

const methodColors: Record<string, string> = {
  'GET': '#16a34a',
  'POST': '#2563eb',
  'PUT': '#f97316',
  'PATCH': '#8b5cf6',
  'DELETE': '#dc2626',
  'HEAD': '#6b7280',
  'OPTIONS': '#6b7280'
};

const ItemComponent = memo(({
  item,
  registerSectionRef,
  theme,
  md,
  parentPath = '',
  toggleRunnerMode
}: {
  item: OpenCollectionItem;
  registerSectionRef: (id: string, ref: HTMLDivElement | null) => void;
  theme: 'light' | 'dark' | 'auto';
  md: any;
  parentPath?: string;
  toggleRunnerMode?: () => void;
}) => {
  const itemId = getItemId(item);
  const sectionId = generateSectionId(item, parentPath);

  const sectionRefCallback = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      registerSectionRef(sectionId, element);
    }
  }, [sectionId, registerSectionRef]);

  if (item.type === 'folder') {
    const folderItem = item as Folder;

    return (
      <div key={itemId} id={`section-${sectionId}`} ref={sectionRefCallback} className="item-container">
        <div className="item-header-minimal">
          <div className="item-title-section">
            <div className="item-type-badge folder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Folder</span>
            </div>
            <h1 className="item-title">{folderItem.name || 'Untitled Folder'}</h1>
          </div>
        </div>

        {folderItem.docs && (
          <div className="item-docs">
            <div dangerouslySetInnerHTML={{ __html: md.render(folderItem.docs) }} />
          </div>
        )}

        <div className="item-content-grid">
          {folderItem.headers && folderItem.headers.length > 0 && (
            <MinimalDataTable
              data={folderItem.headers}
              title="Headers"
              columns={[
                { key: 'name', label: 'Name', width: '30%' },
                { key: 'value', label: 'Value', width: '50%' },
                { key: 'enabled', label: '', width: '20%', render: (val: any) => <StatusBadge status={val !== false ? 'active' : 'inactive'} /> }
              ]}
            />
          )}

          {folderItem.variables && folderItem.variables.length > 0 && (
            <MinimalDataTable
              data={folderItem.variables.map(v => ({
                name: v.name,
                value: v.value || v.default || '',
                enabled: !v.disabled
              }))}
              title="Variables"
              columns={[
                { key: 'name', label: 'Name', width: '40%' },
                { key: 'value', label: 'Value', width: '40%' },
                { key: 'enabled', label: '', width: '20%', render: (val) => <StatusBadge status={val ? 'active' : 'inactive'} /> }
              ]}
            />
          )}

          {folderItem.scripts && (folderItem.scripts.preRequest || folderItem.scripts.postResponse) && (
            <CompactCodeView
              title="Scripts"
              tabs={[
                { id: 'pre', label: 'Pre-request', content: folderItem.scripts.preRequest || '' },
                { id: 'post', label: 'Post-response', content: folderItem.scripts.postResponse || '' }
              ]}
              language="javascript"
            />
          )}

          {folderItem.items && folderItem.items.length > 0 && (
            <div className="folder-items-section">
              <h3 className="section-title">Contents</h3>
              <div className="folder-items-grid">
                {sortItemsWithFoldersFirst(folderItem.items).map((nestedItem, index) => {
                  const nestedItemId = getItemId(nestedItem);
                  const safeId = generateSafeId(nestedItemId);

                  return (
                    <div
                      key={`${nestedItemId}-${index}`}
                      className="folder-item-card"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const url = new URL(window.location.href);
                          url.searchParams.set('page', safeId);
                          window.history.pushState({}, '', url.toString());
                          window.location.reload();
                        }
                      }}
                    >
                      {nestedItem.type === 'http' && (
                        <div className="item-method-badge" style={{ backgroundColor: methodColors[(nestedItem as any).method?.toUpperCase() || 'GET'] }}>
                          {(nestedItem as any).method || 'GET'}
                        </div>
                      )}
                      {nestedItem.type === 'folder' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                      )}
                      <div className="item-card-content">
                        <h4>{nestedItem.name || nestedItemId}</h4>
                        {nestedItem.type === 'http' && (nestedItem as any).url && (
                          <p className="item-card-url">{(nestedItem as any).url}</p>
                        )}
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="item-card-arrow">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  else if (item.type === 'script') {
    const scriptItem = item as Script;

    return (
      <div key={itemId} id={`section-${sectionId}`} ref={sectionRefCallback} className="item-container">
        <div className="item-header-minimal">
          <div className="item-title-section">
            <div className="item-type-badge script">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              <span>Script</span>
            </div>
            <h1 className="item-title">{scriptItem.name || 'Untitled Script'}</h1>
          </div>
        </div>

        {scriptItem.script && (
          <CompactCodeView
            code={scriptItem.script}
            language="javascript"
          />
        )}
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

    const generateCurlCommand = () => {
      const headers = endpoint.headers?.filter((h: any) => h.enabled !== false)
        .map((h: any) => `-H "${h.name}: ${h.value}"`).join(" \\\n  ") || '';
      
      let bodyData = '';
      if (endpoint.body && typeof endpoint.body === 'object' && 'data' in endpoint.body) {
        const rawBody = endpoint.body as any;
        if (rawBody.type === 'json' && rawBody.data) {
          bodyData = ` \\\n  -d '${rawBody.data}'`;
        }
      }

      return `curl -X ${endpoint.method} "${endpoint.url}"${headers ? ` \\\n  ${headers}` : ''}${bodyData}`;
    };


    return (
      <div className={`item-container ${theme}`} id={`section-${sectionId}`} ref={sectionRefCallback}>
        <div className="item-header-minimal">
          <div className="item-title-section">
            <h1 className="item-title">{endpoint.name}</h1>
            <div className="endpoint-badges">
              <span className="badge-method" style={{ backgroundColor: methodColors[endpoint.method?.toUpperCase()] }}>
                {endpoint.method}
              </span>
              <span className="badge-url">{endpoint.url}</span>
              <button 
                className="badge-try"
                onClick={() => {
                  if (toggleRunnerMode && item.type === 'http') {
                    toggleRunnerMode();
                  }
                }}
                disabled={!toggleRunnerMode || item.type !== 'http'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Try
              </button>
            </div>
          </div>
        </div>

        {endpoint.description && (
          <div className="item-docs">
            <div dangerouslySetInnerHTML={{ __html: md.render(endpoint.description) }} />
          </div>
        )}

        <div className="item-content-main">
          <div className="request-details">
            {endpoint.params && endpoint.params.length > 0 && (
              <MinimalDataTable
                data={endpoint.params}
                title="Query Parameters"
                columns={[
                  { key: 'name', label: 'Name', width: '35%' },
                  { key: 'value', label: 'Value', width: '45%' },
                  { key: 'enabled', label: '', width: '20%', render: (val: any) => <StatusBadge status={val !== false ? 'active' : 'inactive'} /> }
                ]}
              />
            )}

            {endpoint.headers && endpoint.headers.length > 0 && (
              <MinimalDataTable
                data={endpoint.headers}
                title="Headers"
                columns={[
                  { key: 'name', label: 'Name', width: '35%' },
                  { key: 'value', label: 'Value', width: '45%' },
                  { key: 'enabled', label: '', width: '20%', render: (val: any) => <StatusBadge status={val !== false ? 'active' : 'inactive'} /> }
                ]}
              />
            )}

            {endpoint.body && typeof endpoint.body === 'object' && 'data' in endpoint.body && (
              <div className="request-body-section">
                <h3 className="section-title">Body</h3>
                <CompactCodeView
                  code={(endpoint.body as any).data || ''}
                  language={(endpoint.body as any).type || 'json'}
                />
              </div>
            )}

            {endpoint.script && (endpoint.script.preRequest || endpoint.script.postResponse) && (
              <CompactCodeView
                title="Scripts"
                tabs={[
                  { id: 'pre', label: 'Pre-request', content: endpoint.script.preRequest || '' },
                  { id: 'post', label: 'Post-response', content: endpoint.script.postResponse || '' }
                ]}
                language="javascript"
              />
            )}
          </div>

          <div className="code-example-section">
            <div className="code-example-header">
              <h3 className="section-title">Example Request</h3>
              <TabGroup
                tabs={[
                  { id: 'curl', label: 'cURL' },
                  { id: 'javascript', label: 'JavaScript' },
                  { id: 'python', label: 'Python' }
                ]}
                defaultTab="curl"
                renderContent={(activeTab: string) => {
                  if (activeTab === 'curl') {
                    return <CompactCodeView code={generateCurlCommand()} language="bash" />;
                  } else if (activeTab === 'javascript') {
                    const jsCode = `const response = await fetch("${endpoint.url}", {
  method: "${endpoint.method}",
  headers: {
${endpoint.headers?.filter((h: any) => h.enabled !== false).map((h: any) => `    "${h.name}": "${h.value}"`).join(',\n')}
  }${endpoint.body && typeof endpoint.body === 'object' && 'data' in endpoint.body ? `,
  body: JSON.stringify(${(endpoint.body as any).data || '{}'})` : ''}
});

const data = await response.json();`;
                    return <CompactCodeView code={jsCode} language="javascript" />;
                  } else {
                    const pyCode = `import requests

response = requests.${endpoint.method.toLowerCase()}(
    "${endpoint.url}",
    headers={
${endpoint.headers?.filter((h: any) => h.enabled !== false).map((h: any) => `        "${h.name}": "${h.value}"`).join(',\n')}
    }${endpoint.body && typeof endpoint.body === 'object' && 'data' in endpoint.body ? `,
    json=${(endpoint.body as any).data || '{}'}` : ''}
)

data = response.json()`;
                    return <CompactCodeView code={pyCode} language="python" />;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={itemId} id={`section-${sectionId}`} ref={sectionRefCallback} className="item-container">
      <div className="item-header-minimal">
        <h1 className="item-title">{(item as any).name || 'Untitled Item'}</h1>
        <p className="item-subtitle">Unsupported item type: {(item as any).type}</p>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.item.type !== nextProps.item.type) {
    return false;
  }

  const prevItemId = getItemId(prevProps.item);
  const nextItemId = getItemId(nextProps.item);
  if (prevItemId !== nextItemId) {
    return false;
  }

  return (
    prevProps.theme === nextProps.theme &&
    prevProps.parentPath === nextProps.parentPath
  );
});

export default ItemComponent;