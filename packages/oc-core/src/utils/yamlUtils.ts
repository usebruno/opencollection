import { load } from 'js-yaml';

/**
 * Utility functions for handling YAML collections
 */

/**
 * Check if a string represents a YAML file path or URL
 * @param input The file path or URL to check
 * @returns True if the input appears to be a YAML file
 */
export const isYamlFile = (input: string): boolean => {
  const lowerInput = input.toLowerCase();
  return lowerInput.endsWith('.yml') || lowerInput.endsWith('.yaml');
};

/**
 * Parse YAML content into a JavaScript object
 * @param yamlContent The YAML content as a string
 * @returns Parsed JavaScript object
 */
export const parseYaml = (yamlContent: string): any => {
  try {
    return load(yamlContent);
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Load collection data from either JSON or YAML format
 * @param content The file content as a string
 * @param filePath Optional file path to help determine format
 * @returns Parsed collection data
 */
export const parseCollectionContent = (content: string, filePath?: string): any => {
  if (filePath && isYamlFile(filePath)) {
    return parseYaml(content);
  }
  
  const trimmedContent = content.trim();
  
  if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return parseYaml(content);
};

/**
 * Validate that the parsed content matches the expected collection structure
 * @param data The parsed data to validate
 * @returns True if the data appears to be a valid collection
 */
export const isValidCollection = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Basic validation - should have a name and items array
  return typeof data.name === 'string' && Array.isArray(data.items);
}; 