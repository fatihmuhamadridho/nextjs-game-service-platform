import type { ActivityLogsRequest, ActivityLogsResponse } from './activityLogs.interface';
import { ActivityLogsRepository } from './activityLogs.repository';
import { ActivityLogsCall } from './activityLogs.model';

export class DispatchActivityLogsUseCase {
  constructor(private readonly activityLogsRepository: ActivityLogsRepository) {}

  execute(request: ActivityLogsRequest): ActivityLogsResponse {
    return this.activityLogsRepository.handle(new ActivityLogsCall(request.url, request.method, request.body, request.headers));
  }
}
