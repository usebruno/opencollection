import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function ScriptsLifecycle({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const scripts = schema.$defs.Scripts;
  
  const example = {
    preRequest: "// Set timestamp\nbru.setVar('timestamp', new Date().getTime());",
    postResponse: "// Extract auth token\nconst token = res.body.token;\nbru.setVar('authToken', token);",
    tests: "// Test response\ntest('Status is 200', () => {\n    expect(res.status).to.equal(200);\n});",
    hooks: "// Custom lifecycle hooks"
  };

  return (
    <section>
      <h2 className={typography.heading.h2}>Scripts & Lifecycle</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{scripts.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Script Types</h3>
      <PropertyTable 
        properties={scripts.properties}
        order={Object.keys(scripts.properties)}
      />
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Execution Lifecycle</h3>
      <ol className={`list-decimal list-inside space-y-2 ${spacing.element} ${typography.body.default}`}>
        <li><strong>Pre-Request</strong> - Executed before the request is sent. Use for setting up authentication, generating dynamic values, etc.</li>
        <li><strong>Request Sent</strong> - The actual HTTP request is made</li>
        <li><strong>Post-Response</strong> - Executed after receiving the response. Use for extracting values, setting variables, etc.</li>
        <li><strong>Tests</strong> - Run test assertions against the response</li>
      </ol>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
      <CodeBlock code={convertToYaml(example)} language="yaml" />
    </section>
  )
}

export default ScriptsLifecycle