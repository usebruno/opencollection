import React, { useState } from 'react';
import { HttpRequest } from '../../types';
import CodeEditor from '../CodeEditor';
import Tabs from '../Tabs/Tabs';

interface RequestPaneProps {
  item: HttpRequest;
  onItemChange: (item: HttpRequest) => void;
}

const RequestPane: React.FC<RequestPaneProps> = ({ item, onItemChange }) => {
  const [activeTab, setActiveTab] = useState('params');

  const handleParamChange = (index: number, field: 'name' | 'value' | 'enabled', value: any) => {
    const updatedParams = [...(item.params || [])];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    onItemChange({ ...item, params: updatedParams });
  };

  const handleHeaderChange = (index: number, field: 'name' | 'value' | 'disabled', value: any) => {
    const updatedHeaders = [...(item.headers || [])];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    onItemChange({ ...item, headers: updatedHeaders });
  };

  const addParam = () => {
    const newParams = [...(item.params || []), { name: '', value: '', enabled: true, type: 'query' as const }];
    onItemChange({ ...item, params: newParams });
  };

  const addHeader = () => {
    const newHeaders = [...(item.headers || []), { name: '', value: '', disabled: false }];
    onItemChange({ ...item, headers: newHeaders });
  };

  const removeParam = (index: number) => {
    const updatedParams = (item.params || []).filter((_, i) => i !== index);
    onItemChange({ ...item, params: updatedParams });
  };

  const removeHeader = (index: number) => {
    const updatedHeaders = (item.headers || []).filter((_, i) => i !== index);
    onItemChange({ ...item, headers: updatedHeaders });
  };

  const renderParams = () => (
          <div className="py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Query Parameters
                </span>
                <button
                  onClick={addParam}
                  className="px-3 py-1 text-xs rounded border hover:bg-opacity-80 transition-colors"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    borderColor: 'var(--primary-color)',
                    color: 'white'
                  }}
                >
                  Add Parameter
                </button>
              </div>
              
              {(item.params || []).length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  No parameters defined. Click "Add Parameter" to add one.
                </div>
              ) : (
                (item.params || []).map((param, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={param.enabled !== false}
                      onChange={(e) => handleParamChange(index, 'enabled', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => handleParamChange(index, 'name', e.target.value)}
                      placeholder="Key"
                      className="flex-1 px-2 py-1 text-sm border rounded"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-2 py-1 text-sm border rounded"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {param.type || 'query'}
                    </span>
                    <button
                      onClick={() => removeParam(index)}
                      className="px-2 py-1 text-xs rounded hover:bg-opacity-80 transition-colors"
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
  );

  const renderHeaders = () => (
          <div className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Headers
                </span>
                <button
                  onClick={addHeader}
                  className="px-3 py-1 text-xs rounded border hover:bg-opacity-80 transition-colors"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    borderColor: 'var(--primary-color)',
                    color: 'white'
                  }}
                >
                  Add Header
                </button>
              </div>
              
              {(item.headers || []).length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  No headers defined. Click "Add Header" to add one.
                </div>
              ) : (
                (item.headers || []).map((header, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={!header.disabled}
                      onChange={(e) => handleHeaderChange(index, 'disabled', !e.target.checked)}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={header.name}
                      onChange={(e) => handleHeaderChange(index, 'name', e.target.value)}
                      placeholder="Header"
                      className="flex-1 px-2 py-1 text-sm border rounded"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-2 py-1 text-sm border rounded"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      onClick={() => removeHeader(index)}
                      className="px-2 py-1 text-xs rounded hover:bg-opacity-80 transition-colors"
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
  );

  const renderBody = () => (
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Body Type:
                  </span>
                  <select
                    value={
                      !item.body ? 'none' :
                      'type' in item.body ? item.body.type :
                      Array.isArray(item.body) ? 'form-urlencoded' : 'none'
                    }
                    onChange={(e) => {
                      const bodyType = e.target.value;
                      if (bodyType === 'none') {
                        onItemChange({ ...item, body: null });
                      } else if (['json', 'text', 'xml', 'sparql'].includes(bodyType)) {
                        onItemChange({ 
                          ...item, 
                          body: { type: bodyType as any, data: '' }
                        });
                      } else if (bodyType === 'form-urlencoded') {
                        onItemChange({ 
                          ...item, 
                          body: []
                        });
                      }
                    }}
                    className="px-2 py-1 text-sm border rounded"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="none">None</option>
                    <option value="json">JSON</option>
                    <option value="text">Text</option>
                    <option value="xml">XML</option>
                    <option value="form-urlencoded">Form URL Encoded</option>
                  </select>
                </div>
              </div>
              
              {!item.body ? (
                <div className="text-center py-8 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  No body content. Select a body type to add content.
                </div>
              ) : 'data' in item.body && typeof item.body.data === 'string' ? (
                <CodeEditor
                  value={item.body.data}
                  onChange={(value) => {
                    if ('data' in item.body!) {
                      onItemChange({
                        ...item,
                        body: { ...item.body, data: value }
                      });
                    }
                  }}
                  language={item.body.type === 'json' ? 'json' : item.body.type === 'xml' ? 'xml' : 'text'}
                  height="300px"
                />
              ) : Array.isArray(item.body) ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Form Data
                    </span>
                    <button
                      onClick={() => {
                        const newFormData = [...(item.body as any[] || []), { name: '', value: '', enabled: true }];
                        onItemChange({ ...item, body: newFormData });
                      }}
                      className="px-3 py-1 text-xs rounded border hover:bg-opacity-80 transition-colors"
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)',
                        color: 'white'
                      }}
                    >
                      Add Field
                    </button>
                  </div>
                  
                  {(item.body as any[]).length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                      No form fields defined. Click "Add Field" to add one.
                    </div>
                  ) : (
                    (item.body as any[]).map((field: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={field.enabled !== false}
                          onChange={(e) => {
                            const updatedBody = [...(item.body as any[])];
                            updatedBody[index] = { ...updatedBody[index], enabled: e.target.checked };
                            onItemChange({ ...item, body: updatedBody });
                          }}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={field.name || ''}
                          onChange={(e) => {
                            const updatedBody = [...(item.body as any[])];
                            updatedBody[index] = { ...updatedBody[index], name: e.target.value };
                            onItemChange({ ...item, body: updatedBody });
                          }}
                          placeholder="Key"
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                        />
                        <input
                          type="text"
                          value={field.value || ''}
                          onChange={(e) => {
                            const updatedBody = [...(item.body as any[])];
                            updatedBody[index] = { ...updatedBody[index], value: e.target.value };
                            onItemChange({ ...item, body: updatedBody });
                          }}
                          placeholder="Value"
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                        />
                        <button
                          onClick={() => {
                            const updatedBody = (item.body as any[]).filter((_, i) => i !== index);
                            onItemChange({ ...item, body: updatedBody });
                          }}
                          className="px-2 py-1 text-xs rounded hover:bg-opacity-80 transition-colors"
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  Unsupported body type
                </div>
              )}
            </div>
          </div>
  );

  const renderAuth = () => (
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Authentication
                </span>
                <select
                  value={item.auth?.type || 'none'}
                  onChange={(e) => {
                    const authType = e.target.value;
                    if (authType === 'none') {
                      onItemChange({ ...item, auth: undefined });
                    } else {
                      onItemChange({ 
                        ...item, 
                        auth: { type: authType as any }
                      });
                    }
                  }}
                  className="px-2 py-1 text-sm border rounded"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="none">No Auth</option>
                  <option value="basic">Basic Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="apikey">API Key</option>
                  <option value="digest">Digest Auth</option>
                  <option value="awsv4">AWS Signature v4</option>
                </select>
              </div>
              
              {!item.auth ? (
                <div className="text-center py-8 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  No authentication configured. Select an auth type to configure.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Type: {item.auth.type}
                    </span>
                  </div>
                  
                  {item.auth.type === 'basic' && (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                          Username:
                        </label>
                        <input
                          type="text"
                          value={item.auth.username || ''}
                          onChange={(e) => {
                            onItemChange({
                              ...item,
                              auth: { ...item.auth!, username: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                          Password:
                        </label>
                        <input
                          type="password"
                          value={item.auth.password || ''}
                          onChange={(e) => {
                            onItemChange({
                              ...item,
                              auth: { ...item.auth!, password: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                          placeholder="Enter password"
                        />
                      </div>
                    </>
                  )}
                  
                  {item.auth.type === 'bearer' && (
                    <div className="flex items-center gap-2">
                      <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                        Token:
                      </label>
                      <input
                        type="text"
                        value={item.auth.token || ''}
                        onChange={(e) => {
                          onItemChange({
                            ...item,
                            auth: { ...item.auth!, token: e.target.value }
                          });
                        }}
                        className="flex-1 px-2 py-1 text-sm border rounded"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                        placeholder="Enter bearer token"
                      />
                    </div>
                  )}
                  
                  {item.auth.type === 'apikey' && (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                          Key:
                        </label>
                        <input
                          type="text"
                          value={item.auth.key || ''}
                          onChange={(e) => {
                            onItemChange({
                              ...item,
                              auth: { ...item.auth!, key: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                          placeholder="Enter API key name"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                          Value:
                        </label>
                        <input
                          type="text"
                          value={item.auth.value || ''}
                          onChange={(e) => {
                            onItemChange({
                              ...item,
                              auth: { ...item.auth!, value: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                          placeholder="Enter API key value"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                          Add to:
                        </label>
                        <select
                          value={item.auth.placement || 'header'}
                          onChange={(e) => {
                            onItemChange({
                              ...item,
                              auth: { ...item.auth!, placement: e.target.value }
                            });
                          }}
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                        >
                          <option value="header">Header</option>
                          <option value="query">Query Parameter</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  {!['basic', 'bearer', 'apikey'].includes(item.auth.type) && (
                    <div className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                      Configuration for {item.auth.type} auth is not yet implemented
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
  );

  const renderScripts = () => (
          <div className="p-4">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Pre-request Script
                </h4>
                <CodeEditor
                  value={item.scripts?.preRequest || ''}
                  onChange={(value) => {
                    const scripts = item.scripts || {};
                    onItemChange({
                      ...item,
                      scripts: { ...scripts, preRequest: value }
                    });
                  }}
                  language="javascript"
                  height="150px"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Post-response Script
                </h4>
                <CodeEditor
                  value={item.scripts?.postResponse || ''}
                  onChange={(value) => {
                    const scripts = item.scripts || {};
                    onItemChange({
                      ...item,
                      scripts: { ...scripts, postResponse: value }
                    });
                  }}
                  language="javascript"
                  height="150px"
                />
              </div>


            </div>
          </div>
  );

  const renderTests = () => (
          <div className="p-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Tests
              </h4>
              <CodeEditor
                value={item.scripts?.tests || ''}
                onChange={(value) => {
                  const scripts = item.scripts || {};
                  onItemChange({
                    ...item,
                    scripts: { ...scripts, tests: value }
                  });
                }}
                language="javascript"
                height="400px"
              />
            </div>
          </div>
  );

  const tabs = [
    { id: 'params', label: 'Params', contentIndicator: item.params?.length || undefined, content: renderParams() },
    { id: 'headers', label: 'Headers', contentIndicator: item.headers?.length || undefined, content: renderHeaders() },
    { id: 'body', label: 'Body', content: renderBody() },
    { id: 'auth', label: 'Auth', content: renderAuth() },
    { id: 'scripts', label: 'Scripts', content: renderScripts() },
    { id: 'tests', label: 'Tests', content: renderTests() }
  ];

  return (
    <div className="h-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default RequestPane; 