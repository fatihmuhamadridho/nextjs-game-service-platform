import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject } from '@core/mock-data/domain/types';
export const handleActivityLogs = (url: URL, method: string, _body: JsonObject) => {
  void _body;
  const { pathname } = url;
  if (pathname === '/api/admin/activity-logs/v1/list' && method === 'GET') {
    return mock.success(mock.filterPagedList(mock.state.activityLogs, url, 'activityLogs'));
  }

  return null;
};
