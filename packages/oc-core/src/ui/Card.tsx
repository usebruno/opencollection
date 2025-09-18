import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  badge,
  children,
  className = '',
  headerActions
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

  return (
    <div 
      className={`bruno-card ${className}`}
      style={{
        backgroundColor: 'var(--background-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {(title || subtitle || badge || headerActions) && (
        <div 
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--card-header-bg, var(--background-color))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            {title && (
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                {title}
              </h3>
            )}
            
            {badge && (
              <span style={getBadgeStyles(badge.variant)}>
                {badge.text}
              </span>
            )}
            
            {subtitle && (
              <span style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                fontFamily: 'monospace'
              }}>
                {subtitle}
              </span>
            )}
          </div>
          
          {headerActions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div style={{ padding: '0' }}>
        {children}
      </div>
    </div>
  );
};

export default Card; 