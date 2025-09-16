import React, { memo, useMemo } from 'react';
import { OpenCollectionItem, OpenCollectionCollection, HttpRequest } from '../types';
import { generateSafeId, getItemId } from '../utils/itemUtils';
import ItemComponent from './ItemComponent';

const ItemListRenderer = memo(({
  items,
  registerSectionRef,
  theme,
  md,
  parentPath = '',
  collection
}: {
  items: OpenCollectionItem[];
  registerSectionRef: (id: string, ref: HTMLDivElement | null) => void;
  theme: 'light' | 'dark' | 'auto';
  md: any;
  parentPath?: string;
  collection?: OpenCollectionCollection;
}) => {
  const deduplicatedItems = useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }

    console.log(`Processing ${items.length} items for deduplication`);

    const processedIds = new Set<string>();
    const result: OpenCollectionItem[] = [];

    for (const item of items) {
      // Generate a consistent, normalized ID for deduplication
      const itemId = getItemId(item);
      const safeId = generateSafeId(itemId);
      const itemName = item.type === 'http' ? (item as HttpRequest).name || itemId : itemId;
      const safeName = generateSafeId(itemName);

      if (processedIds.has(safeId) || processedIds.has(safeName)) {
        console.log(`Skipping duplicate item: ${itemName}`);
        continue;
      }

      processedIds.add(safeId);
      processedIds.add(safeName);
      result.push(item);
    }

    console.log(`Returning ${result.length} deduplicated items`);
    return result;
  }, [items]); // Only re-compute when items change

  if (deduplicatedItems.length === 0) {
    return <div className="text-center p-4">No items to display</div>;
  }

  return (
    <>
      {deduplicatedItems.map((item, index) => (
        <ItemComponent
          key={generateSafeId(getItemId(item)) || index}
          item={item}
          registerSectionRef={registerSectionRef}
          theme={theme}
          md={md}
          parentPath={parentPath}
          collection={collection}  // Pass collection to ItemComponent
        />
      ))}
    </>
  );
});

export default ItemListRenderer; 