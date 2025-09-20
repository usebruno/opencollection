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
    <div className="flex h-screen">
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
        <div
          className="playground-sidebar h-full overflow-hidden flex"
          style={{
            width: 'var(--sidebar-width)',
            transition: 'width 0.3s ease'
          }}
        >
          <Sidebar
            collection={collectionData}
            activeItemId={currentPageId}
            onSelectItem={onSelectItem}
            logo={logo}
            theme={theme}
            customPages={filteredCustomPages}
            onlyShow={onlyShow}
            onSearchClick={() => setIsSearchOpen(true)}
            isRunnerMode={isRunnerMode}
            onToggleRunnerMode={toggleRunnerMode}
          />
        </div>
      )}

      <div
        className="playground-content h-full overflow-y-auto flex-1"
        ref={containerRef}
      >
        <div className="h-full">
          <SinglePageRenderer
            currentPageItem={currentPageItem}
            currentPageId={currentPageId}
            pageType={currentPageId === 'overview' ? 'overview' : (currentPageItem && 'name' in currentPageItem && !('type' in currentPageItem)) ? 'custom' : 'item'}
            theme={theme}
            md={md}
            collection={collectionData}
            customPageContents={customPageContents}
            isRunnerMode={isRunnerMode}
            toggleRunnerMode={toggleRunnerMode}
            proxyUrl={proxyUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;