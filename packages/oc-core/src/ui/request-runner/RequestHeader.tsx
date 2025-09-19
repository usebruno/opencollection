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
      className="flex items-center justify-between pb-4"
      style={{ 
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        minHeight: '48px'
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <h2 
          className="text-base font-medium truncate"
          style={{
            color: 'var(--text-primary)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--tw-leading,var(--text-2xl--line-height))'
          }}
          title={item.name || 'Untitled Request'}
        >
          {item.name || 'Untitled Request'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {collection.environments && collection.environments.length > 0 && (
          <select
            value={selectedEnvironment}
            onChange={(e) => onEnvironmentChange(e.target.value)}
            className="px-2 py-1 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              minWidth: '120px'
            }}
          >
            <option value="">No Environment</option>
            {collection.environments.map((env) => (
              <option key={env.name} value={env.name}>
                {env.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default RequestHeader; 