import React from 'react'
import { useTheme } from '../../theme/ThemeProvider'

function RequestBody() {
  const theme = useTheme();
  const { typography, spacing } = theme;
  return (
    <section>
      <h2 className={typography.heading.h2}>Request Body</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>The request body can be one of several types, depending on the content being sent.</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Supported Body Types</h3>
      <ul className={`list-disc list-inside space-y-2 ${spacing.element} ${typography.body.default}`}>
        <li><strong>Raw Body</strong> - JSON, XML, Text, or SPARQL content</li>
        <li><strong>Form URL Encoded</strong> - application/x-www-form-urlencoded data</li>
        <li><strong>Multipart Form</strong> - multipart/form-data for file uploads and mixed content</li>
        <li><strong>File Body</strong> - Direct file upload</li>
      </ul>
      
      <p className={`${typography.body.default} ${spacing.element}`}>Click on any body type in the sidebar to see its detailed schema.</p>
    </section>
  )
}

export default RequestBody