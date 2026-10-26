import type { DashboardRequest, DashboardResponse } from './dashboard.interface';
import { DashboardRepository } from './dashboard.repository';
import { DashboardCall } from './dashboard.model';

export class GetDashboardOverviewUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  execute(request: DashboardRequest): DashboardResponse {
    return this.dashboardRepository.handle(new DashboardCall(request.url, request.method, request.body, request.headers));
  }
}
