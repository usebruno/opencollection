import React from 'react'
import { useTheme } from '../../theme/ThemeProvider'

function Auth() {
  const theme = useTheme();
  const { typography, spacing } = theme;
  return (
    <section>
      <h2 className={typography.heading.h2}>Authentication</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>OpenCollection supports multiple authentication methods. Each auth type has its own specific configuration.</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Supported Authentication Types</h3>
      <ul className={`list-disc list-inside space-y-2 ${spacing.element} ${typography.body.default}`}>
        <li><strong>AWS V4</strong> - AWS Signature Version 4 authentication</li>
        <li><strong>Basic</strong> - Basic HTTP authentication with username and password</li>
        <li><strong>Bearer</strong> - Bearer token authentication</li>
        <li><strong>Digest</strong> - HTTP Digest authentication</li>
        <li><strong>API Key</strong> - API key in header or query parameter</li>
        <li><strong>NTLM</strong> - NT LAN Manager authentication</li>
        <li><strong>WSSE</strong> - WS-Security authentication</li>
      </ul>
      
      <p className={`${typography.body.default} ${spacing.element}`}>Click on any authentication type in the sidebar to see its detailed configuration.</p>
    </section>
  )
}

export default Auth