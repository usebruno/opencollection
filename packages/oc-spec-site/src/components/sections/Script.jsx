import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function Script({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const script = schema.$defs.Script;
  
  const example = {
    type: "script",
    script: "// Shared utility functions\nexport function generateTimestamp() {\n    return new Date().toISOString();\n}"
  };

  return (
    <section>
      <h2 className={typography.heading.h2}>Script</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{script.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable 
        properties={script.properties}
        order={Object.keys(script.properties)}
        required={script.required}
      />
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
      <CodeBlock code={convertToYaml(example)} language="yaml" />
    </section>
  )
}

export default Script