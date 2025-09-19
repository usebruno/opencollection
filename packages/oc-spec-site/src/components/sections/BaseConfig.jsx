import React from 'react'
import PropertyTable from '../PropertyTable'
import { useTheme } from '../../theme/ThemeProvider'

function BaseConfig({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const base = schema.properties.base;

  return (
    <section>
      <h2 className={typography.heading.h2}>Base Configuration</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{base.description}</p>
      <p className={`${typography.body.default} ${spacing.element}`}>Base configuration applies to all items in the collection and can be overridden at the folder or request level.</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable 
        properties={base.properties}
        order={Object.keys(base.properties)}
      />
    </section>
  )
}

export default BaseConfig