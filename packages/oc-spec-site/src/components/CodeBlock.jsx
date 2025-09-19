import React, { useEffect, useRef } from 'react'

function CodeBlock({ code, language = 'json' }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div className={`my-2`}>
      <pre className="rounded-lg overflow-hidden text-2xs" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
        <code ref={codeRef} className={`language-${language}`} style={{ fontSize: 'inherit', fontFamily: 'inherit' }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

export default CodeBlock