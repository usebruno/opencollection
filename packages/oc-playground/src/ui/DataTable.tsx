import React, { useState } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  icon?: React.ReactNode;
  maxVisibleRows?: number;
  emptyMessage?: string;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  title,
  icon,
  maxVisibleRows = 10,
  emptyMessage = 'No data available',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLotsOfRows = data.length > maxVisibleRows;
  const displayData = hasLotsOfRows && !isExpanded ? data.slice(0, maxVisibleRows) : data;

  const toggleExpansion = () => {
    setIsExpanded(prev => !prev);
  };

  if (!data.length) {
    return (
      <div 
        className={`bruno-table-empty ${className}`}
        style={{
          backgroundColor: 'var(--background-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '40px 20px',
          textAlign: 'center' as const,
          color: 'var(--text-secondary)'
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div 
      className={`bruno-table ${className}`}
      style={{
        backgroundColor: 'var(--background-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {(title || icon) && (
        <div 
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--table-header-bg, var(--card-header-bg, var(--background-color)))',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}
        >
          {icon}
          {title}
        </div>
      )}

      <div className="relative">
        <div className={`overflow-hidden ${hasLotsOfRows && !isExpanded ? 'max-h-[400px]' : ''}`}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse' as const
          }}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left' as const,
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: 'var(--table-header-bg, rgba(0, 0, 0, 0.02))',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      width: column.width
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  style={{
                    borderBottom: rowIndex < displayData.length - 1 ? '1px solid var(--border-color)' : 'none',
                    backgroundColor: 'var(--background-color)'
                  }}
                >
                  {columns.map((column) => (
                    <td 
                      key={column.key}
                      style={{
                        padding: '12px 16px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        verticalAlign: 'top',
                        fontFamily: column.key === 'name' || column.key === 'value' ? 'monospace' : 'inherit'
                      }}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasLotsOfRows && !isExpanded && (
          <div>
            <div 
              className="absolute bottom-0 left-0 right-0 h-16" 
              style={{
                background: 'linear-gradient(to bottom, transparent, var(--background-color))',
                pointerEvents: 'none' as const
              }}
            />
            <div className="flex justify-center absolute bottom-0 left-0 right-0">
              <button
                onClick={toggleExpansion}
                className="bruno-expand-button"
                style={{
                  margin: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg, var(--border-color))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-color)';
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                Show All {data.length} Items
              </button>
            </div>
          </div>
        )}

        {hasLotsOfRows && isExpanded && (
          <div className="flex justify-center" style={{ padding: '12px' }}>
            <button
              onClick={toggleExpansion}
              className="bruno-collapse-button"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid var(--primary-color)',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

export default DataTable; 