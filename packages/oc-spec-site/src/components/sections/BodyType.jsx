import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { formatBodyTypeName, getBodySchemaName } from '../../utils/schemaHelpers'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function BodyType({ bodyType, schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const schemaName = getBodySchemaName(bodyType);
  const body = schema.$defs[schemaName];
  
  const getBodyExample = (type) => {
    const examples = {
      'raw-body': {
        type: "json",
        data: '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
      },
      'form-urlencoded': [
        { name: "username", value: "john_doe", enabled: true },
        { name: "password", value: "secret123", enabled: true }
      ],
      'multipart-form': [
        { name: "file", type: "file", value: "/path/to/file.pdf", enabled: true },
        { name: "description", type: "text", value: "File description", enabled: true }
      ],
      'file-body': [
        { filePath: "/path/to/upload.jpg", contentType: "image/jpeg", selected: true }
      ]
    };
    
    return examples[type];
  };

  const renderSchema = () => {
    if (bodyType === 'raw-body') {
      return (
        <PropertyTable 
          properties={body.properties}
          order={Object.keys(body.properties)}
          required={body.required}
        />
      );
    }
    
    if (body.items) {
      return (
        <>
          <p className={`${typography.body.default} ${spacing.element}`}>This body type is an array of items with the following structure:</p>
          <PropertyTable 
            properties={body.items.properties}
            order={Object.keys(body.items.properties)}
            required={body.items.required}
          />
        </>
      );
    }
    
    return (
      <PropertyTable 
        properties={body.properties}
        order={Object.keys(body.properties)}
        required={body.required}
      />
    );
  };

  const example = getBodyExample(bodyType);

  return (
    <section>
      <h2 className={typography.heading.h2}>{formatBodyTypeName(bodyType)}</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{body.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Schema</h3>
      {renderSchema()}
      
      {example && (
        <>
          <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
          <CodeBlock code={convertToYaml(example)} language="yaml" />
        </>
      )}
    </section>
  )
}

export default BodyType