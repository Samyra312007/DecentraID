'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

const roleIcon: Record<string, string> = {
  Admin: 'admin_panel_settings',
  Editor: 'edit_note',
  Viewer: 'visibility',
};

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Role Management</CardTitle>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-2 rounded bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90"
          >
            <span className="material-symbols-outlined text-base">
              {showCreate ? 'close' : 'add'}
            </span>
            {showCreate ? 'Cancel' : 'Add Role'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {showCreate && (
          <div className="mb-4 space-y-3 rounded-lg border border-border bg-surface-container p-4">
            <Input
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="Role name"
              className="h-10"
            />
            <Input
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              placeholder="Description"
              className="h-10"
            />
            <button
              onClick={handleCreateRole}
              className="w-full rounded bg-primary-container py-2.5 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90"
            >
              Create Role
            </button>
          </div>
        )}

        <div className="space-y-3">
          {roles.map(role => (
            <div key={role.id} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <span className="material-symbols-outlined text-[20px] text-primary">
                      {roleIcon[role.name] || 'group'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{role.name}</h3>
                </div>
                <Badge variant="secondary">{role.members.length} members</Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{role.description}</p>
              <div className="flex flex-wrap gap-2">
                {role.members.map((member, idx) => (
                  <Badge key={idx} variant="outline" className="font-mono text-xs">
                    {member}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
