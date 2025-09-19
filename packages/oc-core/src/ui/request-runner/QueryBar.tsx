import React, { useState, useEffect } from 'react';
import { HttpRequest } from '../../types';

interface QueryBarProps {
  item: HttpRequest;
  onSendRequest: () => void;
  isLoading: boolean;
  onItemChange: (item: HttpRequest) => void;
}

const QueryBar: React.FC<QueryBarProps> = ({ item, onSendRequest, isLoading, onItemChange }) => {
  const [url, setUrl] = useState(item.url || '');
  const [method, setMethod] = useState(item.method || 'GET');

  useEffect(() => {
    setUrl(item.url || '');
    setMethod(item.method || 'GET');
  }, [item]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    onItemChange({ ...item, url: newUrl });
  };

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod);
    onItemChange({ ...item, method: newMethod });
  };

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  const getMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      'GET': '#10b981',
      'POST': '#f59e0b',
      'PUT': '#3b82f6',
      'PATCH': '#8b5cf6',
      'DELETE': '#ef4444',
      'HEAD': '#6b7280',
      'OPTIONS': '#6b7280'
    };
    return colors[method] || '#6b7280';
  };

  return (
    <div 
      className="flex items-stretch border-b border-l"
      style={{ 
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        height: '36px'
      }}
    >
      <div className="relative">
        <select
          value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
          className="h-full px-3 pr-7 text-xs font-semibold border-r focus:outline-none appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'var(--border-color)',
            color: getMethodColor(method),
            minWidth: '80px',
            borderRadius: 0
          }}
        >
          {methods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-tertiary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Enter request URL"
        className="flex-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          borderRadius: 0
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && url.trim() && !isLoading) {
            onSendRequest();
          }
        }}
      />

      <button
        onClick={onSendRequest}
        disabled={isLoading || !url.trim()}
        className="px-4 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
        style={{
          backgroundColor: 'var(--primary-color)',
          borderRadius: 0
        }}
      >
        {isLoading && (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isLoading ? 'Sending' : 'Send'}
      </button>
    </div>
  );
};

export default QueryBar;