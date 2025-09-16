import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  maxHeight?: string;
  className?: string;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  title,
  badge,
  maxHeight = '400px',
  className = '',
  showLineNumbers = false
}) => {
  const getBadgeStyles = (variant: string = 'primary') => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em'
    };

    const variantStyles = {
      primary: {
        backgroundColor: 'var(--primary-color, #3b82f6)',
        color: 'white'
      },
      secondary: {
        backgroundColor: 'var(--secondary-color, #6b7280)',
        color: 'white'
      },
      success: {
        backgroundColor: 'var(--success-color, #10b981)',
        color: 'white'
      },
      warning: {
        backgroundColor: 'var(--warning-color, #f59e0b)',
        color: 'white'
      },
      error: {
        backgroundColor: 'var(--error-color, #ef4444)',
        color: 'white'
      }
    };

    return { ...baseStyles, ...variantStyles[variant as keyof typeof variantStyles] };
  };

  const lines = code.split('\n');

  return (
    <div 
      className={`bruno-code-block ${className}`}
      style={{
        backgroundColor: 'var(--background-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {(title || badge) && (
        <div 
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--code-header-bg, var(--table-header-bg, var(--card-header-bg, var(--background-color))))',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}
        >
          {title && (
            <span>{title}</span>
          )}
          
          {badge && (
            <span style={getBadgeStyles(badge.variant)}>
              {badge.text}
            </span>
          )}
        </div>
      )}

      <div 
        style={{
          maxHeight: maxHeight,
          overflow: 'auto',
          backgroundColor: 'var(--code-bg, var(--background-color))',
        }}
      >
        <pre 
          style={{
            margin: 0,
            padding: '16px',
            fontSize: '13px',
            lineHeight: '1.5',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            color: 'var(--code-text, var(--text-primary))',
            backgroundColor: 'transparent',
            overflow: 'visible',
            whiteSpace: 'pre' as const,
            wordWrap: 'normal' as const
          }}
        >
          {showLineNumbers ? (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td 
                      style={{
                        padding: '0 12px 0 0',
                        textAlign: 'right',
                        color: 'var(--text-secondary)',
                        userSelect: 'none',
                        fontSize: '12px',
                        verticalAlign: 'top',
                        minWidth: '40px'
                      }}
                    >
                      {index + 1}
                    </td>
                    <td style={{ padding: 0, width: '100%', verticalAlign: 'top' }}>
                      <code 
                        className={`language-${language}`}
                        style={{ 
                          backgroundColor: 'transparent',
                          padding: 0,
                          fontSize: 'inherit',
                          fontFamily: 'inherit'
                        }}
                      >
                        {line || ' '}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code 
              className={`language-${language}`}
              style={{ 
                backgroundColor: 'transparent',
                padding: 0,
                fontSize: 'inherit',
                fontFamily: 'inherit'
              }}
            >
              {code}
            </code>
          )}
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock; 