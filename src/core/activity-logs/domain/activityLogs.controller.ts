import { ActivityLogsRepositoryImpl } from '@core/activity-logs/infrastructure/activityLogs.repository.impl';
import type { ActivityLogsRequest, ActivityLogsResponse } from './activityLogs.interface';
import { DispatchActivityLogsUseCase } from './activityLogs.usecase';

export class ActivityLogsController {
  private readonly dispatchUseCase = new DispatchActivityLogsUseCase(new ActivityLogsRepositoryImpl());

  handle(request: ActivityLogsRequest): ActivityLogsResponse {
    return this.dispatchUseCase.execute(request);
  }
}
