import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import './styles/index.css';
import OpenCollectionPlayground from './core/OpenCollectionPlayground';
import { OpenCollectionCollection } from './types';

export interface OpenCollectionPlaygroundOptions {
  target: HTMLElement;
  opencollection: any;
  theme?: 'light' | 'dark' | 'auto';
  logo?: string;
  customPages?: Array<{
    name: string;
    content?: string;
    contentPath?: string;
  }>;
  hideSidebar?: boolean;
  hideHeader?: boolean;
  onlyShow?: string[];
}

export class OpenCollectionPlaygroundRenderer {
  private root: Root | null = null;
  private options: OpenCollectionPlaygroundOptions;

  constructor(options: OpenCollectionPlaygroundOptions) {
    this.options = options;
    this.init();
  }

  private init() {
    if (!this.options.target) {
      throw new Error('Target element is required');
    }

    this.root = createRoot(this.options.target);
    this.render();
  }

  private convertCollection(opencollection: any): OpenCollectionCollection {
    if (typeof opencollection === 'string') {
      try {
        return JSON.parse(opencollection) as OpenCollectionCollection;
      } catch (error) {
        console.error('Failed to parse collection JSON:', error);
        throw new Error('Invalid JSON format for OpenCollection');
      }
    }

    return opencollection as OpenCollectionCollection;
  }

  private createLogoElement(): React.ReactNode {
    if (!this.options.logo) return undefined;
    
    return React.createElement('img', {
      src: this.options.logo,
      alt: 'Logo',
      style: { height: '32px', width: 'auto' }
    });
  }

  private render() {
    if (!this.root) return;

    const collection = this.convertCollection(this.options.opencollection);
    
    const playgroundElement = React.createElement(OpenCollectionPlayground, {
      collection,
      theme: this.options.theme || 'light',
      logo: this.createLogoElement(),
      customPages: this.options.customPages,
      hideSidebar: this.options.hideSidebar,
      hideHeader: this.options.hideHeader,
      onlyShow: this.options.onlyShow
    });

    this.root.render(playgroundElement);
  }

  public updateCollection(opencollection: any) {
    this.options.opencollection = opencollection;
    this.render();
  }

  public updateTheme(theme: 'light' | 'dark' | 'auto') {
    this.options.theme = theme;
    this.render();
  }

  public destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}

export default OpenCollectionPlaygroundRenderer;

if (typeof window !== 'undefined') {
  (window as any).OpenCollectionPlayground = OpenCollectionPlaygroundRenderer;
} 