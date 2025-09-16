import React from 'react';
import MarkdownIt from 'markdown-it';

const ContentLayout = ({
  title,
  subtitle,
  description,
  badge,
  badgeColor,
  leftContent,
  rightContent,
  theme
}: {
  title: string;
  subtitle?: React.ReactNode;
  description?: string;
  badge?: string;
  badgeColor?: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  theme: 'light' | 'dark' | 'auto';
}) => {
  return (
    <div className={`content-layout ${theme}`}>
      <div className="content-header">
        <h1 className="content-title">{title}</h1>
        {badge && (
          <div className="content-badge-container">
            <span className={`content-badge ${badgeColor || ''}`}>
              {badge}
            </span>
            {subtitle && <span className="content-subtitle">{subtitle}</span>}
          </div>
        )}
        {!badge && subtitle && <div className="content-subtitle">{subtitle}</div>}

        {description && (
          <div className="prose prose-headings:my-0 prose-headings:font-semibold prose-sm md:prose lg:prose-lg dark:prose-invert max-w-none markdown-documentation">
            <div dangerouslySetInnerHTML={{ __html: new MarkdownIt().render(description) }} />
          </div>
        )}
      </div>

      <div className="content-grid">
        <div className="content-main">
          {leftContent}
        </div>
        <div className="content-side">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default ContentLayout; 