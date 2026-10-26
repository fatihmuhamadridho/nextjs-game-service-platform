import type { SettingsRequest, SettingsResponse } from './settings.interface';
import { SettingsRepository } from './settings.repository';
import { SettingsCall } from './settings.model';

export class DispatchSettingsUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  execute(request: SettingsRequest): SettingsResponse {
    return this.settingsRepository.handle(new SettingsCall(request.url, request.method, request.body, request.headers));
  }
}
