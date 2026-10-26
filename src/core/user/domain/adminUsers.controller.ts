import { AdminUsersRepositoryImpl } from '@core/user/infrastructure/adminUsers.repository.impl';
import type { AdminUsersRequest, AdminUsersResponse } from './adminUsers.interface';
import { DispatchAdminUsersUseCase } from './adminUsers.usecase';

export class AdminUsersController {
  private readonly dispatchUseCase = new DispatchAdminUsersUseCase(new AdminUsersRepositoryImpl());

  handle(request: AdminUsersRequest): AdminUsersResponse {
    return this.dispatchUseCase.execute(request);
  }
}
