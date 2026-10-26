import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject } from '@core/mock-data/domain/types';
export const handleSettings = (url: URL, method: string, body: JsonObject) => {
  const { pathname } = url;
  if (pathname === '/api/admin/settings/v1/general') {
    if (method === 'GET') return mock.success({ settings: mock.state.settings });
    if (method === 'PUT' || method === 'PATCH') {
      mock.state.settings = { ...mock.state.settings, ...body };
      mock.addActivity('Memperbarui pengaturan situs', 'Pengaturan umum', 'Pengaturan');
      return mock.success({ settings: mock.state.settings }, 'Pengaturan demo berhasil disimpan.');
    }
  }
  if (pathname === '/api/settings/v1/public' && method === 'GET') return mock.success(mock.state.settings);

  return null;
};
