import { useState, useEffect, useRef, useCallback } from 'react';
import { OpenCollectionCollection, OpenCollectionItem, HttpRequest } from '../types';
import { getItemId, generateSafeId } from '../utils/itemUtils';

interface UseSectionTrackingReturn {
  activeItemId: string | null;
  activeItem: OpenCollectionItem | null;
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement>>;
  registerSectionRef: (id: string, ref: HTMLDivElement | null) => void;
  handleSelectItem: (id: string, path?: string) => void;
}

export const useSectionTracking = (
  collectionData: OpenCollectionCollection | null,
  containerRef: React.RefObject<HTMLDivElement | null>,
  isMobile: boolean,
  setMobileView: (view: 'sidebar' | 'content') => void
): UseSectionTrackingReturn => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<OpenCollectionItem | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement>>({});

  const findItemById = useCallback((
    items: OpenCollectionItem[],
    id: string
  ): OpenCollectionItem | null => {
    for (const item of items) {
      const itemId = getItemId(item);
      if (itemId === id) {
        return item;
      }
    }
    return null;
  }, []);

  const registerSectionRef = useCallback((id: string, ref: HTMLDivElement | null) => {
    if (ref) {
      sectionRefs.current[id] = ref;
    }
  }, []);

  const handleSelectItem = useCallback((id: string, path?: string) => {
    console.log('handleSelectItem called with id:', id, 'path:', path);
    
    if (isMobile) {
      setMobileView('content');
    }

    setActiveItemId(id);

    console.log('Available section refs:', Object.keys(sectionRefs.current));
    
    if (path) {
      const fullPathId = path.replace(/^\//, '');
      console.log('Trying with fullPathId:', fullPathId);
      
      if (sectionRefs.current[fullPathId]) {
        console.log('Found section ref match for fullPathId:', fullPathId);
        sectionRefs.current[fullPathId].scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    if (sectionRefs.current[id]) {
      console.log('Found exact section ref match:', id);
      sectionRefs.current[id].scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    if (id.includes('/')) {
      console.log('Trying to find section for path:', id);
      
      const normalizedId = id.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
      const allSectionIds = Object.keys(sectionRefs.current);
      
      const variations = [
        normalizedId,
        normalizedId.replace(/\//g, '//'),
        normalizedId.split('/').pop() || '',
        normalizedId.split('/').slice(-2).join('/')
      ];
      
      console.log('Trying path variations:', variations);
      
      for (const variant of variations) {
        if (sectionRefs.current[variant]) {
          console.log('Found section ref match with variant:', variant);
          sectionRefs.current[variant].scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      
      const pathParts = normalizedId.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      
      const matchingLastPart = allSectionIds.filter(sectionId => 
        sectionId.endsWith(`/${lastPart}`) || sectionId === lastPart
      );
      
      if (matchingLastPart.length === 1) {
        console.log('Found single match by last part:', matchingLastPart[0]);
        sectionRefs.current[matchingLastPart[0]].scrollIntoView({ behavior: 'smooth' });
        return;
      }
      
      if (matchingLastPart.length > 1 || matchingLastPart.length === 0) {
        console.log('Multiple or no matches by last part, trying path similarity scoring');
        
        const scoredMatches = allSectionIds.map(sectionId => {
          if (!sectionId.includes(lastPart)) {
            return { id: sectionId, score: 0 };
          }
          
          const sectionParts = sectionId.split('/');
          let score = 0;
          let consecutiveMatches = 0;
          
          for (let i = 1; i <= Math.min(pathParts.length, sectionParts.length); i++) {
            if (pathParts[pathParts.length - i] === sectionParts[sectionParts.length - i]) {
              score += 10;
              consecutiveMatches++;
              score += consecutiveMatches * 5;
            } else {
              consecutiveMatches = 0;
            }
          }
          
          if (sectionId.includes(lastPart)) {
            score += 20;
          }
          
          const lengthDiff = Math.abs(sectionId.length - normalizedId.length);
          score -= lengthDiff * 0.5;
          
          return { id: sectionId, score };
        })
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score);
        
        console.log('Scored matches:', scoredMatches);
        
        if (scoredMatches.length > 0) {
          const bestMatch = scoredMatches[0].id;
          console.log('Best match by scoring:', bestMatch, 'with score:', scoredMatches[0].score);
          sectionRefs.current[bestMatch].scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }
    
    const baseId = id.includes('/') ? id.split('/').pop() : id;
    if (baseId && sectionRefs.current[baseId]) {
      console.log('Falling back to base ID:', baseId);
      sectionRefs.current[baseId].scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('No matching section found for:', id);
    }
  }, [isMobile, setMobileView]);

  useEffect(() => {
    if (collectionData && !activeItemId) {
      const findFirstApiItem = (items: OpenCollectionItem[]): string | null => {
        for (const item of items) {
          if (item.type === 'http') {
            const itemId = getItemId(item);
            return generateSafeId(itemId);
          }
        }
        return null;
      };

      const initialItemId = findFirstApiItem(collectionData.items || []);

      if (initialItemId) {
        setActiveItemId(initialItemId);
      }
    }
  }, [collectionData, activeItemId]);

  useEffect(() => {
    if (!activeItemId || !collectionData || !collectionData.items) return;

    const item = findItemById(collectionData.items, activeItemId);
    setActiveItem(item);
  }, [activeItemId, collectionData, findItemById]);

  useEffect(() => {
    if (!collectionData || !containerRef.current) return;

    console.log("Setting up robust section visibility tracking");

    const observedSections = new Map<string, IntersectionObserverEntry>();
    let observers: IntersectionObserver[] = [];
    let isInitialized = false;
    let initializationAttempts = 0;
    let initTimer: ReturnType<typeof setTimeout> | null = null;
    let updateTimer: ReturnType<typeof setTimeout> | null = null;
    let mutationObserver: MutationObserver | null = null;

    const clearObservers = () => {
      observers.forEach(observer => observer.disconnect());
      observers = [];
      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }
    };

    const updateActiveSection = () => {
      const visibleSections = Array.from(observedSections.entries())
        .filter(([id, entry]) => {
          if (!entry.isIntersecting) return false;
          
          if (id.includes('/') && collectionData && 'items' in collectionData && collectionData.items) {
            const item = findItemById(collectionData.items, id);
            if (item && item.type === 'folder') {
              return false;
            }
          }
          
          return true;
        })
        .map(([id, entry]) => {
          const rect = entry.boundingClientRect;
          const elementCenter = rect.top + (rect.height / 2);

          const containerRect = containerRef.current?.getBoundingClientRect();
          const containerCenter = containerRect
            ? containerRect.top + (containerRect.height / 2)
            : window.innerHeight / 2;

          const distanceFromCenter = Math.abs(elementCenter - containerCenter);

          const visibleHeight = entry.intersectionRect.height;
          const visiblePercent = visibleHeight / rect.height;

          const score = distanceFromCenter * 0.8 - (visiblePercent * 0.2);

          return { id, entry, score, distanceFromCenter, visiblePercent };
        })
        .sort((a, b) => a.score - b.score);

      if (visibleSections.length > 0) {
        const bestSection = visibleSections[0];

        if (bestSection.id !== activeItemId) {
          console.log(`Changing active item to ${bestSection.id} (distance: ${bestSection.distanceFromCenter.toFixed(2)}px, visible: ${(bestSection.visiblePercent * 100).toFixed(1)}%)`);
          console.log('All visible sections:', visibleSections.map(s => ({ id: s.id, score: s.score, distance: s.distanceFromCenter, visible: s.visiblePercent })));

          setActiveItemId(bestSection.id);
        }
      } else {
        console.log('No visible sections found');
      }
    };

    const setupObservers = () => {
      clearObservers();

      const sections = Object.entries(sectionRefs.current);

      if (sections.length === 0) {
        console.log("No sections found yet, will retry");
        return false;
      }

      console.log(`Setting up observers for ${sections.length} sections`);

      const centerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const id = entry.target.id.startsWith('section-')
              ? entry.target.id.replace(/^section-/, '')
              : entry.target.id;

            if (id) {
              observedSections.set(id, entry);
            }
          });

          if (isInitialized) {
            if (updateTimer) clearTimeout(updateTimer);
            updateTimer = setTimeout(updateActiveSection, 50);
          }
        },
        {
          root: containerRef.current,
          rootMargin: '-40% 0px -40% 0px',
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
        }
      );

      const visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const id = entry.target.id.startsWith('section-')
              ? entry.target.id.replace(/^section-/, '')
              : entry.target.id;

            if (id) {
              observedSections.set(id, entry);
            }
          });

          if (isInitialized) {
            if (updateTimer) clearTimeout(updateTimer);
            updateTimer = setTimeout(updateActiveSection, 50);
          }
        },
        {
          root: containerRef.current,
          rootMargin: '0px',
          threshold: [0, 0.1, 0.5, 1.0]
        }
      );

      observers.push(centerObserver, visibilityObserver);

      sections.forEach(([id, element]) => {
        if (!element || !element.isConnected) return;

        centerObserver.observe(element);
        visibilityObserver.observe(element);
      });

      mutationObserver = new MutationObserver((mutations) => {
        let needsReinit = false;

        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) {
                const element = node as Element;
                if (element.id && element.id.startsWith('section-')) {
                  needsReinit = true;
                } else if (element.querySelector('[id^="section-"]')) {
                  needsReinit = true;
                }
              }
            });
          }
        });

        if (needsReinit) {
          console.log("DOM changed, reinitializing observers");
          setupObservers();
        }
      });

      if (containerRef.current) {
        mutationObserver.observe(containerRef.current, {
          childList: true,
          subtree: true
        });
      }

      return sections.length > 0;
    };

    const initializeTracking = () => {
      initializationAttempts++;

      console.log(`Initializing section tracking (attempt ${initializationAttempts})`);

      const success = setupObservers();

      if (success) {
        console.log("Successfully set up section tracking");

        setTimeout(() => {
          isInitialized = true;

          updateActiveSection();

          if (!activeItemId && observedSections.size > 0) {
            const firstSection = Array.from(observedSections.keys())[0];
            setActiveItemId(firstSection);
          }
        }, 300);

        return true;
      } else if (initializationAttempts < 10) {
        const delay = Math.min(5000, Math.pow(1.5, initializationAttempts) * 100);
        console.log(`Retrying in ${delay}ms`);

        initTimer = setTimeout(initializeTracking, delay);
        return false;
      } else {
        console.error("Failed to initialize section tracking after multiple attempts");
        return false;
      }
    };

    const handleScroll = () => {
      if (!isInitialized) return;

      if (updateTimer) clearTimeout(updateTimer);
      updateTimer = setTimeout(updateActiveSection, 50);
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    initializeTracking();

    return () => {
      clearObservers();
      if (initTimer) clearTimeout(initTimer);
      if (updateTimer) clearTimeout(updateTimer);
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [collectionData, containerRef, activeItemId, findItemById]);

  return {
    activeItemId,
    activeItem,
    sectionRefs,
    registerSectionRef,
    handleSelectItem
  };
};