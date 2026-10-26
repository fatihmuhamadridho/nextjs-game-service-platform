import { SettingsRepositoryImpl } from '@core/settings/infrastructure/settings.repository.impl';
import type { SettingsRequest, SettingsResponse } from './settings.interface';
import { DispatchSettingsUseCase } from './settings.usecase';

export class SettingsController {
  private readonly dispatchUseCase = new DispatchSettingsUseCase(new SettingsRepositoryImpl());

  handle(request: SettingsRequest): SettingsResponse {
    return this.dispatchUseCase.execute(request);
  }
}
