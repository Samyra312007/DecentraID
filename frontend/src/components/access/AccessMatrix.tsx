'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessMatrixProps {
  roles: string[];
  resources: string[];
  permissions: Record<string, Record<string, boolean>>;
}

export function AccessMatrix({ roles, resources, permissions }: AccessMatrixProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2.5 text-sm font-medium text-muted-foreground">Role / Resource</th>
                {resources.map(resource => (
                  <th key={resource} className="text-center p-2.5 text-sm font-medium text-muted-foreground">
                    {resource}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role} className="border-t border-border">
                  <td className="p-2.5 text-sm font-medium text-foreground">{role}</td>
                  {resources.map(resource => {
                    const hasAccess = permissions[role]?.[resource] || false;
                    return (
                      <td key={resource} className="text-center p-2.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'w-8 h-8',
                            hasAccess ? 'text-success hover:text-success/80' : 'text-muted-foreground hover:text-muted-foreground/80'
                          )}
                        >
                          {hasAccess ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
