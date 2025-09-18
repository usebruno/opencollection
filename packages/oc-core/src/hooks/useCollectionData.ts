import { useEffect, useState } from 'react';
import { isYamlFile, parseYaml } from '../utils/yamlUtils';
import { OpenCollectionCollection } from '../types';

const loadOpenCollectionData = async (source: string | File): Promise<OpenCollectionCollection> => {
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
    return parseYaml(content) as OpenCollectionCollection;
  } catch (yamlError) {
    try {
      return JSON.parse(content) as OpenCollectionCollection;
    } catch (jsonError) {
      throw new Error('Failed to parse collection as YAML or JSON');
    }
  }
};

interface UseCollectionDataReturn {
  collectionData: OpenCollectionCollection | null;
  isLoading: boolean;
  error: string | null;
}

export const useCollectionData = (collection: OpenCollectionCollection | string | File): UseCollectionDataReturn => {
  const [collectionData, setCollectionData] = useState<OpenCollectionCollection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollection = async () => {
      try {
          setIsLoading(true);
        
        if (collection instanceof File) {
          // Handle File objects
          const fileName = collection.name.toLowerCase();
          
          let data;
          if (isYamlFile(fileName)) {
            data = await loadOpenCollectionData(collection);
          } else {
            // Assume JSON
            const content = await collection.text();
            data = JSON.parse(content);
          }
          
          setCollectionData(data as OpenCollectionCollection);
        } else if (typeof collection === 'string') {
          // Handle URLs
          const response = await fetch(collection);
          if (!response.ok) {
            throw new Error(`Failed to load API collection: ${response.statusText}`);
          }
          
          // Check if the URL or content suggests YAML format
          const contentType = response.headers.get('content-type') || '';
          const isYamlUrl = isYamlFile(collection);
          const isYamlContentType = contentType.includes('yaml') || contentType.includes('yml');
          
          let data;
          if (isYamlUrl || isYamlContentType) {
            // Handle YAML content
            const yamlText = await response.text();
            data = await loadOpenCollectionData(yamlText);
          } else {
            // Default to JSON
            data = await response.json();
          }
          
          setCollectionData(data as OpenCollectionCollection);
        } else {
          // Handle collection objects
          setCollectionData(collection as OpenCollectionCollection);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API collection');
      } finally {
        setIsLoading(false);
      }
    };

    loadCollection();
  }, [collection]);

  return { collectionData, isLoading, error };
}; 