import { useMemo, useCallback } from 'react';
import { OpenCollectionCollection, OpenCollectionItem, HttpRequest, CustomPage } from '../types';

interface UseItemFilteringReturn {
  shouldShowItem: (itemId: string) => boolean;
  filteredCollectionItems: OpenCollectionItem[];
  filteredCustomPages: CustomPage[];
  shouldShowOverview: boolean;
}

export const useItemFiltering = (
  collectionData: OpenCollectionCollection | null,
  validCustomPages: CustomPage[],
  onlyShow?: string[]
): UseItemFilteringReturn => {
  const shouldShowItem = useCallback((itemId: string): boolean => {
    if (!onlyShow || onlyShow.length === 0) {
      return true;
    }
    return onlyShow.includes(itemId);
  }, [onlyShow]);

  const filteredCollectionItems = useMemo(() => {
    if (!collectionData?.items) {
      return [];
    }

    if (!onlyShow || onlyShow.length === 0) {
      return collectionData.items;
    }

    const filterItems = (items: OpenCollectionItem[]): OpenCollectionItem[] => {
      return items.filter(item => {
        const itemId = item.type === 'http' ? (item as HttpRequest).name || '' : item.type;
        return shouldShowItem(itemId);
      });
    };

    return filterItems(collectionData.items);
  }, [collectionData, onlyShow, shouldShowItem]);

  const filteredCustomPages = useMemo(() => {
    if (!validCustomPages || !onlyShow || onlyShow.length === 0) {
      return validCustomPages;
    }

    return validCustomPages.filter(page => shouldShowItem(page.name));
  }, [validCustomPages, onlyShow, shouldShowItem]);

  const shouldShowOverview = useMemo(() => {
    return shouldShowItem('overview');
  }, [shouldShowItem]);

  return {
    shouldShowItem,
    filteredCollectionItems,
    filteredCustomPages,
    shouldShowOverview
  };
}; 