import React from 'react';
import { OpenCollectionCollection, CustomPage } from '../types';
import Sidebar from './Sidebar';
import Overview from './Overview';
import CustomPageRenderer from './CustomPageRenderer';
import ItemListRenderer from './ItemListRenderer';

interface MobileLayoutProps {
  collectionData: OpenCollectionCollection | null;
  hideSidebar: boolean;
  theme: 'light' | 'dark' | 'auto';
  activeItemId: string | null;
  onSelectItem: (id: string, path?: string) => void;
  filteredCustomPages: CustomPage[];
  onlyShow?: string[];
  mobileView: 'sidebar' | 'content';
  setMobileView: (view: 'sidebar' | 'content') => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  shouldShowOverview: boolean;
  filteredCollectionItems: any[];
  registerSectionRef: (id: string, ref: HTMLDivElement | null) => void;
  md: any;
  customPageContents: Record<string, string>;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  collectionData,
  hideSidebar,
  theme,
  activeItemId,
  onSelectItem,
  filteredCustomPages,
  onlyShow,
  mobileView,
  setMobileView,
  containerRef,
  shouldShowOverview,
  filteredCollectionItems,
  registerSectionRef,
  md,
  customPageContents
}) => {
  if (hideSidebar) {
    return (
      <div className="h-[calc(100vh-60px)] w-full overflow-y-auto" ref={containerRef}>
        <div className="p-4">
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
                    className="mb-8 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}
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
              <h2 className="text-xl font-semibold mb-4">Requests</h2>
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
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] w-full">
      <div className="flex" style={{ borderBottom: '1px solid var(--border-color)' }}>
        {!hideSidebar && (
          <button
            className={`flex-1 py-2 px-4 text-center ${mobileView === 'sidebar' ? 'active' : ''}`}
            onClick={() => setMobileView('sidebar')}
            aria-selected={mobileView === 'sidebar'}
            style={{ color: 'var(--text-primary)' }}
          >
            API
          </button>
        )}
        <button
          className={`flex-1 py-2 px-4 text-center ${mobileView === 'content' ? 'active' : ''}`}
          onClick={() => setMobileView('content')}
          aria-selected={mobileView === 'content'}
          style={{ color: 'var(--text-primary)' }}
        >
          Content
        </button>
      </div>

      {!hideSidebar && (
        <div className={`h-full overflow-y-auto ${mobileView === 'sidebar' ? 'block' : 'hidden'}`}>
          <Sidebar
            collection={collectionData}
            activeItemId={activeItemId}
            onSelectItem={onSelectItem}
            logo={null}
            theme={theme}
            customPages={filteredCustomPages}
            onlyShow={onlyShow}
          />
        </div>
      )}

      <div
        className={`h-full overflow-y-auto p-4 ${mobileView === 'content' ? 'block' : 'hidden'}`}
        ref={containerRef}
      >
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
                  ref={(ref) => registerSectionRef(page.name, ref)}
                  id={`section-${page.name}`}
                  className="mb-8 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}
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
            <h2 className="text-xl font-semibold mb-4">Requests</h2>
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
  );
};

export default MobileLayout; 