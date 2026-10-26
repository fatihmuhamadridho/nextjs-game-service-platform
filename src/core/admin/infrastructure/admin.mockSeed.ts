import type { AdminRecord } from '@core/mock-data/domain/types';
import { ago } from '@core/mock-data/infrastructure/time';

export const admins: AdminRecord[] = [
  {
    id: 'adm-001',
    username: 'admin.demo',
    name: 'Demo Admin',
    email: 'admin@example.test',
    role: 'Super Admin',
    roleIds: ['role-super'],
    status: 'ACTIVE',
    lastActive: ago(12),
  },
  {
    id: 'adm-002',
    username: 'operator.demo',
    name: 'Demo Operator',
    email: 'operator@example.test',
    role: 'Admin',
    roleIds: ['role-ops'],
    status: 'ACTIVE',
    lastActive: ago(90),
  },
];
