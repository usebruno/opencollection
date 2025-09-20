import React from 'react';

export interface RequestHeader {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RequestParam {
  name: string;
  value: string;
  description?: string;
  type: 'query' | 'path';
  enabled?: boolean;
}

export interface RawBody {
  type: 'json' | 'text' | 'xml' | 'sparql';
  data: string;
}

export interface FormUrlEncodedBody extends Array<{
  name: string;
  value: string;
  description?: string;
  enabled?: boolean;
}> {}

export interface MultipartFormBody extends Array<{
  name: string;
  type: 'text' | 'file';
  value: string | string[];
  description?: string;
  enabled?: boolean;
}> {}

export interface FileBody extends Array<{
  filePath: string;
  contentType: string;
  selected: boolean;
}> {}

export type RequestBody = RawBody | FormUrlEncodedBody | MultipartFormBody | FileBody | null;

export interface Auth {
  type: 'awsv4' | 'basic' | 'wsse' | 'bearer' | 'digest' | 'ntlm' | 'apikey';
  [key: string]: any;
}

export interface Scripts {
  preRequest?: string;
  postResponse?: string;
  tests?: string;
  hooks?: string;
}

export interface Variable {
  name: string;
  value?: string | null;
  description?: string;
  disabled?: boolean;
  transient?: boolean;
  default?: string | null;
}

export interface Assertion {
  expression: string;
  operator: string;
  value: string;
  enabled?: boolean;
  description?: string;
}

export interface HttpRequest {
  type: 'http';
  name?: string;
  url?: string;
  method?: string;
  params?: RequestParam[];
  headers?: RequestHeader[];
  body?: RequestBody;
  auth?: Auth;
  scripts?: Scripts;
  variables?: Variable[];
  assertions?: Assertion[];
  docs?: string;
}

export interface Folder {
  type: 'folder';
  name?: string;
  items?: OpenCollectionItem[];
  headers?: RequestHeader[];
  auth?: Auth;
  variables?: Variable[];
  scripts?: Scripts;
  docs?: string;
}

export interface Script {
  type: 'script';
  name?: string;
  script?: string;
}

export type OpenCollectionItem = HttpRequest | Folder | Script;

export interface Environment {
  name: string;
  description?: string;
  variables?: Variable[];
}

export interface BaseConfiguration {
  headers?: RequestHeader[];
  auth?: Auth;
  variables?: Variable[];
  scripts?: Scripts;
}

export interface OpenCollectionCollection {
  name?: string;
  description?: string;
  environments?: Environment[];
  items?: OpenCollectionItem[];
  base?: BaseConfiguration;
  docs?: string;
}

export interface CustomPage {
  name: string;
  content?: string;
  contentPath?: string;
  consoleView?: React.ReactNode;
}

export interface OpenCollectionProps {
  collection: OpenCollectionCollection | string | File;
  theme?: 'light' | 'dark' | 'auto';
  logo?: React.ReactNode;
  customPages?: CustomPage[];
  hideSidebar?: boolean;
  hideHeader?: boolean;
  onlyShow?: string[];
  proxyUrl?: string;
} 