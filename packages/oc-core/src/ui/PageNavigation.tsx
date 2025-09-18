import React, { useEffect } from 'react';

interface PageNavigationProps {
  currentPageIndex: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  currentPageName?: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPageIndex,
  totalPages,
  canGoNext,
  canGoPrevious,
  goToNext,
  goToPrevious,
  currentPageName
}) => {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && canGoPrevious) {
        goToPrevious();
      } else if (event.key === 'ArrowRight' && canGoNext) {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [canGoNext, canGoPrevious, goToNext, goToPrevious]);
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-auto pt-4 pb-4" style={{ 
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
    }}>
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        <button
          onClick={goToPrevious}
          disabled={!canGoPrevious}
          className={`group flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            canGoPrevious
              ? 'hover:scale-105 shadow-sm hover:shadow-md'
              : 'cursor-not-allowed opacity-50'
          }`}
          style={{
            backgroundColor: canGoPrevious ? 'var(--primary-color)' : 'var(--bg-secondary)',
            color: canGoPrevious ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${canGoPrevious ? 'var(--primary-color)' : 'var(--border-color)'}`,
          }}
        >
          <svg 
            className={`w-3.5 h-3.5 mr-1.5 transition-transform duration-200 ${canGoPrevious ? 'group-hover:-translate-x-0.5' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex items-center space-x-4">
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--primary-color)' }}
            />
            <span>Page {currentPageIndex + 1} of {totalPages}</span>
          </div>
          {currentPageName && (
            <span 
              className="text-xs max-w-xs truncate font-medium text-center"
              style={{ color: 'var(--text-secondary)' }}
            >
              {currentPageName}
            </span>
          )}
        </div>

        <button
          onClick={goToNext}
          disabled={!canGoNext}
          className={`group flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            canGoNext
              ? 'hover:scale-105 shadow-sm hover:shadow-md'
              : 'cursor-not-allowed opacity-50'
          }`}
          style={{
            backgroundColor: canGoNext ? 'var(--primary-color)' : 'var(--bg-secondary)',
            color: canGoNext ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${canGoNext ? 'var(--primary-color)' : 'var(--border-color)'}`,
          }}
        >
          Next
          <svg 
            className={`w-3.5 h-3.5 ml-1.5 transition-transform duration-200 ${canGoNext ? 'group-hover:translate-x-0.5' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PageNavigation; 