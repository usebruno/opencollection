import React from 'react';
import DataTable from './DataTable';

interface EnvironmentVariable {
  name: string;
  value: string;
  enabled?: boolean;
  local?: boolean;
  uid?: string;
}

interface Environment {
  name: string;
  uid?: string;
  variables: EnvironmentVariable[];
}

interface EnvironmentVariablesSectionProps {
  environments?: Array<{
    name: string;
    variables: Array<{
      name: string;
      value: string;
      enabled: boolean;
      type: string;
      secret?: boolean;
    }>;
    uid?: string;
  }>;
  activeEnvironmentUid?: string;
}

const EnvironmentVariablesSection: React.FC<EnvironmentVariablesSectionProps> = ({ 
  environments, 
  activeEnvironmentUid 
}) => {
  if (!environments || environments.length === 0) {
    return null;
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      width: '40%'
    },
    {
      key: 'value',
      label: 'Value',
      width: '45%'
    },
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
    <div>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'var(--text-primary)'
      }}>
        Environment Variables
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {environments.map((env, envIndex) => {
          const envId = env.uid || `env-${envIndex}`;
          const isActive = activeEnvironmentUid === envId;

          return (
            <DataTable
              key={envId}
              title={env.name}
              icon={
                isActive ? (
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    backgroundColor: 'var(--success-color, #10b981)',
                    color: 'white'
                  }}>
                    Active
                  </span>
                ) : undefined
              }
              columns={columns}
              data={env.variables}
              maxVisibleRows={8}
              emptyMessage={`No variables defined for ${env.name}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EnvironmentVariablesSection; 