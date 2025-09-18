/**
 * Utility functions for handling OpenCollection items
 */

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