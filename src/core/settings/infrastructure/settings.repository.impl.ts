import { SettingsRepository } from '@core/settings/domain/settings.repository';
import type { SettingsRequest, SettingsResponse } from '@core/settings/domain/settings.interface';
import { handleSettings } from './settings.mock';

export class SettingsRepositoryImpl implements SettingsRepository {
  handle(request: SettingsRequest): SettingsResponse {
    return handleSettings(request.url, request.method, request.body);
  }
}
