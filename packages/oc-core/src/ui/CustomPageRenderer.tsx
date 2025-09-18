import React from 'react';
import { CustomPage } from '../types';
import ContentLayout from '../layouts/ContentLayout';

const CustomPageRenderer = ({ 
  pageName, 
  customPage, 
  content, 
  theme, 
  md,
  registerSectionRef 
}: { 
  pageName: string; 
  customPage?: CustomPage;
  content: string;
  theme: 'light' | 'dark' | 'auto';
  md: any;
  registerSectionRef: (id: string, ref: HTMLDivElement | null) => void;
}) => {
  const leftColumnContent = (
    <div className="custom-page-content">
      <div
        className="prose prose-headings:my-0 prose-headings:font-semibold prose-sm md:prose lg:prose-lg dark:prose-invert max-w-none markdown-documentation"
        dangerouslySetInnerHTML={{ __html: md.render(content) }}
      />
    </div>
  );

  const rightColumnContent = customPage?.consoleView ? (
    <div className="custom-page-console">
      {customPage.consoleView}
    </div>
  ) : (
    <div className="custom-page-info">
      <div style={{
        padding: '1.25rem',
        backgroundColor: 'var(--background-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Custom Page Information
        </h3>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Name: </span>
          <span>{pageName}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Content Source: </span>
          <span>{customPage?.contentPath ? 'External File' : 'Inline Content'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div id={`section-${pageName}`} ref={(ref) => registerSectionRef(pageName, ref)}>
      <ContentLayout
        title={pageName}
        badge="CUSTOM"
        badgeColor="custom"
        leftContent={leftColumnContent}
        rightContent={rightColumnContent}
        theme={theme}
      />
    </div>
  );
};

export default CustomPageRenderer; 