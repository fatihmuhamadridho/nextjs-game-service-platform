import type { JsonObject } from '@core/mock-data/domain/types';

export const roles: JsonObject[] = [
  {
    id: 'role-super',
    name: 'Super Admin',
    code: 'SUPER_ADMIN',
    status: 'ACTIVE',
    description: 'Akses penuh seluruh fitur',
    adminCount: 1,
    permissions: ['dashboard', 'orders', 'catalog', 'users', 'content', 'finance', 'settings'],
    protected: true,
  },
  {
    id: 'role-ops',
    name: 'Operasional',
    code: 'OPERATIONS',
    status: 'ACTIVE',
    description: 'Mengelola pesanan dan katalog',
    adminCount: 1,
    permissions: ['dashboard', 'orders', 'catalog'],
    protected: false,
  },
  {
    id: 'role-content',
    name: 'Konten',
    code: 'CONTENT',
    status: 'ACTIVE',
    description: 'Mengelola informasi storefront',
    adminCount: 0,
    permissions: ['dashboard', 'content'],
    protected: false,
  },
];
