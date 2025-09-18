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

  return (
    <div 
      className="flex items-center gap-2 px-4 py-3 border-b"
      style={{ 
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <select
        value={method}
        onChange={(e) => handleMethodChange(e.target.value)}
        className="px-3 py-2 text-sm font-medium rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          minWidth: '100px'
        }}
      >
        {methods.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div className="flex-1 relative">
        <input
          type="text"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Enter request URL"
          className="w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      <button
        onClick={onSendRequest}
        disabled={isLoading || !url.trim()}
        className="px-6 py-2 text-sm font-medium text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-opacity"
        style={{
          backgroundColor: '#3b82f6'
        }}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default QueryBar; 