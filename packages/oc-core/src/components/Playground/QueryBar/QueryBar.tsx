import React, { useState, useEffect } from 'react';
import { HttpRequest } from '../../../types';
import { StyledWrapper } from './StyledWrapper';

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
    <StyledWrapper 
      className="flex items-stretch"
      style={{ 
        height: '36px'
      }}
    >
      <div className="relative">
        <select
          value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
          className="h-full px-3 text-xs font-semibold cursor-pointer"
        >
          {methods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Enter request URL"
        className="flex-1 px-3 text-sm"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && url.trim() && !isLoading) {
            onSendRequest();
          }
        }}
      />

      <button
        onClick={onSendRequest}
        disabled={isLoading || !url.trim()}
        className="send px-4 text-xs font-medium text-white disabled:cursor-not-allowed flex items-center gap-2 transition-all"
      >
        {isLoading && (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isLoading ? 'Sending' : 'Send'}
      </button>
    </StyledWrapper>
  );
};

export default QueryBar;