import { RolesRepositoryImpl } from '@core/roles/infrastructure/roles.repository.impl';
import type { RolesRequest, RolesResponse } from './roles.interface';
import { DispatchRolesUseCase } from './roles.usecase';

export class RolesController {
  private readonly dispatchUseCase = new DispatchRolesUseCase(new RolesRepositoryImpl());

  handle(request: RolesRequest): RolesResponse {
    return this.dispatchUseCase.execute(request);
  }
}
