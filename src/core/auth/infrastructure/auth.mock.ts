import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject, UserRecord } from '@core/mock-data/domain/types';
export const handleAuth = (url: URL, method: string, body: JsonObject) => {
  const { pathname } = url;
  if (pathname === '/api/auth/v1/login' && method === 'POST') {
    const identifier = mock.stringValue(body.identifier).trim();
    const accountType = identifier.toLowerCase().startsWith('admin') ? 'ADMIN' : 'CUSTOMER';
    mock.state.session = { accountType, identifier };
    return mock.success({ accountType }, 'Login demo berhasil.');
  }
  if (pathname === '/api/auth/v1/register' && method === 'POST') {
    const user: UserRecord = {
      id: mock.nextId('usr'),
      name: mock.stringValue(body.name, 'Pengguna demo'),
      username: mock.stringValue(body.username, 'user.demo'),
      email: mock.stringValue(body.email, 'user@example.test'),
      whatsapp: '',
      tier: 'Bronze',
      status: 'ACTIVE',
      orderCount: 0,
      totalSpend: 0,
      joinedAt: mock.now(),
    };
    mock.state.users.unshift(user);
    mock.state.session = { accountType: 'CUSTOMER', identifier: user.username };
    return mock.success({ user: { id: user.id, name: user.name, username: user.username, email: user.email } }, 'Akun demo berhasil dibuat.');
  }
  if (pathname === '/api/auth/v1/forgot-password' && method === 'POST') {
    return mock.success({}, 'Jika email terdaftar, instruksi pemulihan demo tersedia.');
  }
  if (pathname === '/api/auth/v1/reset-password' && method === 'POST') {
    return mock.success({}, 'Password demo berhasil diubah. Silakan masuk kembali.');
  }
  if (pathname === '/api/auth/v1/session' && method === 'GET') {
    const requestedType = url.searchParams.get('accountType');
    if (mock.state.session && requestedType === mock.state.session.accountType) {
      return mock.success(mock.profileForSession(mock.state.session.accountType, mock.state.session.identifier));
    }
    return mock.failure(401, 'UNAUTHORIZED', 'Sesi demo tidak ditemukan.', { 'X-Account-Type': requestedType ?? '' });
  }
  if (pathname === '/api/auth/v1/refresh-token' || pathname === '/api/admin/auth/v1/refresh-token') {
    const expectedType = pathname.startsWith('/api/admin/') ? 'ADMIN' : 'CUSTOMER';
    return mock.state.session?.accountType === expectedType
      ? mock.success({}, 'Sesi demo diperbarui.')
      : mock.failure(401, 'UNAUTHORIZED', 'Sesi demo berakhir.');
  }
  if (pathname === '/api/auth/v1/logout' || pathname === '/api/admin/auth/v1/logout') {
    mock.state.session = null;
    return mock.success({}, 'Logout demo berhasil.');
  }
  return null;
};
