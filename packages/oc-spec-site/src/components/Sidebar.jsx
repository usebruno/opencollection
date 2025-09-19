import React from 'react'
import { useTheme } from '../theme/ThemeProvider'
import { cn } from '../theme'

const navItems = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'collection', label: 'Collection' },
  { 
    id: 'items', 
    label: 'Items',
    children: [
      { id: 'http-request', label: 'HTTP Request' },
      { id: 'graphql-request', label: 'GraphQL Request' },
      { id: 'grpc-request', label: 'gRPC Request' },
      { id: 'folder', label: 'Folder' },
      { id: 'script', label: 'Script' },
    ]
  },
  { id: 'base-config', label: 'Base Configuration' },
  { id: 'environments', label: 'Environments' },
  { 
    id: 'auth', 
    label: 'Authentication',
    children: [
      { id: 'auth-awsv4', label: 'AWS V4' },
      { id: 'auth-basic', label: 'Basic' },
      { id: 'auth-bearer', label: 'Bearer' },
      { id: 'auth-digest', label: 'Digest' },
      { id: 'auth-apikey', label: 'API Key' },
      { id: 'auth-ntlm', label: 'NTLM' },
      { id: 'auth-wsse', label: 'WSSE' },
    ]
  },
  { 
    id: 'request-body', 
    label: 'Request Body',
    children: [
      { id: 'raw-body', label: 'Raw Body' },
      { id: 'form-urlencoded', label: 'Form URL Encoded' },
      { id: 'multipart-form', label: 'Multipart Form' },
      { id: 'file-body', label: 'File Body' },
    ]
  },
  { id: 'variables', label: 'Variables' },
  { id: 'assertions', label: 'Assertions' },
  { id: 'scripts-lifecycle', label: 'Scripts & Lifecycle' },
]

function Sidebar({ activeSection, onNavigate }) {
  const theme = useTheme();
  const { colors, sidebar } = theme;
  
  const renderNavItem = (item, isChild = false) => {
    const isActive = activeSection === item.id
    
    return (
      <li key={item.id}>
        <a 
          href={`#${item.id}`}
          className={cn(
            'block px-2 py-1 rounded transition-all duration-150',
            isChild ? 'text-xs' : 'text-sm',
            isActive 
              ? `${colors.primary.light} ${colors.primary.text} font-semibold border-l-2 border-blue-500` 
              : `${colors.neutral.text} ${sidebar.hover} hover:text-gray-900`
          )}
          onClick={(e) => {
            e.preventDefault()
            onNavigate(item.id)
          }}
        >
          {item.label}
        </a>
        {item.children && (
          <ul className="ml-3 mt-0.5 space-y-0">
            {item.children.map(child => renderNavItem(child, true))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <aside className={cn(sidebar.width, sidebar.bg, sidebar.text, 'fixed left-0 top-0 h-screen overflow-y-auto border-r', colors.neutral.border)}>
      <div className="p-3">
        <h1 className={cn('text-lg font-semibold mb-3 pb-2 border-b', colors.neutral.border, 'text-gray-900')}>
          OpenCollection Spec
        </h1>
        <nav>
          <ul className="space-y-0">
            {navItems.map(item => renderNavItem(item))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar