import { RolesRepository } from '@core/roles/domain/roles.repository';
import type { RolesRequest, RolesResponse } from '@core/roles/domain/roles.interface';
import { handleRoles } from './roles.mock';

export class RolesRepositoryImpl implements RolesRepository {
  handle(request: RolesRequest): RolesResponse {
    return handleRoles(request.url, request.method, request.body);
  }
}
