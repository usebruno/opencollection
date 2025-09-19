import React, { useState, useEffect } from 'react';
import { HttpRequest, OpenCollectionCollection } from '../../types';
import { createRequestRunner } from '../../runner';
import RequestHeader from './RequestHeader';
import QueryBar from './QueryBar';
import RequestPane from './RequestPane';
import ResponsePane from './ResponsePane';

interface RequestRunnerProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  proxyUrl?: string;
}

const RequestRunner: React.FC<RequestRunnerProps> = ({ item, collection, proxyUrl }) => {
  const [editableItem, setEditableItem] = useState<HttpRequest>(item);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestPaneWidth, setRequestPaneWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setEditableItem(item);
    setResponse(null);
  }, [item]);

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      const environment = collection.environments?.find(env => env.name === selectedEnvironment);
      const runner = createRequestRunner(proxyUrl);
      
      const result = await runner.runRequest({
        item: editableItem,
        collection,
        environment,
        runtimeVariables: {}
      });
      setResponse(result);
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const container = document.querySelector('.request-runner-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    
    if (newWidth >= 20 && newWidth <= 80) {
      setRequestPaneWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="request-runner-container h-full flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <RequestHeader 
        item={editableItem} 
        collection={collection}
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
      />
      
      <QueryBar 
        item={editableItem}
        onSendRequest={handleSendRequest}
        isLoading={isLoading}
        onItemChange={setEditableItem}
      />
      
      <div className="flex flex-1 overflow-hidden pt-4">
        <div 
          className="flex-shrink-0 overflow-hidden"
          style={{ 
            width: `${requestPaneWidth}%`,
            borderColor: 'var(--border-color)'
          }}
        >
          <RequestPane item={editableItem} onItemChange={setEditableItem} />
        </div>
        
        <div 
          className="cursor-col-resize flex-shrink-0 relative hover:bg-opacity-10"
          style={{ 
            width: '1px',
            backgroundColor: 'var(--border-color)',
            margin: '0 16px',
            transition: 'background-color 0.2s'
          }}
          onMouseDown={handleMouseDown}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--border-color)';
          }}
        >
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ResponsePane response={response} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default RequestRunner; 