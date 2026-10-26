import { AuthRepositoryImpl } from '@core/auth/infrastructure/auth.repository.impl';
import type { AuthRequest, AuthResponse } from './auth.interface';
import { DispatchAuthUseCase } from './auth.usecase';

export class AuthController {
  private readonly dispatchAuthUseCase = new DispatchAuthUseCase(new AuthRepositoryImpl());

  handle(request: AuthRequest): AuthResponse {
    return this.dispatchAuthUseCase.execute(request);
  }
}
