import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-graphql';

interface BodyCardProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

const BodyCard: React.FC<BodyCardProps> = ({
  children,
  className = '',
  language = 'text'
}) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightAllUnder(codeRef.current);
    }
  }, [children, language]);

  return (
    <div className={`bruno-body-card ${className}`}>
      
      <div 
        style={{
          backgroundColor: 'var(--background-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}
      >
        
        <div 
          style={{
            maxHeight: '400px',
            overflow: 'auto',
          }}
        >
          <pre 
            ref={codeRef}
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
            <code className={`language-${language}`}>
              {children}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BodyCard; 