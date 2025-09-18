import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language = 'json', 
  readOnly = false, 
  height = '300px'
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Detect current theme from document classes
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);
  
  const handleChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div style={{ 
      height, 
      width: '100%',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto'
          },
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor; 