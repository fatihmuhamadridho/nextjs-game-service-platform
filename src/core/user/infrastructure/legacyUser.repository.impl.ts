import { LegacyUserRepository } from '@core/user/domain/legacyUser.repository';
import type { LegacyUserRequest, LegacyUserResponse } from '@core/user/domain/legacyUser.interface';
import { handleLegacyUser } from './legacyUser.mock';

export class LegacyUserRepositoryImpl implements LegacyUserRepository {
  handle(request: LegacyUserRequest): LegacyUserResponse {
    return handleLegacyUser(request.url, request.method);
  }
}
