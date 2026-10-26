import type { LegacyUserRequest, LegacyUserResponse } from './legacyUser.interface';
import { LegacyUserRepository } from './legacyUser.repository';
import { LegacyUserCall } from './legacyUser.model';

export class DispatchLegacyUserUseCase {
  constructor(private readonly legacyUserRepository: LegacyUserRepository) {}

  execute(request: LegacyUserRequest): LegacyUserResponse {
    return this.legacyUserRepository.handle(new LegacyUserCall(request.url, request.method, request.body, request.headers));
  }
}
