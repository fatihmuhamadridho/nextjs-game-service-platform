import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject } from '@core/mock-data/domain/types';
export const handleRoles = (url: URL, method: string, body: JsonObject) => {
  const { pathname } = url;
  if (pathname === '/api/admin/roles/v1/list' && method === 'GET') {
    return mock.success({ ...mock.filterPagedList(mock.state.roles, url, 'roles'), permissions: mock.permissionCatalog });
  }
  const roleMatch = pathname.match(/^\/api\/admin\/roles\/v1\/(create|update|delete)(?:\/([^/]+))?$/);
  if (roleMatch) {
    const [, action, id] = roleMatch;
    if (action === 'delete' && method === 'DELETE') {
      if (!id) return mock.failure(404, 'ROLE_NOT_FOUND', 'Role demo tidak ditemukan.');
      const role = mock.state.roles.find((item) => item.id === id);
      if (!role) return mock.failure(404, 'ROLE_NOT_FOUND', 'Role demo tidak ditemukan.');
      if (role.protected === true) return mock.failure(409, 'ROLE_PROTECTED', 'Role bawaan tidak dapat dihapus pada demo.');
      mock.deleteEntity(mock.state.roles, id);
      mock.addActivity('Menghapus role', mock.stringValue(role.name, id), 'Pengguna');
      return mock.success({ deleted: true });
    }
    if (action === 'create' && method === 'POST') {
      const role = mock.mutateEntity(mock.state.roles, null, 'role', {
        ...body,
        code: mock.stringValue(
          body.code,
          mock
            .stringValue(body.name, 'ROLE')
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, '_')
        ),
        status: mock.stringValue(body.status, 'ACTIVE'),
        adminCount: 0,
        protected: false,
      });
      mock.addActivity('Menambahkan role', mock.stringValue(role.name), 'Pengguna');
      return mock.success({ role }, 'Role demo berhasil dibuat.');
    }
    if (action === 'update' && ['PUT', 'PATCH'].includes(method) && id) {
      const role = mock.state.roles.find((item) => item.id === id);
      if (!role) return mock.failure(404, 'ROLE_NOT_FOUND', 'Role demo tidak ditemukan.');
      const updated = mock.mutateEntity(mock.state.roles, id, 'role', body);
      mock.addActivity('Memperbarui role', mock.stringValue(updated.name), 'Pengguna');
      return mock.success({ role: updated }, 'Role demo berhasil diperbarui.');
    }
  }

  return null;
};
