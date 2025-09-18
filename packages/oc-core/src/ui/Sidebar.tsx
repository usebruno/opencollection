import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { OpenCollectionCollection, OpenCollectionItem, HttpRequest, CustomPage, Folder } from '../types';
import { getItemId, generateSafeId } from '../utils/itemUtils';

interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  description?: string;
}

interface ApiCollection {
  name: string;
  description?: string;
  version?: string;
  endpoints: ApiEndpoint[];
}

export interface SidebarProps {
  collection: OpenCollectionCollection | ApiCollection | null;
  activeItemId: string | null;
  onSelectItem: (id: string, parentPath?: string) => void;
  logo?: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  customPages?: CustomPage[];
  onlyShow?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({
  collection,
  activeItemId,
  onSelectItem,
  logo,
  className = '',
  theme = 'light',
  customPages = [],
  onlyShow = []
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const shouldShowItem = useCallback((itemId: string): boolean => {
    if (!onlyShow.length) {
      return true;
    }
    return onlyShow.includes(itemId);
  }, [onlyShow]);

  useEffect(() => {
    if (!collection) return;
    
    const initExpandedFolders: Record<string, boolean> = {};
    
    if ('items' in collection) {
      const items = collection.items || [];
      items.forEach((item) => {
        if (item.type === 'folder') {
          const itemId = getItemId(item);
          initExpandedFolders[itemId] = true;
        }
      });
    }
    
    setExpandedFolders(initExpandedFolders);
  }, [collection]);

  const toggleFolder = useCallback((folderPath: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  }, []);

  const handleMouseEnter = useCallback((itemId: string) => {
    setHoveredItemId(itemId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItemId(null);
  }, []);

  const handleItemSelect = (id: string, parentPath: string = '') => {
    console.log('handleItemSelect', id, 'parentPath:', parentPath);
    onSelectItem(id, parentPath);
  };

  const normalizedItems = useMemo(() => {
    if (!collection) return [];
    
    if ('endpoints' in collection) {
      return collection.endpoints.map((endpoint: ApiEndpoint, index: number) => ({
        type: 'http' as const,
        name: endpoint.path,
        method: endpoint.method,
        url: endpoint.path
      }));
    } else if ('items' in collection) {
      return collection.items;
    }
    
    return [];
  }, [collection]);

  const filteredItems = useMemo(() => {
    let items = normalizedItems;
    
    if (onlyShow.length && collection !== null && 'items' in collection) {
      const filterItemsByOnlyShow = (items: OpenCollectionItem[]): OpenCollectionItem[] => {
        return items.filter(item => {
          const itemName = item.type === 'http' ? (item as HttpRequest).name || item.type : item.type;
          if (shouldShowItem(itemName)) {
            return true;
          }
          
          
          return false;
        });
      };
      
      items = filterItemsByOnlyShow(items as OpenCollectionItem[]);
    }
    
    return items;
  }, [normalizedItems, onlyShow, collection, shouldShowItem]);

  const filteredEndpoints = useMemo(() => {
    if (!collection || !('endpoints' in collection) || !collection.endpoints) {
      return [];
    }
    
    let endpoints = collection.endpoints;
    if (onlyShow.length) {
      endpoints = endpoints.filter((endpoint: ApiEndpoint) => 
        shouldShowItem(endpoint.id) || shouldShowItem(endpoint.path)
      );
    }
    
    return endpoints;
  }, [collection, onlyShow, shouldShowItem]);

  const filteredCustomPages = useMemo(() => {
    let pages = customPages;
    if (onlyShow.length) {
      pages = pages.filter(page => shouldShowItem(page.name));
    }
    
    return pages
  }, [customPages, onlyShow, shouldShowItem]);

  const renderFolderIcon = (isExpanded: boolean) => (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="transform transition-transform duration-200"
      style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <path 
        d="M9 6L15 12L9 18" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const renderItem = (item: OpenCollectionItem, level = 0, parentPath = '') => {
    const itemId = getItemId(item);
    const itemName = itemId;
    const itemPath = parentPath ? `${parentPath}/${itemName}` : itemName;
    
    const fullPathId = parentPath ? `${parentPath.replace(/^\//, '')}/${itemId}` : itemId;
    
    const isFolder = item.type === 'folder';
    const safeItemId = generateSafeId(itemId);
    const isActive = !isFolder && (activeItemId === safeItemId || activeItemId === itemId);
    
    // Use fullPathId for hover state tracking
    const isHovered = hoveredItemId === fullPathId;
    const isExpanded = expandedFolders[itemId] || false;
    
    // Don't render if this item should be filtered out
    if (!shouldShowItem(itemId)) {
      return null;
    }

    return (
      <div key={itemId} className="relative">
        <div 
          className={`
            sidebar-item flex items-center select-none text-sm cursor-pointer py-1.5 px-2 rounded-md
            ${isActive ? 'active' : ''}
            ${isHovered && !isActive ? 'hovered' : ''}
            transition-colors duration-150
          `}
          style={{ 
            paddingLeft: `${level * 16 + 8}px`,
            color: isActive ? 'var(--primary-color)' : 'var(--text-primary)'
          }}
          onClick={() => isFolder ? toggleFolder(itemId) : handleItemSelect(safeItemId, itemPath)}
          onMouseEnter={() => setHoveredItemId(fullPathId)}
          onMouseLeave={() => setHoveredItemId(null)}
          id={`sidebar-item-${fullPathId}`}
          data-item-id={fullPathId}
        >
          
          {level > 0 && (
            <div 
              className="absolute inset-y-0" 
              style={{ 
                left: `${(level - 1) * 16 + 14}px`, 
                width: '1px', 
                backgroundColor: 'var(--border-color)'
              }}
            />
          )}
          
          
          {isFolder ? (
            <div className="mr-2 flex-shrink-0">
              {renderFolderIcon(isExpanded)}
            </div>
          ) : (
            <div 
              className={`method-badge text-xs py-0.5 px-1.5 mr-2 rounded flex-shrink-0 ${item.type === "http" ? (item as HttpRequest).method?.toLowerCase() || 'get' : 'get'}`}
            >
              {item.type === "http" ? (item as HttpRequest).method || 'GET' : 'GET'}
            </div>
          )}
          
          
          <div className="truncate flex-1">
            {itemName}
          </div>
          
          
          {isFolder && (item as Folder).items && (item as Folder).items!.length > 0 && (
            <div className="ml-2 text-xs opacity-70 px-1.5">
              {(item as Folder).items!.length}
            </div>
          )}
        </div>
        
        
        {isFolder && isExpanded && (item as Folder).items && (
          <div className="relative">
            
            <div 
              className="absolute top-0 bottom-0 left-0" 
              style={{ 
                left: `${level * 16 + 14}px`, 
                width: '1px', 
                backgroundColor: 'var(--border-color)'
              }}
            />
            
            
            {((item as Folder).items || []).map((child: OpenCollectionItem) => renderItem(child, level + 1, itemPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar h-full flex flex-col ${className}`}>
      {logo && (
        <div className="logo p-4">
          {logo}
        </div>
      )}
      
      <div className="sidebar-items overflow-y-auto flex-grow mt-3">
  
        {collection && (!onlyShow.length || shouldShowItem('overview')) && (
          <div className="relative">
            <div 
              className={`
                sidebar-item flex items-center select-none text-sm cursor-pointer py-1.5 px-2 rounded-md
                ${activeItemId === 'overview' ? 'active' : ''}
                ${hoveredItemId === 'overview' && activeItemId !== 'overview' ? 'hovered' : ''}
                transition-colors duration-150
              `}
              style={{ 
                paddingLeft: '8px',
                color: activeItemId === 'overview' ? 'var(--primary-color)' : 'var(--text-primary)'
              }}
              onClick={() => handleItemSelect('overview', '')}
              onMouseEnter={() => setHoveredItemId('overview')}
              onMouseLeave={() => setHoveredItemId(null)}
              id="sidebar-item-overview"
              data-testid="overview"
            >
              <div className="mr-2 flex-shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 10h8M8 14h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="truncate flex-1">Overview</div>
            </div>
          </div>
        )}
        
  
        {filteredCustomPages.length > 0 && (
          <div className="mt-1">
            {filteredCustomPages.map((page) => {
              const pageId = page.name;
              const safePageId = generateSafeId(pageId);
              const isActive = activeItemId === safePageId;
              const isHovered = hoveredItemId === pageId;
              
              return (
                <div key={pageId} className="relative">
                  <div 
                    className={`
                      sidebar-item flex items-center select-none text-sm cursor-pointer py-1.5 px-2 rounded-md
                      ${isActive ? 'active' : ''}
                      ${isHovered && !isActive ? 'hovered' : ''}
                      transition-colors duration-150
                    `}
                    style={{ 
                      paddingLeft: '8px',
                      color: isActive ? 'var(--primary-color)' : 'var(--text-primary)'
                    }}
                    onClick={() => handleItemSelect(safePageId, '')}
                    onMouseEnter={() => setHoveredItemId(pageId)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    id={`sidebar-item-${pageId}`}
                    data-testid={`custom-page-${pageId}`}
                  >
                    <div className="mr-2 flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="truncate flex-1">{page.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
  
        {collection && 'items' in collection && filteredItems && filteredItems.length > 0 && (
          <>
            {filteredItems.map((item: OpenCollectionItem) => renderItem(item))}
          </>
        )}
        
        {collection && 'endpoints' in collection && filteredEndpoints.length > 0 && (
          <>
            {filteredEndpoints.map((endpoint: ApiEndpoint) => {
              const endpointId = endpoint.id || `endpoint-${endpoint.path}`;
              const safeEndpointId = generateSafeId(endpointId);
              const fullPathId = endpoint.path ? `${endpoint.path.replace(/^\//, '')}/${endpointId}` : endpointId;
              const isActive = activeItemId === safeEndpointId;
              const isHovered = hoveredItemId === fullPathId;
              
              return (
                <button 
                  key={endpointId}
                  className={`sidebar-item endpoint flex items-center w-full text-left px-3 py-2 ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                  onClick={() => handleItemSelect(safeEndpointId, endpoint.path)}
                  onMouseEnter={() => setHoveredItemId(fullPathId)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  id={`sidebar-item-${fullPathId}`}
                  data-item-id={fullPathId}
                >
                  <span className={`method-badge flex-shrink-0 text-xs font-medium py-1 px-2 rounded mr-2 ${endpoint.method.toLowerCase()}`}>
                    {endpoint.method}
                  </span>
                  <span className="truncate">{endpoint.path}</span>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 