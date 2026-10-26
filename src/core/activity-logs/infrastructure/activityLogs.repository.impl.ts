import { ActivityLogsRepository } from '@core/activity-logs/domain/activityLogs.repository';
import type { ActivityLogsRequest, ActivityLogsResponse } from '@core/activity-logs/domain/activityLogs.interface';
import { handleActivityLogs } from './activityLogs.mock';

export class ActivityLogsRepositoryImpl implements ActivityLogsRepository {
  handle(request: ActivityLogsRequest): ActivityLogsResponse {
    return handleActivityLogs(request.url, request.method, request.body);
  }
}
