import React from 'react';
import { HttpRequest, OpenCollectionCollection } from '../../types';

interface RequestHeaderProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment: string;
  onEnvironmentChange: (environment: string) => void;
  toggleRunnerMode?: () => void;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ 
  item, 
  collection, 
  selectedEnvironment, 
  onEnvironmentChange,
  toggleRunnerMode 
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
        {toggleRunnerMode && (
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={true}
                onChange={toggleRunnerMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span 
                className="ms-3 text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Playground
              </span>
            </label>
          </div>
        )}
        
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