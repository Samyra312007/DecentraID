'use client';

import { useState } from 'react';

interface Role {
  id: string;
  name: string;
  description: string;
  members: string[];
}

const defaultRoles: Role[] = [
  { id: '1', name: 'Admin', description: 'Full system access', members: ['0x1234...5678'] },
  { id: '2', name: 'Editor', description: 'Can edit and create content', members: ['0x2345...6789'] },
  { id: '3', name: 'Viewer', description: 'Read-only access', members: ['0x3456...7890', '0x4567...8901'] },
];

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [showCreate, setShowCreate] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  const handleCreateRole = () => {
    if (!newRole.name) return;
    setRoles(prev => [...prev, { ...newRole, id: String(prev.length + 1), members: [] }]);
    setNewRole({ name: '', description: '' });
    setShowCreate(false);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>Role Management</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary text-sm">
          {showCreate ? 'Cancel' : '+ Add Role'}
        </button>
      </div>

      {showCreate && (
        <div className="p-4 rounded-xl mb-4 space-y-3" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
          <input
            type="text"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            className="input"
            placeholder="Role name"
          />
          <input
            type="text"
            value={newRole.description}
            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
            className="input"
            placeholder="Description"
          />
          <button onClick={handleCreateRole} className="btn-primary w-full">Create Role</button>
        </div>
      )}

      <div className="space-y-3">
        {roles.map(role => (
          <div key={role.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-hairline)' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold" style={{ color: 'var(--color-ink)' }}>{role.name}</h3>
              <span className="badge">{role.members.length} members</span>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>{role.description}</p>
            <div className="flex flex-wrap gap-2">
              {role.members.map((member, idx) => (
                <span key={idx} className="text-xs font-mono px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--color-surface-strong)' }}>
                  {member}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
