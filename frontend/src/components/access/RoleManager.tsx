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
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Role Management</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary text-[13px]">
          {showCreate ? 'Cancel' : '+ Add Role'}
        </button>
      </div>

      {showCreate && (
        <div className="p-4 rounded-lg bg-white/[0.04] mb-4 space-y-3">
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
          <div key={role.id} className="p-4 rounded-lg border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">{role.name}</h3>
              <span className="badge badge-neutral">{role.members.length} members</span>
            </div>
            <p className="text-[13px] text-[var(--color-text-muted)] mb-3">{role.description}</p>
            <div className="flex flex-wrap gap-2">
              {role.members.map((member, idx) => (
                <span key={idx} className="text-[12px] font-mono px-2 py-1 rounded bg-white/[0.06] text-[var(--color-text-muted)]">
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
