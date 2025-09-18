import React from 'react';
import { HttpRequest, OpenCollectionCollection } from '../../types';

interface RequestHeaderProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment: string;
  onEnvironmentChange: (environment: string) => void;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ 
  item, 
  collection, 
  selectedEnvironment, 
  onEnvironmentChange 
}) => {
  return (
    <div 
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ 
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-secondary)'
      }}
    >
      <div className="flex items-center gap-3">
        <h2 
          className="text-lg font-semibold truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {item.name || 'Untitled Request'}
        </h2>
        
        <span 
          className="px-2 py-1 text-xs font-medium rounded"
          style={{
            backgroundColor: item.method === 'GET' ? '#10b981' : 
                           item.method === 'POST' ? '#f59e0b' :
                           item.method === 'PUT' ? '#3b82f6' :
                           item.method === 'DELETE' ? '#ef4444' :
                           '#6b7280',
            color: 'white'
          }}
        >
          {item.method || 'GET'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {collection.environments && collection.environments.length > 0 && (
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Environment:
            </span>
            <select
              value={selectedEnvironment}
              onChange={(e) => onEnvironmentChange(e.target.value)}
              className="px-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="">No Environment</option>
              {collection.environments.map((env) => (
                <option key={env.name} value={env.name}>
                  {env.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHeader; 