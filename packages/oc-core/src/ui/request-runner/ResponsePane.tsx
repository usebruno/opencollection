import React, { useState } from 'react';
import CodeEditor from '../CodeEditor';

interface ResponsePaneProps {
  response: any;
  isLoading: boolean;
}

const ResponsePane: React.FC<ResponsePaneProps> = ({ response, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

  const tabs = [
    { id: 'body', label: 'Body' },
    { id: 'headers', label: 'Headers' }
  ] as const;

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const getStatusColor = (status?: number) => {
    if (!status) return '#6b7280';
    if (status >= 200 && status < 300) return '#10b981';
    if (status >= 300 && status < 400) return '#f59e0b';
    if (status >= 400 && status < 500) return '#ef4444';
    if (status >= 500) return '#dc2626';
    return '#6b7280';
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span style={{ color: 'var(--text-secondary)' }}>Sending request...</span>
          </div>
        </div>
      );
    }

    if (!response) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50">
              <svg fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Click Send to make a request</p>
          </div>
        </div>
      );
    }

    if (response.error) {
      return (
        <div className="p-4">
          <div className="p-4 rounded border-l-4 border-red-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h3 className="text-lg font-medium text-red-600 mb-2">Request Failed</h3>
            <p style={{ color: 'var(--text-primary)' }}>{response.error}</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'body':
        const responseText = typeof response.data === 'string' ? response.data : formatJson(response.data);
        const contentType = response.headers?.['content-type'] || response.headers?.['Content-Type'] || '';
        let language = 'text';
        
        if (contentType.includes('application/json') || contentType.includes('text/json')) {
          language = 'json';
        } else if (contentType.includes('text/html')) {
          language = 'html';
        } else if (contentType.includes('text/xml') || contentType.includes('application/xml')) {
          language = 'xml';
        } else if (contentType.includes('text/css')) {
          language = 'css';
        } else if (contentType.includes('text/javascript') || contentType.includes('application/javascript')) {
          language = 'javascript';
        }
        
        return (
          <div className="p-4 h-full">
            <div className="h-full">
              <CodeEditor
                value={responseText}
                onChange={() => {}} // Read-only
                language={language}
                height="100%"
                readOnly={true}
              />
            </div>
          </div>
        );

      case 'headers':
        return (
          <div className="p-4">
            <div className="space-y-2">
              {response.headers ? (
                Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2 p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <span className="font-mono text-sm font-medium" style={{ color: 'var(--text-primary)', minWidth: '150px' }}>
                      {key}:
                    </span>
                    <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {String(value)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  No response headers
                </div>
              )}
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                  backgroundColor: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {response && !response.error && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span 
                className="px-2 py-1 text-xs font-medium rounded"
                style={{
                  backgroundColor: getStatusColor(response.status),
                  color: 'white'
                }}
              >
                {response.status} {response.statusText}
              </span>
            </div>
            
            {response.duration && (
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Time:</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
                  {response.duration}ms
                </span>
              </div>
            )}
            
            {response.size && (
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Size:</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
                  {(response.size / 1024).toFixed(2)} KB
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ResponsePane; 