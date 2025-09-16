import { useState, useEffect, useRef } from 'react';
import { OpenCollectionCollection, OpenCollectionItem, HttpRequest, CustomPage } from '../types';
import { getItemId } from '../utils/itemUtils';

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
    
    const searchInItems = (items: OpenCollectionItem[], currentPath: string = '') => {
      items.forEach(item => {
        const itemId = getItemId(item);
        const itemName = itemId;
        const itemPath = currentPath ? `${currentPath}/${itemName}` : itemName;
        
        if (itemName.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: itemId,
            name: itemName,
            path: itemPath,
            type: item.type
          });
        }
      });
    };
    
    if (collectionData.items) {
      searchInItems(collectionData.items);
    }
    
    validCustomPages.forEach(page => {
      if (page.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: page.name,
          name: page.name,
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