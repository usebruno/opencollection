import React from 'react';
import { OpenCollectionCollection, OpenCollectionItem } from '../types';
import ContentLayout from '../layouts/ContentLayout';

const Overview = ({ collection, theme }: { collection: OpenCollectionCollection; theme: 'light' | 'dark' | 'auto' }) => {
  if (!collection) return null;

  const sectionHeadingStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: 'var(--text-primary)'
  };

  const tableHeaderStyle = {
    backgroundColor: 'var(--table-header-bg)',
    borderBottom: '1px solid var(--border-color)',
    padding: '0.75rem 1rem',
    textAlign: 'left' as const,
    fontWeight: '600',
    color: 'var(--text-primary)'
  };

  const tableCellStyle = {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--border-color)'
  };

  const tableContainerStyle = {
    border: '1px solid var(--border-color)',
    borderRadius: '0.375rem',
    overflow: 'hidden',
    backgroundColor: 'var(--background-color)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  };

  const itemCounts = collection.items?.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const leftColumnContent = (
    <>
      {collection.description && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={sectionHeadingStyle}>Description</h3>
          <div style={{ padding: '1rem', backgroundColor: 'var(--code-bg)', borderRadius: '0.375rem' }}>
            {collection.description}
          </div>
        </div>
      )}


      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={sectionHeadingStyle}>Collection Statistics</h3>
        <div style={tableContainerStyle}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Type</th>
                <th style={tableHeaderStyle}>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(itemCounts).map(([type, count]) => (
                <tr key={type}>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      textTransform: 'capitalize',
                      color: 'var(--text-primary)'
                    }}>
                      {type}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {count}
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <td style={{ ...tableCellStyle, fontWeight: '600' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total Items</span>
                </td>
                <td style={{ ...tableCellStyle, fontWeight: '600' }}>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {collection.items?.length || 0}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // Right column content - Environments
  const rightColumnContent = (
    <>
      {collection.environments && collection.environments.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={sectionHeadingStyle}>Environments</h3>
          <div style={tableContainerStyle}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Variables</th>
                </tr>
              </thead>
              <tbody>
                {collection.environments.map((env, index) => (
                  <tr key={index}>
                    <td style={tableCellStyle}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {env.name}
                      </span>
                      {env.description && (
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--text-secondary)',
                          marginTop: '0.25rem'
                        }}>
                          {env.description}
                        </div>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {env.variables?.length || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {collection.base && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={sectionHeadingStyle}>Base Configuration</h3>
          <div style={tableContainerStyle}>
            <table style={{ width: '100%' }}>
              <tbody>
                {collection.base.headers && collection.base.headers.length > 0 && (
                  <tr>
                    <td style={{ ...tableCellStyle, fontWeight: '500' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Headers</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {collection.base.headers.length}
                      </span>
                    </td>
                  </tr>
                )}
                {collection.base.variables && collection.base.variables.length > 0 && (
                  <tr>
                    <td style={{ ...tableCellStyle, fontWeight: '500' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Variables</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {collection.base.variables.length}
                      </span>
                    </td>
                  </tr>
                )}
                {collection.base.auth && (
                  <tr>
                    <td style={{ ...tableCellStyle, fontWeight: '500' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Authentication</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        Configured
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );

  return (
    <ContentLayout
      leftContent={leftColumnContent}
      rightContent={rightColumnContent}
      title="Collection Overview"
      theme={theme}
    />
  );
};

export default Overview; 