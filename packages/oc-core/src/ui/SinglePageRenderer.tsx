import React from 'react';
import { OpenCollectionItem, OpenCollectionCollection, CustomPage, HttpRequest } from '../types';
import ItemComponent from './ItemComponent';
import Overview from './Overview';
import CustomPageRenderer from './CustomPageRenderer';
import PageNavigation from './PageNavigation';
import { RequestRunner } from './request-runner';

interface SinglePageRendererProps {
  currentPageItem: OpenCollectionItem | CustomPage | null;
  currentPageId: string | null;
  pageType: 'item' | 'custom' | 'overview';
  theme: 'light' | 'dark' | 'auto';
  md: any;
  collection: OpenCollectionCollection | null;
  customPageContents: Record<string, string>;
  // Navigation props
  currentPageIndex: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  // Runner mode props
  isRunnerMode?: boolean;
  proxyUrl?: string;
}

const SinglePageRenderer: React.FC<SinglePageRendererProps> = ({
  currentPageItem,
  currentPageId,
  pageType,
  theme,
  md,
  collection,
  customPageContents,
  currentPageIndex,
  totalPages,
  canGoNext,
  canGoPrevious,
  goToNext,
  goToPrevious,
  isRunnerMode,
  proxyUrl
}) => {
  if (!currentPageItem || !currentPageId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="mt-2 text-sm font-medium">No content available</h3>
          <p className="mt-1 text-sm">Please select an item from the sidebar.</p>
        </div>
      </div>
    );
  }

  // Render overview
  if (pageType === 'overview' && collection) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex-1 mb-4">
          <Overview collection={collection} theme={theme} />
        </div>
        <PageNavigation
          currentPageIndex={currentPageIndex}
          totalPages={totalPages}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          goToNext={goToNext}
          goToPrevious={goToPrevious}
          currentPageName={currentPageItem?.name || currentPageId || undefined}
        />
      </div>
    );
  }

  // Render custom page
  if (pageType === 'custom') {
    const customPage = currentPageItem as CustomPage;
    const content = customPageContents[customPage.name] || '';
    
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex-1 mb-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {customPage.name}
            </h1>
            <CustomPageRenderer
              pageName={customPage.name} 
              customPage={customPage}
              content={content}
              theme={theme}
              md={md}
              registerSectionRef={() => {}} // No-op since we don't need section refs in page mode
            />
          </div>
        </div>
        <PageNavigation
          currentPageIndex={currentPageIndex}
          totalPages={totalPages}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          goToNext={goToNext}
          goToPrevious={goToPrevious}
          currentPageName={currentPageItem?.name || currentPageId || undefined}
        />
      </div>
    );
  }

  // Render collection item
  if (pageType === 'item') {
    const item = currentPageItem as OpenCollectionItem;
    
    // Render in runner mode if enabled and it's an HTTP request
            if (isRunnerMode && item.type === 'http' && collection) {
      return (
        <div className="h-full">
                                <RequestRunner
            item={item as HttpRequest}
            collection={collection}
            proxyUrl={proxyUrl}
          />
        </div>
      );
    }
    
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex-1 mb-4">
          <ItemComponent
            key={`${item.type}-${currentPageId}`}
            item={item}
            registerSectionRef={() => {}} // No-op since we don't need section refs in page mode
            theme={theme}
            md={md}
            parentPath=""
            collection={collection || undefined}
          />
        </div>
        <PageNavigation
          currentPageIndex={currentPageIndex}
          totalPages={totalPages}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          goToNext={goToNext}
          goToPrevious={goToPrevious}
          currentPageName={currentPageItem?.name || currentPageId || undefined}
        />
      </div>
    );
  }

  return null;
};

export default SinglePageRenderer; 