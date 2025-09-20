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
    <div className={`p-4 ${theme}`}>
      <div>
        <h1 className="font-bold text-2xl">{title}</h1>
        {badge && (
          <div className="flex items-center gap-2">
            <span className={`${badgeColor || ''}`}>
              {badge}
            </span>
            {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
          </div>
        )}
        {!badge && subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}

        {description && (
          <div className="prose prose-headings:my-0 prose-headings:font-semibold prose-sm md:prose lg:prose-lg dark:prose-invert max-w-none markdown-documentation">
            <div dangerouslySetInnerHTML={{ __html: new MarkdownIt().render(description) }} />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="w-full md:w-1/2">
          {leftContent}
        </div>
        <div className="w-full md:w-1/2">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default ContentLayout; 