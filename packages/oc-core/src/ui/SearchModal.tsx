import React, { useEffect } from 'react';

// Search Modal Component
const SearchModal = ({
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchInputRef,
  handleSearchResultSelect
}: {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Array<{id: string; name: string; path?: string; type: string}>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  handleSearchResultSelect: (result: {id: string; path?: string; type: string}) => void;
}) => {
  if (!isSearchOpen) return null;
  
  // Use useEffect to maintain focus on the input when typing
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen, searchQuery, searchInputRef]);
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        className="w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--background-color)' }}
        onClick={e => e.stopPropagation()}
      >

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="block w-full p-4 pl-10 text-sm focus:outline-none"
            style={{
              backgroundColor: 'var(--background-color)',
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border-color)'
            }}
            placeholder="Search endpoints, folders, and pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                handleSearchResultSelect(searchResults[0]);
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="px-2 py-1 text-xs font-semibold rounded" style={{ backgroundColor: 'var(--code-bg)', color: 'var(--text-secondary)' }}>ESC</kbd>
          </div>
        </div>
        

        <div className="max-h-96 overflow-y-auto" style={{ backgroundColor: 'var(--background-color)' }}>
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((result, index) => (
                <li 
                  key={`${result.id}-${index}`}
                  className="px-4 py-3 cursor-pointer hover:bg-opacity-10 flex items-center"
                  style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: index === 0 ? 'var(--table-header-bg)' : 'transparent',
                    color: 'var(--text-primary)'
                  }}
                  onClick={() => handleSearchResultSelect(result)}
                >
    
                  <span className="mr-3">
                    {result.type === 'folder' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    ) : result.type === 'page' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : result.type === 'script' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </span>
                  
    
                  <div>
                    <div className="font-medium">{result.name}</div>
                    {result.path && result.path !== result.name && (
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{result.path}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : searchQuery ? (
            <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              No results found for "{searchQuery}"
            </div>
          ) : (
            <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              Type to search for endpoints, folders, scripts, and pages
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 