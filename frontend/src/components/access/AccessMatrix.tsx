'use client';

interface AccessMatrixProps {
  roles: string[];
  resources: string[];
  permissions: Record<string, Record<string, boolean>>;
}

export function AccessMatrix({ roles, resources, permissions }: AccessMatrixProps) {
  return (
    <div className="card overflow-x-auto">
      <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-5">Access Matrix</h2>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2.5 text-[13px] font-medium text-[var(--color-text-muted)]">Role / Resource</th>
            {resources.map(resource => (
              <th key={resource} className="text-center p-2.5 text-[13px] font-medium text-[var(--color-text-muted)]">
                {resource}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role} className="border-t border-[var(--color-border)]">
              <td className="p-2.5 text-[13px] font-medium text-[var(--color-text-primary)]">{role}</td>
              {resources.map(resource => {
                const hasAccess = permissions[role]?.[resource] || false;
                return (
                  <td key={resource} className="text-center p-2.5">
                    <button
                      className={`w-7 h-7 rounded flex items-center justify-center mx-auto text-[12px] transition-colors ${
                        hasAccess
                          ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                          : 'bg-white/[0.04] text-[var(--color-text-muted)]'
                      }`}
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
