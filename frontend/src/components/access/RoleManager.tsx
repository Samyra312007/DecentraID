'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
          <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? 'Cancel' : '+ Add Role'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showCreate && (
          <div className="p-4 rounded-lg bg-muted mb-4 space-y-3">
            <Input
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="Role name"
            />
            <Input
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              placeholder="Description"
            />
            <Button onClick={handleCreateRole} className="w-full">Create Role</Button>
          </div>
        )}

        <div className="space-y-3">
          {roles.map(role => (
            <div key={role.id} className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">{role.name}</h3>
                <Badge variant="secondary">{role.members.length} members</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
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
