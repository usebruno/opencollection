import { useState, useEffect } from 'react';

interface UseResponsiveReturn {
  isMobile: boolean;
  mobileView: 'sidebar' | 'content';
  setMobileView: (view: 'sidebar' | 'content') => void;
  availableTabs: Array<'sidebar' | 'content'>;
}

export const useResponsive = (hideSidebar: boolean = false): UseResponsiveReturn => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'sidebar' | 'content'>('sidebar');

  const availableTabs: Array<'sidebar' | 'content'> = [];
  if (!hideSidebar) availableTabs.push('sidebar');
  availableTabs.push('content');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!availableTabs.includes(mobileView)) {
      setMobileView(availableTabs.includes('content') ? 'content' : availableTabs[0]);
    }
  }, [hideSidebar, mobileView, availableTabs]);

  return {
    isMobile,
    mobileView,
    setMobileView,
    availableTabs
  };
}; 