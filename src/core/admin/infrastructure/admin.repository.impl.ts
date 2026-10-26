import { AdminRepository } from '@core/admin/domain/admin.repository';
import type { AdminRequest, AdminResponse } from '@core/admin/domain/admin.interface';
import { handleAdminAccounts } from './accounts.mock';

export class AdminRepositoryImpl implements AdminRepository {
  handle(request: AdminRequest): AdminResponse {
    return handleAdminAccounts(request.url, request.method, request.body);
  }
}
