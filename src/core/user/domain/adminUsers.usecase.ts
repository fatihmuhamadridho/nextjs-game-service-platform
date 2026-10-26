import type { AdminUsersRequest, AdminUsersResponse } from './adminUsers.interface';
import { AdminUsersRepository } from './adminUsers.repository';
import { AdminUsersCall } from './adminUsers.model';

export class DispatchAdminUsersUseCase {
  constructor(private readonly adminUsersRepository: AdminUsersRepository) {}

  execute(request: AdminUsersRequest): AdminUsersResponse {
    return this.adminUsersRepository.handle(new AdminUsersCall(request.url, request.method, request.body, request.headers));
  }
}
