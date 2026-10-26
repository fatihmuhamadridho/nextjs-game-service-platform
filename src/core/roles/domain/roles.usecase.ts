import type { RolesRequest, RolesResponse } from './roles.interface';
import { RolesRepository } from './roles.repository';
import { RolesCall } from './roles.model';

export class DispatchRolesUseCase {
  constructor(private readonly rolesRepository: RolesRepository) {}

  execute(request: RolesRequest): RolesResponse {
    return this.rolesRepository.handle(new RolesCall(request.url, request.method, request.body, request.headers));
  }
}
