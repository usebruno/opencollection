import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { formatAuthTypeName, getAuthSchemaName } from '../../utils/schemaHelpers'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function AuthType({ authType, schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const schemaName = getAuthSchemaName(authType);
  const auth = schema.$defs[schemaName];
  
  const getAuthExample = (type) => {
    const examples = {
      'auth-awsv4': {
        type: "awsv4",
        accessKeyId: "AKIAIOSFODNN7EXAMPLE",
        secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        region: "us-east-1",
        service: "execute-api"
      },
      'auth-basic': {
        type: "basic",
        username: "admin",
        password: "password123"
      },
      'auth-bearer': {
        type: "bearer",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },
      'auth-digest': {
        type: "digest",
        username: "user",
        password: "pass"
      },
      'auth-apikey': {
        type: "apikey",
        key: "X-API-Key",
        value: "your-api-key-here",
        placement: "header"
      },
      'auth-ntlm': {
        type: "ntlm",
        username: "user",
        password: "pass",
        domain: "DOMAIN"
      },
      'auth-wsse': {
        type: "wsse",
        username: "user",
        password: "pass"
      }
    };
    
    return examples[type];
  };

  const example = getAuthExample(authType);

  return (
    <section>
      <h2 className={typography.heading.h2}>{formatAuthTypeName(authType)}</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{auth.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable 
        properties={auth.properties}
        order={Object.keys(auth.properties)}
        required={auth.required}
      />
      
      {example && (
        <>
          <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
          <CodeBlock code={convertToYaml(example)} language="yaml" />
        </>
      )}
    </section>
  )
}

export default AuthType