import React, { useState } from 'react';
import OpenCollectionPlayground from './OpenCollectionPlayground';

const FileCollectionLoader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [theme] = useState<'light' | 'dark' | 'auto'>('light');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">

      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Collection Loader
          </h1>
          <div className="flex items-center gap-4">
            <label htmlFor="collection-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Load Collection File:
            </label>
            <input
              id="collection-file"
              type="file"
              accept=".json,.yml,.yaml"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100
                         dark:file:bg-blue-900 dark:file:text-blue-300
                         dark:hover:file:bg-blue-800"
            />
            {selectedFile && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Selected: {selectedFile.name} ({selectedFile.type || 'unknown type'})
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Supports JSON collections and YAML collections following the OpenCollection schema.
          </p>
        </div>
      </div>


      <div className="flex-1">
        {selectedFile ? (
          <OpenCollectionPlayground
            collection={selectedFile}
            theme={theme}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="mt-2 text-sm font-medium">No collection loaded</h3>
              <p className="mt-1 text-sm">Select a JSON or YAML collection file to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileCollectionLoader; 