import React from 'react';
import DataTable from './DataTable';

interface HeaderItem {
  name: string;
  value: string;
  enabled?: boolean;
  description?: string;
  uid?: string;
}

interface VarItem {
  name: string;
  value: string;
  enabled?: boolean;
  local?: boolean;
  uid?: string;
}

interface AssertionItem {
  name: string;
  value: string;
  enabled?: boolean;
  uid?: string;
}

interface FormItem {
  name: string;
  value: string;
  enabled?: boolean;
}

export const HeadersTable: React.FC<{ headers: HeaderItem[] }> = ({ headers }) => {
  const columns = [
    { key: 'name', label: 'Name', width: '25%' },
    { key: 'value', label: 'Value', width: '40%' },
    { key: 'description', label: 'Description', width: '25%' },
    {
      key: 'enabled',
      label: 'Status',
      width: '10%',
      render: (enabled: boolean) => (
        <span style={{
          display: 'inline-block',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          backgroundColor: enabled !== false ? 'var(--success-color, #10b981)' : 'var(--error-color, #ef4444)',
          color: 'white'
        }}>
          {enabled !== false ? 'Enabled' : 'Disabled'}
        </span>
      )
    }
  ];

  return (
    <DataTable
      title="Headers"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </svg>
      }
      columns={columns}
      data={headers}
      emptyMessage="No headers defined"
    />
  );
};

export const VarsTable: React.FC<{ vars: VarItem[] }> = ({ vars }) => {
  const columns = [
    { key: 'name', label: 'Name', width: '40%' },
    { key: 'value', label: 'Value', width: '45%' },
    {
      key: 'enabled',
      label: 'Status',
      width: '15%',
      render: (enabled: boolean) => (
        <span style={{
          display: 'inline-block',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          backgroundColor: enabled !== false ? 'var(--success-color, #10b981)' : 'var(--error-color, #ef4444)',
          color: 'white'
        }}>
          {enabled !== false ? 'Enabled' : 'Disabled'}
        </span>
      )
    }
  ];

  return (
    <DataTable
      title="Variables"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      }
      columns={columns}
      data={vars}
      emptyMessage="No variables defined"
    />
  );
};

export const AssertionsTable: React.FC<{ assertions: AssertionItem[] }> = ({ assertions }) => {
  const columns = [
    { key: 'name', label: 'Name', width: '40%' },
    { key: 'value', label: 'Value', width: '45%' },
    {
      key: 'enabled',
      label: 'Status',
      width: '15%',
      render: (enabled: boolean) => (
        <span style={{
          display: 'inline-block',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          backgroundColor: enabled !== false ? 'var(--success-color, #10b981)' : 'var(--error-color, #ef4444)',
          color: 'white'
        }}>
          {enabled !== false ? 'Enabled' : 'Disabled'}
        </span>
      )
    }
  ];

  return (
    <DataTable
      title="Assertions"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,11 12,14 22,4"></polyline>
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.55 1.24"></path>
        </svg>
      }
      columns={columns}
      data={assertions}
      emptyMessage="No assertions defined"
    />
  );
};

export const MultipartFormTable: React.FC<{ formData: FormItem[] }> = ({ formData }) => {
  const columns = [
    { key: 'name', label: 'Name', width: '40%' },
    { key: 'value', label: 'Value', width: '45%' },
    {
      key: 'enabled',
      label: 'Status',
      width: '15%',
      render: (enabled: boolean) => (
        <span style={{
          display: 'inline-block',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          backgroundColor: enabled !== false ? 'var(--success-color, #10b981)' : 'var(--error-color, #ef4444)',
          color: 'white'
        }}>
          {enabled !== false ? 'Enabled' : 'Disabled'}
        </span>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={formData}
      emptyMessage="No form data defined"
    />
  );
};

export const FormUrlEncodedTable: React.FC<{ formData: FormItem[] }> = ({ formData }) => {
  const columns = [
    { key: 'name', label: 'Name', width: '40%' },
    { key: 'value', label: 'Value', width: '45%' },
    {
      key: 'enabled',
      label: 'Status',
      width: '15%',
      render: (enabled: boolean) => (
        <span style={{
          display: 'inline-block',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          backgroundColor: enabled !== false ? 'var(--success-color, #10b981)' : 'var(--error-color, #ef4444)',
          color: 'white'
        }}>
          {enabled !== false ? 'Enabled' : 'Disabled'}
        </span>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={formData}
      emptyMessage="No form data defined"
    />
  );
}; 