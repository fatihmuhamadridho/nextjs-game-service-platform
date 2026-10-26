import { AdminUsersRepository } from '@core/user/domain/adminUsers.repository';
import type { AdminUsersRequest, AdminUsersResponse } from '@core/user/domain/adminUsers.interface';
import { handleAdminUsers } from './adminUsers.mock';

export class AdminUsersRepositoryImpl implements AdminUsersRepository {
  handle(request: AdminUsersRequest): AdminUsersResponse {
    return handleAdminUsers(request.url, request.method, request.body);
  }
}
