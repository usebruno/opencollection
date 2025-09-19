import React, { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface MinimalDataTableProps {
  data: any[];
  title?: string;
  columns: Column[];
  compact?: boolean;
}

export const MinimalDataTable: React.FC<MinimalDataTableProps> = ({
  data,
  title,
  columns,
  compact = true
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="minimal-table">
      {title && <h3 className="section-title">{title}</h3>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="table-value">{row[col.key] || '-'}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface CompactCodeViewProps {
  code?: string;
  language?: string;
  title?: string;
  tabs?: Array<{ id: string; label: string; content: string }>;
  copyButton?: boolean;
}

export const CompactCodeView: React.FC<CompactCodeViewProps> = ({
  code,
  language = 'text',
  title,
  tabs,
  copyButton = true
}) => {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightAllUnder(codeRef.current);
    }
  }, [activeTab, code, language]);

  const handleCopy = () => {
    const textToCopy = tabs ? tabs.find(t => t.id === activeTab)?.content : code;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayCode = tabs ? tabs.find(t => t.id === activeTab)?.content : code;

  return (
    <div className="compact-code-view">
      {(title || tabs) && (
        <div className="code-header">
          {title && !tabs && <h3 className="section-title">{title}</h3>}
          {tabs && (
            <div className="code-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`code-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          {copyButton && (
            <button className="copy-button" onClick={handleCopy}>
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      <div className="code-content">
        <pre ref={codeRef}>
          <code className={`language-${language}`}>
            {displayCode || ''}
          </code>
        </pre>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'warning' | 'error';
  text?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const statusConfig = {
    active: { color: '#16a34a', label: 'Active' },
    inactive: { color: '#6b7280', label: 'Inactive' },
    warning: { color: '#f97316', label: 'Warning' },
    error: { color: '#dc2626', label: 'Error' }
  };

  const config = statusConfig[status];

  return (
    <span 
      className="status-badge" 
      style={{ backgroundColor: config.color }}
    >
      {text || config.label}
    </span>
  );
};

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  tooltip,
  size = 'medium'
}) => {
  return (
    <button
      className={`icon-button icon-button-${size}`}
      onClick={onClick}
      title={tooltip}
    >
      {icon}
    </button>
  );
};

interface TabGroupProps {
  tabs: Array<{ id: string; label: string }>;
  defaultTab?: string;
  renderContent: (activeTab: string) => React.ReactNode;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  defaultTab,
  renderContent
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div className="tab-group">
      <div className="tab-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {renderContent(activeTab)}
      </div>
    </div>
  );
};