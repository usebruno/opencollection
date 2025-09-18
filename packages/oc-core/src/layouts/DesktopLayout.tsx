import React from 'react';
import { OpenCollectionCollection, CustomPage, OpenCollectionItem } from '../types';
import SearchModal from '../ui/SearchModal';
import Sidebar from '../ui/Sidebar';
import SinglePageRenderer from '../ui/SinglePageRenderer';

interface DesktopLayoutProps {
  collectionData: OpenCollectionCollection | null;
  hideSidebar: boolean;
  logo: React.ReactNode;
  theme: 'light' | 'dark' | 'auto';
  currentPageId: string | null;
  currentPageItem: OpenCollectionItem | CustomPage | null;
  currentPageIndex: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  goToPage: (id: string) => void;
  allPageItems: Array<{id: string; item: OpenCollectionItem | CustomPage; type: 'item' | 'custom' | 'overview'}>;
  onSelectItem: (id: string, path?: string) => void;
  filteredCustomPages: CustomPage[];
  onlyShow?: string[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Array<{id: string; name: string; path?: string; type: string}>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  handleSearchResultSelect: (result: {id: string; path?: string; type: string}) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  shouldShowOverview: boolean;
  filteredCollectionItems: any[];
  md: any;
  customPageContents: Record<string, string>;
  children?: React.ReactNode;
  isRunnerMode?: boolean;
  toggleRunnerMode?: () => void;
  proxyUrl?: string;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  collectionData,
  hideSidebar,
  logo,
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
  onSelectItem,
  filteredCustomPages,
  onlyShow,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchInputRef,
  handleSearchResultSelect,
  containerRef,
  shouldShowOverview,
  filteredCollectionItems,
  md,
  customPageContents,
  children,
  isRunnerMode,
  toggleRunnerMode,
  proxyUrl
}) => {
  return (
    <div className="grid h-[calc(100vh-50px)]" style={{
      gridTemplateColumns: hideSidebar ? '1fr' : '280px 1fr',
      gridTemplateRows: 'auto 1fr'
    }}>
      <SearchModal
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        searchInputRef={searchInputRef}
        handleSearchResultSelect={handleSearchResultSelect}
      />
      
      
      {!hideSidebar && (
        <div className="left-header flex items-center p-2" style={{
          borderRight: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div className="flex items-center ml-3">
            {logo ? (
              <div>{logo}</div>
            ) : (
              <svg
                width="28"
                viewBox="0 0 64 64"
                className="mr-2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="64"
                  height="64"
                  rx="12"
                  fill="var(--primary-color)"
                />
                <path
                  d="M14 20H50M14 32H50M14 44H50"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="26" cy="20" r="4" fill="white" />
                <circle cx="38" cy="32" r="4" fill="white" />
                <circle cx="26" cy="44" r="4" fill="white" />
              </svg>
            )}
            <h1 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {collectionData?.name}
            </h1>
          </div>
        </div>
      )}

      <div className="right-header flex items-center justify-between p-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
        
        <div className="relative w-1/2 max-w-md">
          <button
            className="flex items-center w-full p-2 ps-3 text-sm rounded-lg"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-color)',
              cursor: 'pointer'
            }}
            onClick={() => setIsSearchOpen(true)}
          >
            <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="flex-grow text-left">Search endpoints...</span>
            <kbd className="px-2 py-1 text-xs font-semibold rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* {collectionData?.version && (
            <span className="text-xs px-2 py-1 rounded-full" style={{
              backgroundColor: 'var(--badge-bg)',
              color: 'var(--badge-text)'
            }}>
              v{collectionData.version}
            </span>
          )} */}
          <button
            onClick={toggleRunnerMode}
            className="text-xs px-3 py-1.5 rounded-md font-medium hover-lift transition-all"
            style={{
              backgroundColor: isRunnerMode ? 'var(--primary-color)' : 'var(--bg-secondary)',
              color: isRunnerMode ? 'white' : 'var(--text-primary)',
              border: `1px solid ${isRunnerMode ? 'var(--primary-color)' : 'var(--border-color)'}`
            }}
          >
            Runner Mode
          </button>
          <a
            href="https://usebruno.com/play"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-open-bruno text-xs px-3 py-1.5 rounded-md font-medium hover-lift transition-all"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
            }}
          >
            Open in Bruno
          </a>
        </div>
      </div>

      
      {!hideSidebar && (
        <div
          className="playground-sidebar h-full overflow-y-auto"
          style={{
            borderRight: '1px solid var(--border-color)',
            transition: 'width 0.3s ease'
          }}
        >
          <Sidebar
            collection={collectionData}
            activeItemId={currentPageId}
            onSelectItem={onSelectItem}
            theme={theme}
            customPages={filteredCustomPages}
            onlyShow={onlyShow}
          />
        </div>
      )}

      
      <div
        className="playground-content h-full overflow-y-auto"
        style={{
          width: hideSidebar
            ? '100%'
            : '100%',
          transition: 'width 0.3s ease'
        }}
        ref={containerRef}
      >
        <div className="p-4 h-full">
          <SinglePageRenderer
            currentPageItem={currentPageItem}
            currentPageId={currentPageId}
            pageType={allPageItems.find(p => p.id === currentPageId)?.type || 'item'}
            theme={theme}
            md={md}
            collection={collectionData}
            customPageContents={customPageContents}
            currentPageIndex={currentPageIndex}
            totalPages={totalPages}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            isRunnerMode={isRunnerMode}
            proxyUrl={proxyUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout; 