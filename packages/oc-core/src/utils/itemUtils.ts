/**
 * Utility functions for handling OpenCollection items
 */

import { OpenCollectionItem } from '../types';

/**
 * Generate a safe HTML ID from an item name or ID
 * @param input The input string to convert to a safe ID
 * @returns A safe HTML ID string
 */
export const generateSafeId = (input: string): string => {
  if (!input) return 'unnamed-item';
  
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Get the effective ID for an item (prefers id, falls back to uid, then name)
 * @param item The Bruno item
 * @returns The effective ID string
 */
export const getItemId = (item: any): string => {
  if (!item) return 'unnamed-item';
  return item.id || item.uid || item.name || 'unnamed-item';
};

/**
 * Generate a section ID for use in HTML elements
 * @param item The Bruno item
 * @param parentPath Optional parent path for nested items
 * @returns A safe section ID
 */
export const generateSectionId = (item: any, parentPath?: string): string => {
  const itemId = getItemId(item);
  const safeItemId = generateSafeId(itemId);
  
  if (parentPath) {
    const safeParentPath = generateSafeId(parentPath);
    return `${safeParentPath}-${safeItemId}`;
  }
  
  return safeItemId;
};

/**
 * Sort OpenCollection items with folders first, then other items
 * @param items Array of OpenCollection items to sort
 * @returns Sorted array with folders first
 */
export const sortItemsWithFoldersFirst = (items: OpenCollectionItem[]): OpenCollectionItem[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  
  return [...items].filter(item => item != null).sort((a, b) => {
    // Folders come first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    
    // Within the same type, sort alphabetically by name
    const nameA = getItemId(a).toLowerCase();
    const nameB = getItemId(b).toLowerCase();
    
    return nameA.localeCompare(nameB);
  });
}; 