import { useState, useEffect, useRef } from 'react';
import { OpenCollectionCollection, OpenCollectionItem, HttpRequest, CustomPage } from '../types';
import { getItemId, generateSafeId } from '../utils/itemUtils';

interface SearchResult {
  id: string;
  name: string;
  path?: string;
  type: string;
}

interface UseSearchModalReturn {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  selectedResultIndex: number;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  handleSearchResultSelect: (result: SearchResult) => void;
}

export const useSearchModal = (
  collectionData: OpenCollectionCollection | null,
  validCustomPages: CustomPage[],
  onSelectItem: (id: string, path?: string) => void
): UseSearchModalReturn => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const performSearch = (query: string) => {
    if (!query.trim() || !collectionData) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const addedIds = new Set<string>(); // Track added items to avoid duplicates
    
    const searchInItems = (items: OpenCollectionItem[], currentPath: string = '') => {
      items.forEach(item => {
        const itemId = getItemId(item);
        const itemName = itemId;
        const itemPath = currentPath ? `${currentPath}/${itemName}` : itemName;
        
        const lowerQuery = query.toLowerCase();
        let matchFound = false;
        
        // Search in item name
        if (itemName.toLowerCase().includes(lowerQuery)) {
          matchFound = true;
        }
        
        // Search in URL for HTTP requests
        if (item.type === 'http' && (item as any).url && (item as any).url.toLowerCase().includes(lowerQuery)) {
          matchFound = true;
        }
        
        // Search in method for HTTP requests
        if (item.type === 'http' && (item as any).method && (item as any).method.toLowerCase().includes(lowerQuery)) {
          matchFound = true;
        }
        
        // Search in documentation
        if ((item as any).docs && (item as any).docs.toLowerCase().includes(lowerQuery)) {
          matchFound = true;
        }
        
        // Add to results if match found and not already added
        const safeId = generateSafeId(itemId);
        if (matchFound && !addedIds.has(safeId)) {
          addedIds.add(safeId);
          
          // Create a descriptive name based on item type
          let displayName = itemName;
          if (item.type === 'http') {
            const method = (item as any).method || 'GET';
            const url = (item as any).url || '';
            displayName = `${method} ${itemName}`;
            if (url && !itemName.includes(url)) {
              displayName += ` - ${url}`;
            }
          } else if (item.type === 'folder') {
            const itemCount = (item as any).items?.length || 0;
            displayName = `${itemName} (${itemCount} items)`;
          } else if (item.type === 'script') {
            displayName = `📜 ${itemName}`;
          }
          
          results.push({
            id: safeId,
            name: displayName,
            path: itemPath,
            type: item.type
          });
        }
        
        // Recursively search in folder items
        if (item.type === 'folder' && (item as any).items && (item as any).items.length > 0) {
          searchInItems((item as any).items, itemPath);
        }
      });
    };
    
    if (collectionData.items) {
      searchInItems(collectionData.items);
    }
    
    validCustomPages.forEach(page => {
      if (page.name.toLowerCase().includes(query.toLowerCase()) && !addedIds.has(page.name)) {
        addedIds.add(page.name);
        results.push({
          id: page.name,
          name: `📄 ${page.name}`,
          type: 'page'
        });
      }
    });
    
    setSearchResults(results);
  };

  const handleSearchResultSelect = (result: SearchResult) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onSelectItem(result.id, result.path);
  };

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, collectionData, validCustomPages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 10);
      }
      
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  return {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedResultIndex,
    searchInputRef,
    handleSearchResultSelect
  };
}; 