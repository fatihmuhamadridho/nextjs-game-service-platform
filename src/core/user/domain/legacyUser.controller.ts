import { LegacyUserRepositoryImpl } from '@core/user/infrastructure/legacyUser.repository.impl';
import type { LegacyUserRequest, LegacyUserResponse } from './legacyUser.interface';
import { DispatchLegacyUserUseCase } from './legacyUser.usecase';

export class LegacyUserController {
  private readonly dispatchUseCase = new DispatchLegacyUserUseCase(new LegacyUserRepositoryImpl());

  handle(request: LegacyUserRequest): LegacyUserResponse {
    return this.dispatchUseCase.execute(request);
  }
}
