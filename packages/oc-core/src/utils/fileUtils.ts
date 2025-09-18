import { isYamlFile } from './yamlUtils';
import { parseYaml } from './yamlUtils';

const loadOpenCollectionData = async (source: string | File): Promise<any> => {
  let content: string;
  
  if (source instanceof File) {
    content = await source.text();
  } else if (typeof source === 'string') {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch collection: ${response.statusText}`);
      }
      content = await response.text();
    } else {
      content = source;
    }
  } else {
    throw new Error('Invalid source type for collection');
  }

  try {
    return parseYaml(content);
  } catch (yamlError) {
    try {
      return JSON.parse(content);
    } catch (jsonError) {
      throw new Error('Failed to parse collection as YAML or JSON');
    }
  }
};

export const loadCollectionFromUrl = async (source: string | File): Promise<any> => {
  try {
    if (source instanceof File) {
      const fileName = source.name.toLowerCase();
      
      if (isYamlFile(fileName)) {
        return await loadOpenCollectionData(source);
      } else {
        const content = await source.text();
        return JSON.parse(content);
      }
    }

    if (typeof source === 'string') {
      if (source.startsWith('file://') || source.startsWith('/')) {
        const filePath = source.replace('file://', '');
        
        const response = await fetch(`http://localhost:3001/api/read-collection?path=${encodeURIComponent(filePath)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to load collection: ${response.statusText}`);
        }
        
        return await response.json();
      } else if (source.startsWith('http://') || source.startsWith('https://')) {
        const response = await fetch(source);
        
        if (!response.ok) {
          throw new Error(`Failed to load collection: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        const isYamlUrl = isYamlFile(source);
        const isYamlContentType = contentType.includes('yaml') || contentType.includes('yml');
        
        if (isYamlUrl || isYamlContentType) {
          const yamlText = await response.text();
          return await loadOpenCollectionData(yamlText);
        } else {
          return await response.json();
        }
      } else {
        const response = await fetch(`http://localhost:3001/api/read-collection?path=${encodeURIComponent(source)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to load collection: ${response.statusText}`);
        }
        
        return await response.json();
      }
    }

    throw new Error('Invalid source type for collection loading');
  } catch (error) {
    console.error('Error loading collection:', error);
    throw error;
  }
}; 