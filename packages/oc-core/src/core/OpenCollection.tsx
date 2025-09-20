import React, { useRef, useState, useEffect } from 'react';
import {
  useCollectionData,
  useCustomPages,
  useMarkdownRenderer,
  useResponsive,
  useTheme,
  useItemFiltering,
  useSearchModal,
  useRunnerMode
} from '../hooks';
import { OpenCollectionProps } from '../types';
import MobileLayout from '../ui/MobileLayout';
import DesktopLayout from '../layouts/DesktopLayout';

const OpenCollection: React.FC<OpenCollectionProps> = ({
  collection,
  theme = 'light',
  logo,
  customPages,
  hideSidebar = false,
  onlyShow,
  proxyUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { collectionData, isLoading, error } = useCollectionData(collection);
  const { validCustomPages, customPageContents } = useCustomPages(customPages);
  const md = useMarkdownRenderer();
  const { isMobile, mobileView, setMobileView } = useResponsive(hideSidebar);
  
  useTheme(theme);

  const {
    filteredCollectionItems,
    filteredCustomPages
  } = useItemFiltering(collectionData, validCustomPages, onlyShow);

  // Page selection state
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageItem, setCurrentPageItem] = useState<any>(null);

  // Handle item selection
  const handleSelectItem = (id: string, path?: string) => {
    console.log('Selecting item:', id, 'path:', path);
    setCurrentPageId(id);
    
    
    // Check if it's a custom page
    const customPage = filteredCustomPages.find(page => page.name === id || page.name === id.replace(/-/g, ' '));
    if (customPage) {
      setCurrentPageItem(customPage);
      return;
    }
    
    // Find the item in the collection
    const findItem = (items: any[]): any => {
      for (const item of items) {
        const itemId = item.id || item.uid || item.name || 'unnamed-item';
        if (itemId === id || itemId.toLowerCase().replace(/[^a-z0-9\-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') === id) {
          return item;
        }
        if (item.type === 'folder' && item.items) {
          const found = findItem(item.items);
          if (found) return found;
        }
      }
      return null;
    };
    
    if (collectionData && 'items' in collectionData && collectionData.items) {
      const item = findItem(collectionData.items);
      setCurrentPageItem(item);
    }
  };

  // Set initial page to first root-level request when collection loads
  useEffect(() => {
    if (collectionData && currentPageId === null) {
      // Find the first root-level request
      const firstRequest = collectionData.items?.find(item => item.type === 'http');
      if (firstRequest && firstRequest.name) {
        handleSelectItem(firstRequest.name);
      } else if (collectionData.items && collectionData.items.length > 0) {
        // If no request found, select the first item
        const firstItem = collectionData.items[0];
        if (firstItem.name) {
          handleSelectItem(firstItem.name);
        }
      }
    }
  }, [collectionData, currentPageId]);

  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchInputRef,
    handleSearchResultSelect: handleSearchResultSelectHook
  } = useSearchModal(collectionData, validCustomPages, handleSelectItem);

  const { isRunnerMode, toggleRunnerMode } = useRunnerMode();

  const handleSearchResultSelect = (result: {id: string; path?: string; type: string}) => {
    handleSearchResultSelectHook({ ...result, name: result.id });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  }

  const commonProps = {
    collectionData,
    hideSidebar,
    theme,
    currentPageId,
    currentPageItem,
    onSelectItem: handleSelectItem,
    filteredCustomPages,
    onlyShow,
    containerRef,
    filteredCollectionItems,
    md,
    customPageContents
  };

  const desktopProps = {
    ...commonProps,
    logo,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchInputRef,
    handleSearchResultSelect,
    isRunnerMode,
    toggleRunnerMode,
    proxyUrl
  };

  const mobileProps = {
    ...commonProps,
    mobileView,
    setMobileView
  };

  return (
    <div className={`oc-playground ${theme}`}>
      {isMobile ? (
        <MobileLayout {...mobileProps} />
      ) : (
        <DesktopLayout {...desktopProps} />
      )}
    </div>
  );
};

export default OpenCollection;