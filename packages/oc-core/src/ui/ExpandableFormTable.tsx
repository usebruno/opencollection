import React, { useState } from 'react';

interface FormItem {
  name: string;
  value: string;
  enabled?: boolean;
  description?: string;
  uid?: string;
}

interface ExpandableFormTableProps {
  items: FormItem[];
  title: string;
  icon: React.ReactNode;
  theme: 'light' | 'dark' | 'auto';
  maxVisibleRows?: number;
}

const ExpandableFormTable: React.FC<ExpandableFormTableProps> = ({
  items,
  title,
  icon,
  theme,
  maxVisibleRows = 10
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLotsOfItems = items.length > maxVisibleRows;

  const toggleExpansion = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="table-container" style={{
      border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '10px 16px',
        background: 'var(--table-header-bg, rgba(0, 0, 0, 0.1))',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {icon}
        {title}
      </div>
      <div className="relative">
        <div className={`overflow-hidden ${!isExpanded && hasLotsOfItems ? 'max-h-[350px]' : ''}`}>
          <table className="form-table" style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr>
                <th style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--table-header-bg, rgba(0, 0, 0, 0.05))'
                }}>Name</th>
                <th style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--table-header-bg, rgba(0, 0, 0, 0.05))'
                }}>Value</th>
                <th style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--table-header-bg, rgba(0, 0, 0, 0.05))'
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className={item.enabled === false ? 'disabled-row' : ''} style={{
                  borderBottom: index < (items.length || 0) - 1 ? '1px solid var(--border-color)' : 'none',
                }}>
                  <td style={{
                    padding: '10px 16px',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }}>{item.name}</td>
                  <td style={{
                    padding: '10px 16px',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }}>{item.value}</td>
                  <td style={{
                    padding: '10px 16px'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500,
                      backgroundColor: item.enabled !== false ? 'var(--success-bg, #10b981)' : 'var(--error-bg, #ef4444)',
                      color: 'white'
                    }}>
                      {item.enabled !== false ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        

        {hasLotsOfItems && !isExpanded && (
          <div>
            <div 
              className="absolute bottom-0 left-0 right-0 h-20" 
              style={{
                background: 'linear-gradient(to bottom, transparent, var(--background-color))',
                pointerEvents: 'none'
              }}
            />
            <div className="flex justify-center absolute bottom-0 left-0 right-0">
              <button
                onClick={toggleExpansion}
                className="mt-2 mb-2 px-4 py-1 text-sm rounded-full flex items-center gap-1 hover:bg-opacity-80 transition-colors"
                style={{
                  backgroundColor: 'var(--background-dark)',
                  border: "1px solid var(--border-dark)",
                  color: 'white'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                Show All {items.length} Items
              </button>
            </div>
          </div>
        )}
        
        
        {hasLotsOfItems && isExpanded && (
          <div className="flex justify-center">
            <button
              onClick={toggleExpansion}
              className="mt-2 mb-2 px-4 py-1 text-sm rounded-full flex items-center gap-1 hover:bg-opacity-80 transition-colors"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              Collapse
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandableFormTable; 