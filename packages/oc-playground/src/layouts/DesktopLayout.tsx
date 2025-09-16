import React from 'react';
import { OpenCollectionCollection, CustomPage } from '../types';
import SearchModal from '../ui/SearchModal';
import Sidebar from '../ui/Sidebar';
import Overview from '../ui/Overview';
import CustomPageRenderer from '../ui/CustomPageRenderer';
import ItemListRenderer from '../ui/ItemListRenderer';

interface DesktopLayoutProps {
  collectionData: OpenCollectionCollection | null;
  hideSidebar: boolean;
  logo: React.ReactNode;
  theme: 'light' | 'dark' | 'auto';
  activeItemId: string | null;
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
  registerSectionRef: (id: string, ref: HTMLDivElement | null) => void;
  md: any;
  customPageContents: Record<string, string>;
  children?: React.ReactNode;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  collectionData,
  hideSidebar,
  logo,
  theme,
  activeItemId,
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
  registerSectionRef,
  md,
  customPageContents,
  children
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
            activeItemId={activeItemId}
            onSelectItem={onSelectItem}
            theme={theme}
            customPages={filteredCustomPages}
            onlyShow={onlyShow}
          />
        </div>
      )}

      
      <div
        className="playground-content h-full p-4 overflow-y-auto"
        style={{
          width: hideSidebar
            ? '100%'
            : '100%',
          transition: 'width 0.3s ease'
        }}
        ref={containerRef}
      >
        <div className="p-2 pb-20">
          
          {collectionData && shouldShowOverview && (
            <div ref={(ref) => registerSectionRef('overview', ref)} id="section-overview">
              <Overview collection={collectionData} theme={theme} />
            </div>
          )}

          
          {filteredCustomPages.length > 0 && (
            <div className="mt-8 mb-4">
              {filteredCustomPages.map(page => {
                const content = customPageContents[page.name] || '';
                return (
                  <div
                    key={page.name}
                    className="mb-8 pb-4" 
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {page.name}
                    </h2>
                    <CustomPageRenderer
                      pageName={page.name} 
                      customPage={page}
                      content={content}
                      theme={theme}
                      md={md}
                      registerSectionRef={registerSectionRef}
                    />
                  </div>
                );
              })}
            </div>
          )}

          
          {collectionData && filteredCollectionItems.length > 0 && (
            <div className="mt-8">
              <ItemListRenderer
                items={filteredCollectionItems}
                registerSectionRef={registerSectionRef}
                theme={theme}
                md={md}
                parentPath=""
                collection={collectionData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout; 