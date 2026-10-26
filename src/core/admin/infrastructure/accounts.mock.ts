import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject, AdminRecord } from '@core/mock-data/domain/types';
export const handleAdminAccounts = (url: URL, method: string, body: JsonObject) => {
  const { pathname } = url;
  if (pathname === '/api/admin/admin-users/v1/list' && method === 'GET') {
    return mock.success(mock.filterPagedList(mock.state.admins, url, 'admins'));
  }
  const adminMatch = pathname.match(/^\/api\/admin\/admin-users\/v1\/(create|update|delete|detail)(?:\/([^/]+))?$/);
  if (adminMatch) {
    const [, action, id] = adminMatch;
    if (action === 'detail' && method === 'GET' && id) {
      const admin = mock.state.admins.find((item) => item.id === id);
      return admin ? mock.success({ admin }) : mock.failure(404, 'ADMIN_NOT_FOUND', 'Admin demo tidak ditemukan.');
    }
    if (action === 'delete' && method === 'DELETE' && id) {
      return mock.deleteEntity(mock.state.admins, id)
        ? mock.success({ deleted: true })
        : mock.failure(404, 'ADMIN_NOT_FOUND', 'Admin demo tidak ditemukan.');
    }
    if (action === 'create' && method === 'POST') {
      const roleIds = Array.isArray(body.roleIds) ? body.roleIds.filter((value): value is string => typeof value === 'string') : [];
      const roleName = mock.stringValue(mock.state.roles.find((role) => role.id === roleIds[0])?.name, 'Admin');
      const admin = mock.mutateEntity<AdminRecord>(mock.state.admins, null, 'adm', {
        ...body,
        roleIds,
        role: roleName,
        status: mock.stringValue(body.status, 'ACTIVE'),
        lastActive: 'Belum pernah',
      });
      mock.addActivity('Menambahkan akun admin', admin.name, 'Pengguna');
      return mock.success({ admin }, 'Akun admin demo berhasil dibuat.');
    }
    if (action === 'update' && ['PUT', 'PATCH'].includes(method) && id) {
      const current = mock.state.admins.find((item) => item.id === id);
      if (!current) return mock.failure(404, 'ADMIN_NOT_FOUND', 'Admin demo tidak ditemukan.');
      const roleIds = Array.isArray(body.roleIds) ? body.roleIds.filter((value): value is string => typeof value === 'string') : current.roleIds;
      const roleName = mock.stringValue(mock.state.roles.find((role) => role.id === roleIds[0])?.name, current.role);
      const admin = mock.mutateEntity<AdminRecord>(mock.state.admins, id, 'adm', { ...body, roleIds, role: roleName });
      mock.addActivity('Memperbarui akun admin', admin.name, 'Pengguna');
      return mock.success({ admin }, 'Akun admin demo berhasil diperbarui.');
    }
  }

  return null;
};
