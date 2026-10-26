import { AdminRepositoryImpl } from '@core/admin/infrastructure/admin.repository.impl';
import type { AdminRequest, AdminResponse } from './admin.interface';
import { DispatchAdminUseCase } from './admin.usecase';

export class AdminController {
  private readonly dispatchAdminUseCase = new DispatchAdminUseCase(new AdminRepositoryImpl());

  handle(request: AdminRequest): AdminResponse {
    return this.dispatchAdminUseCase.execute(request);
  }
}
