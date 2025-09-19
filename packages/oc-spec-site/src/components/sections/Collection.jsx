import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'

function Collection({ schema }) {
  const properties = schema.properties;
  const theme = useTheme();
  const { typography, spacing } = theme;
  
  const example = `name: My API Collection
description: A collection of API requests
environments: []
items: []
base: {}
docs: Documentation for this collection`;

  return (
    <section>
      <h2 className={typography.heading.h2}>Collection</h2>
      <p className={`${typography.body.default} ${spacing.section}`}>
        The root object of an OpenCollection specification. This contains all the information about the API collection.
      </p>
      
      <h3 className={typography.heading.h3}>Properties</h3>
      <div className={spacing.section}>
        <PropertyTable 
          properties={properties}
          order={['name', 'description', 'environments', 'items', 'base', 'docs']}
        />
      </div>
      
      <h3 className={typography.heading.h3}>Example</h3>
      <CodeBlock code={example} language="yaml" />
    </section>
  )
}

export default Collection