import OpenCollection from './core/OpenCollection';
import FileCollectionLoader from './core/FileCollectionLoader';
import Sidebar from './ui/Sidebar';

import './styles/index.css';

export {
  OpenCollection,
  FileCollectionLoader,
  Sidebar,
};

export * from './types';
export * from './hooks';
export { 
  SinglePageRenderer, 
  CodeEditor, 
  RequestRunner, 
  RequestHeader as RequestHeaderComponent,
  RequestPane,
  ResponsePane 
} from './ui';
export { 
  requestRunner, 
  RequestRunner as RequestRunnerClass,
  getGlobalVariables,
  clearGlobalVariables 
} from './runner';

// Server-side exports
export { renderPlayground } from './server';
export type { ServerRenderOptions } from './server';
export { playgroundHandler } from './express';
export type { PlaygroundHandlerOptions } from './express'; 