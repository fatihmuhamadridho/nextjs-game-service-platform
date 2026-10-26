import type { AdminRequest, AdminResponse } from './admin.interface';
import { AdminRepository } from './admin.repository';
import { AdminCall } from './admin.model';

export class DispatchAdminUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  execute(request: AdminRequest): AdminResponse {
    return this.adminRepository.handle(new AdminCall(request.url, request.method, request.body, request.headers));
  }
}
