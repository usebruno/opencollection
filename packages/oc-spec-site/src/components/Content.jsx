import React from 'react'
import Introduction from './sections/Introduction'
import Collection from './sections/Collection'
import Items from './sections/Items'
import HttpRequest from './sections/HttpRequest'
import Folder from './sections/Folder'
import Script from './sections/Script'
import BaseConfig from './sections/BaseConfig'
import Environments from './sections/Environments'
import Auth from './sections/Auth'
import AuthType from './sections/AuthType'
import RequestBody from './sections/RequestBody'
import BodyType from './sections/BodyType'
import Variables from './sections/Variables'
import Assertions from './sections/Assertions'
import ScriptsLifecycle from './sections/ScriptsLifecycle'
import { useTheme } from '../theme/ThemeProvider'
import { cn } from '../theme'

function Content({ section, schema }) {
  const theme = useTheme();
  const { sidebar } = theme;
  const renderSection = () => {
    switch(section) {
      case 'introduction':
        return <Introduction />
      case 'collection':
        return <Collection schema={schema} />
      case 'items':
        return <Items />
      case 'http-request':
        return <HttpRequest schema={schema} />
      case 'graphql-request':
        return <GraphQLRequest />
      case 'grpc-request':
        return <GrpcRequest />
      case 'folder':
        return <Folder schema={schema} />
      case 'script':
        return <Script schema={schema} />
      case 'base-config':
        return <BaseConfig schema={schema} />
      case 'environments':
        return <Environments schema={schema} />
      case 'auth':
        return <Auth />
      case 'auth-awsv4':
      case 'auth-basic':
      case 'auth-bearer':
      case 'auth-digest':
      case 'auth-apikey':
      case 'auth-ntlm':
      case 'auth-wsse':
        return <AuthType authType={section} schema={schema} />
      case 'request-body':
        return <RequestBody />
      case 'raw-body':
      case 'form-urlencoded':
      case 'multipart-form':
      case 'file-body':
        return <BodyType bodyType={section} schema={schema} />
      case 'variables':
        return <Variables schema={schema} />
      case 'assertions':
        return <Assertions schema={schema} />
      case 'scripts-lifecycle':
        return <ScriptsLifecycle schema={schema} />
      default:
        return <Introduction />
    }
  }

  return (
    <main className={cn(sidebar.margin, 'flex-1 min-h-screen')}>
      <div className="max-w-4xl p-6">
        {renderSection()}
      </div>
    </main>
  )
}

function GraphQLRequest() {
  const theme = useTheme();
  const { typography, spacing } = theme;
  
  return (
    <section>
      <h2 className={typography.heading.h2}>GraphQL Request</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>GraphQL request configuration for queries and mutations.</p>
      <p className={`${theme.colors.neutral.textMuted} italic`}>GraphQL request schema is currently being defined.</p>
    </section>
  )
}

function GrpcRequest() {
  const theme = useTheme();
  const { typography, spacing } = theme;
  
  return (
    <section>
      <h2 className={typography.heading.h2}>gRPC Request</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>gRPC request configuration for service calls.</p>
      <p className={`${theme.colors.neutral.textMuted} italic`}>gRPC request schema is currently being defined.</p>
    </section>
  )
}

export default Content