import { useState, useEffect } from 'react';
import { CustomPage } from '../types';

interface UseCustomPagesReturn {
  validCustomPages: CustomPage[];
  customPageContents: Record<string, string>;
}

export const useCustomPages = (customPages?: CustomPage[]): UseCustomPagesReturn => {
  const [validCustomPages, setValidCustomPages] = useState<CustomPage[]>([]);
  const [customPageContents, setCustomPageContents] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!customPages || customPages.length === 0) {
      setValidCustomPages([]);
      return;
    }

    const valid = customPages.filter(page => {
      if (!page.name) {
        console.error('Custom page missing required "name" property');
        return false;
      }

      if ((!page.content && !page.contentPath) || (page.content && page.contentPath)) {
        console.error(`Custom page "${page.name}" must have either content or contentPath, but not both`);
        return false;
      }

      return true;
    });

    setValidCustomPages(valid);

    const loadPageContents = async () => {
      const contents: Record<string, string> = {};

      for (const page of valid) {
        if (page.content) {
          contents[page.name] = page.content;
        } else if (page.contentPath) {
          try {
            const response = await fetch(page.contentPath);
            if (!response.ok) {
              throw new Error(`Failed to load content from ${page.contentPath}`);
            }
            contents[page.name] = await response.text();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error loading content for custom page "${page.name}":`, error);
            contents[page.name] = `Error loading content: ${errorMessage}`;
          }
        }
      }

      setCustomPageContents(contents);
    };

    loadPageContents();
  }, [customPages]);

  return { validCustomPages, customPageContents };
}; 