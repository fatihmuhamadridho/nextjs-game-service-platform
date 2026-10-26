import { handleAuth } from './auth.mock';
import { AuthRepository } from '@core/auth/domain/auth.repository';
import type { AuthRequest, AuthResponse } from '@core/auth/domain/auth.interface';

export class AuthRepositoryImpl implements AuthRepository {
  handle(request: AuthRequest): AuthResponse {
    return handleAuth(request.url, request.method, request.body);
  }
}
