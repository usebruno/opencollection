import { useState, useEffect, useCallback, useMemo } from 'react';
import { OpenCollectionCollection, OpenCollectionItem, CustomPage } from '../types';
import { getItemId, generateSafeId } from '../utils/itemUtils';

interface UsePageNavigationReturn {
  currentPageId: string | null;
  currentPageItem: OpenCollectionItem | CustomPage | null;
  currentPageIndex: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  goToPage: (id: string) => void;
  allPageItems: Array<{id: string; item: OpenCollectionItem | CustomPage; type: 'item' | 'custom' | 'overview'}>;
}

export const usePageNavigation = (
  collectionData: OpenCollectionCollection | null,
  filteredCustomPages: CustomPage[],
  filteredCollectionItems: OpenCollectionItem[],
  shouldShowOverview: boolean,
  isMobile: boolean,
  setMobileView: (view: 'sidebar' | 'content') => void
): UsePageNavigationReturn => {
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  // Memoize all available pages
  const allPageItems = useMemo(() => {
    const pages: Array<{id: string; item: OpenCollectionItem | CustomPage; type: 'item' | 'custom' | 'overview'}> = [];
    
    // Add overview if it should be shown
    if (shouldShowOverview && collectionData) {
      pages.push({
        id: 'overview',
        item: { name: 'Overview', type: 'overview' } as any,
        type: 'overview'
      });
    }

    // Add custom pages
    filteredCustomPages.forEach(page => {
      pages.push({
        id: page.name,
        item: page,
        type: 'custom'
      });
    });

    // Add collection items (flatten nested items in folders)
    const flattenItems = (items: OpenCollectionItem[], parentPath: string = ''): OpenCollectionItem[] => {
      const result: OpenCollectionItem[] = [];
      items.forEach(item => {
        // Always include the item itself (folders are also pages now)
        result.push(item);
        
        // If it's a folder with nested items, recursively flatten them
        if (item.type === 'folder' && (item as any).items) {
          const nestedItems = flattenItems((item as any).items, parentPath ? `${parentPath}/${item.name || 'folder'}` : item.name || 'folder');
          result.push(...nestedItems);
        }
      });
      return result;
    };

    const flatItems = flattenItems(filteredCollectionItems);
    flatItems.forEach(item => {
      const itemId = getItemId(item);
      const safeId = generateSafeId(itemId);
      pages.push({
        id: safeId,
        item,
        type: 'item'
      });
    });

    return pages;
  }, [collectionData, filteredCustomPages, filteredCollectionItems, shouldShowOverview]);

  // Get current page index and item
  const currentPageIndex = useMemo(() => {
    if (!currentPageId) return -1;
    return allPageItems.findIndex(page => page.id === currentPageId);
  }, [currentPageId, allPageItems]);

  const currentPageItem = useMemo(() => {
    if (currentPageIndex === -1) return null;
    return allPageItems[currentPageIndex]?.item || null;
  }, [currentPageIndex, allPageItems]);

  // Navigation state
  const canGoNext = currentPageIndex < allPageItems.length - 1 && currentPageIndex !== -1;
  const canGoPrevious = currentPageIndex > 0;
  const totalPages = allPageItems.length;

  // Update URL parameters
  const updateUrlParams = useCallback((pageId: string) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('page', pageId);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Read initial page from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined' && allPageItems.length > 0) {
      const url = new URL(window.location.href);
      const pageParam = url.searchParams.get('page');
      
      if (pageParam && allPageItems.some(page => page.id === pageParam)) {
        setCurrentPageId(pageParam);
      } else if (!currentPageId) {
        // Set first page as default
        const firstPageId = allPageItems[0]?.id;
        if (firstPageId) {
          setCurrentPageId(firstPageId);
          updateUrlParams(firstPageId);
        }
      }
    }
  }, [allPageItems, currentPageId, updateUrlParams]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (canGoNext) {
      const nextPageId = allPageItems[currentPageIndex + 1]?.id;
      if (nextPageId) {
        setCurrentPageId(nextPageId);
        updateUrlParams(nextPageId);
        if (isMobile) {
          setMobileView('content');
        }
      }
    }
  }, [canGoNext, currentPageIndex, allPageItems, updateUrlParams, isMobile, setMobileView]);

  const goToPrevious = useCallback(() => {
    if (canGoPrevious) {
      const prevPageId = allPageItems[currentPageIndex - 1]?.id;
      if (prevPageId) {
        setCurrentPageId(prevPageId);
        updateUrlParams(prevPageId);
        if (isMobile) {
          setMobileView('content');
        }
      }
    }
  }, [canGoPrevious, currentPageIndex, allPageItems, updateUrlParams, isMobile, setMobileView]);

  const goToPage = useCallback((id: string) => {
    if (allPageItems.some(page => page.id === id)) {
      setCurrentPageId(id);
      updateUrlParams(id);
      if (isMobile) {
        setMobileView('content');
      }
    }
  }, [allPageItems, updateUrlParams, isMobile, setMobileView]);

  return {
    currentPageId,
    currentPageItem,
    currentPageIndex,
    totalPages,
    canGoNext,
    canGoPrevious,
    goToNext,
    goToPrevious,
    goToPage,
    allPageItems
  };
}; 