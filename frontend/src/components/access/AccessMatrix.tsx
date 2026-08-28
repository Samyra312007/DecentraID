'use client';

interface AccessMatrixProps {
  roles: string[];
  resources: string[];
  permissions: Record<string, Record<string, boolean>>;
}

export function AccessMatrix({ roles, resources, permissions }: AccessMatrixProps) {
  return (
    <div className="card overflow-x-auto">
      <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-ink)' }}>Access Matrix</h2>
      
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-3 text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Role / Resource</th>
            {resources.map(resource => (
              <th key={resource} className="text-center p-3 text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                {resource}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role} className="border-t" style={{ borderColor: 'var(--color-hairline-soft)' }}>
              <td className="p-3 text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{role}</td>
              {resources.map(resource => {
                const hasAccess = permissions[role]?.[resource] || false;
                return (
                  <td key={resource} className="text-center p-3">
                    <button
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-colors ${
                        hasAccess ? 'text-white' : ''
                      }`}
                      style={{
                        backgroundColor: hasAccess ? 'var(--color-semantic-up)' : 'var(--color-surface-strong)',
                        color: hasAccess ? 'white' : 'var(--color-muted)',
                      }}
                    >
                      {hasAccess ? '✓' : '—'}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
