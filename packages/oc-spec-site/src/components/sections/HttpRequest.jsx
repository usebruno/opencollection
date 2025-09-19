import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'

function HttpRequest({ schema }) {
  const httpRequest = schema.$defs.HttpRequest;
  const theme = useTheme();
  const { typography, spacing } = theme;
  
  const example = `type: http
name: Get Users
url: "{{baseUrl}}/api/users"
method: GET
headers:
  - name: Authorization
    value: "Bearer {{token}}"
params:
  - name: page
    value: "1"
    type: query`;

  return (
    <section>
      <h2 className={typography.heading.h2}>HTTP Request</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{httpRequest.description}</p>
      
      <h3 className={typography.heading.h3}>Properties</h3>
      <PropertyTable 
        properties={httpRequest.properties}
        order={Object.keys(httpRequest.properties)}
        required={httpRequest.required}
      />
      
      <h3 className={typography.heading.h3}>Example</h3>
      <CodeBlock code={example} language="yaml" />
    </section>
  )
}

export default HttpRequest