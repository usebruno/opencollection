import React from 'react'
import { useTheme } from '../../theme/ThemeProvider'

function Items() {
  const theme = useTheme();
  const { typography, spacing } = theme;

  return (
    <section>
      <h2 className={typography.heading.h2}>Items</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>Items represent the different types of elements that can be included in a collection. Each item can be one of the following types:</p>
      
      <ul className={`list-disc list-inside space-y-2 ${spacing.element} ${typography.body.default}`}>
        <li><strong>HTTP Request</strong> - Standard HTTP/REST API requests</li>
        <li><strong>GraphQL Request</strong> - GraphQL queries and mutations</li>
        <li><strong>gRPC Request</strong> - gRPC service calls</li>
        <li><strong>Folder</strong> - Organizational containers for grouping items</li>
        <li><strong>Script</strong> - JavaScript modules for shared functionality</li>
      </ul>
      
      <p className={`${typography.body.default} ${spacing.element}`}>Click on any item type in the sidebar to see its detailed schema.</p>
    </section>
  )
}

export default Items