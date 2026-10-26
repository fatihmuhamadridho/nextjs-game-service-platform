import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject, UserRecord } from '@core/mock-data/domain/types';
export const handleAdminUsers = (url: URL, method: string, body: JsonObject) => {
  const { pathname } = url;
  if (pathname === '/api/admin/users/v1/list' && method === 'GET') {
    return mock.success(mock.filterPagedList(mock.state.users, url, 'users'));
  }
  const userMatch = pathname.match(/^\/api\/admin\/users\/v1\/(create|update|delete|detail)(?:\/([^/]+))?$/);
  if (userMatch) {
    const [, action, id] = userMatch;
    if (action === 'list') return mock.success(mock.pagedPayload(mock.state.users, url, 'users'));
    if (action === 'detail' && method === 'GET' && id) {
      const user = mock.state.users.find((item) => item.id === id);
      return user ? mock.success({ user }) : mock.failure(404, 'USER_NOT_FOUND', 'Pengguna demo tidak ditemukan.');
    }
    if (action === 'delete' && method === 'DELETE' && id) {
      return mock.deleteEntity(mock.state.users, id)
        ? mock.success({ deleted: true })
        : mock.failure(404, 'USER_NOT_FOUND', 'Pengguna demo tidak ditemukan.');
    }
    if (action === 'create' && method === 'POST') {
      const user = mock.mutateEntity<UserRecord>(mock.state.users, null, 'usr', {
        ...body,
        whatsapp: mock.stringValue(body.whatsapp),
        tier: mock.stringValue(body.tier, 'Bronze'),
        status: mock.stringValue(body.status, 'ACTIVE'),
        orderCount: 0,
        totalSpend: 0,
        joinedAt: mock.now(),
      });
      mock.addActivity('Menambahkan pengguna', user.name, 'Pengguna');
      return mock.success({ user }, 'Pengguna demo berhasil dibuat.');
    }
    if (action === 'update' && ['PUT', 'PATCH'].includes(method) && id) {
      const current = mock.state.users.find((item) => item.id === id);
      if (!current) return mock.failure(404, 'USER_NOT_FOUND', 'Pengguna demo tidak ditemukan.');
      const user = mock.mutateEntity<UserRecord>(mock.state.users, id, 'usr', body);
      mock.addActivity('Memperbarui pengguna', user.name, 'Pengguna');
      return mock.success({ user }, 'Pengguna demo berhasil diperbarui.');
    }
  }

  return null;
};
