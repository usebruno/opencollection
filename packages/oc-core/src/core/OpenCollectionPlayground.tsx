import React, { useRef } from 'react';
import {
  useCollectionData,
  useCustomPages,
  useMarkdownRenderer,
  useResponsive,
  useTheme,
  useItemFiltering,
  useSearchModal,
  usePageNavigation,
  useRunnerMode
} from '../hooks';
import { OpenCollectionPlaygroundProps } from '../types';
import MobileLayout from '../ui/MobileLayout';
import DesktopLayout from '../layouts/DesktopLayout';

const OpenCollectionPlayground: React.FC<OpenCollectionPlaygroundProps> = ({
  collection,
  theme = 'light',
  logo,
  customPages,
  hideSidebar = false,
  hideHeader = false,
  onlyShow,
  proxyUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { collectionData, isLoading, error } = useCollectionData(collection);
  const { validCustomPages, customPageContents } = useCustomPages(customPages);
  const md = useMarkdownRenderer();
  const { isMobile, mobileView, setMobileView } = useResponsive(hideSidebar);
  
  useTheme(theme);

  const {
    filteredCollectionItems,
    filteredCustomPages,
    shouldShowOverview
  } = useItemFiltering(collectionData, validCustomPages, onlyShow);

  const {
    currentPageId,
    currentPageItem,
    currentPageIndex,
    totalPages,
    canGoNext,
    canGoPrevious,
    goToNext,
    goToPrevious,
    goToPage,
    allPageItems
  } = usePageNavigation(
    collectionData,
    filteredCustomPages,
    filteredCollectionItems,
    shouldShowOverview,
    isMobile,
    setMobileView
  );

  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchInputRef,
    handleSearchResultSelect: handleSearchResultSelectHook
  } = useSearchModal(collectionData, validCustomPages, goToPage);

  const { isRunnerMode, toggleRunnerMode } = useRunnerMode();

  const handleSearchResultSelect = (result: {id: string; path?: string; type: string}) => {
    handleSearchResultSelectHook({ ...result, name: result.id });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  }

  const commonProps = {
    collectionData,
    hideSidebar,
    theme,
    currentPageId,
    currentPageItem,
    currentPageIndex,
    totalPages,
    canGoNext,
    canGoPrevious,
    goToNext,
    goToPrevious,
    goToPage,
    allPageItems,
    onSelectItem: goToPage,
    filteredCustomPages,
    onlyShow,
    containerRef,
    shouldShowOverview,
    filteredCollectionItems,
    md,
    customPageContents
  };

  const desktopProps = {
    ...commonProps,
    logo,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchInputRef,
    handleSearchResultSelect,
    isRunnerMode,
    toggleRunnerMode,
    proxyUrl
  };

  const mobileProps = {
    ...commonProps,
    mobileView,
    setMobileView
  };

  return (
    <div className={`oc-playground ${theme}`}>
      {isMobile ? (
        <MobileLayout {...mobileProps} />
      ) : (
        <DesktopLayout {...desktopProps} />
      )}
    </div>
  );
};

export default OpenCollectionPlayground;