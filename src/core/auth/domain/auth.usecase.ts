import type { AuthRequest, AuthResponse } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { AuthCall } from './auth.model';

export class DispatchAuthUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(request: AuthRequest): AuthResponse {
    return this.authRepository.handle(new AuthCall(request.url, request.method, request.body, request.headers));
  }
}
