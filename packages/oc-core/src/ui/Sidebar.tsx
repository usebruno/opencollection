import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { OpenCollectionCollection, OpenCollectionItem, HttpRequest, CustomPage, Folder } from '../types';
import Method from '../components/Method/Method';
import { getItemId, generateSafeId, sortItemsWithFoldersFirst } from '../utils/itemUtils';

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
  isCompact?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  collection,
  activeItemId,
  onSelectItem,
  logo,
  className = '',
  theme = 'light',
  customPages = [],
  onlyShow = [],
  isCompact = false
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
          initExpandedFolders[itemId] = false;
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
    
    // Sort items with folders first
    return sortItemsWithFoldersFirst(items as OpenCollectionItem[]);
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
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="transform transition-transform duration-300"
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
            sidebar-item flex items-center select-none text-sm cursor-pointer
            ${isActive ? 'active' : ''}
            ${isHovered && !isActive ? 'hovered' : ''}
            transition-all duration-200
          `}
          style={{ 
            paddingLeft: `${level * 16 + 8}px`
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
            <Method 
              method={item.type === "http" ? (item as HttpRequest).method || 'GET' : 'GET'}
              className="text-xs"
            />
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
            
            
            {sortItemsWithFoldersFirst((item as Folder).items || []).map((child: OpenCollectionItem) => renderItem(child, level + 1, itemPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar h-full flex flex-col ${isCompact ? 'compact' : ''} ${className}`} style={{ width: isCompact ? 'var(--sidebar-width-compact)' : 'var(--sidebar-width)' }}>
      {/* Collection name at top */}
      <div className="p-4 pt-0 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center">
          <h1 className="font-semibold truncate flex-1" style={{ color: 'var(--text-primary)' }}>
            {collection?.name || 'API Collection'}
          </h1>
        </div>
      </div>
      
      <div className="sidebar-items overflow-y-auto flex-grow">
  
  
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
                    <div className="mr-2 flex-shrink-0 opacity-70">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 13h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V20a2 2 0 01-2 2z"
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
                  <Method 
                    method={endpoint.method}
                    className="flex-shrink-0 text-xs"
                  />
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