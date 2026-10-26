import { DashboardRepositoryImpl } from '@core/dashboard/infrastructure/dashboard.repository.impl';
import type { DashboardRequest, DashboardResponse } from './dashboard.interface';
import { GetDashboardOverviewUseCase } from './dashboard.usecase';

export class DashboardController {
  private readonly getDashboardOverviewUseCase = new GetDashboardOverviewUseCase(new DashboardRepositoryImpl());

  getOverview(request: DashboardRequest): DashboardResponse {
    return this.getDashboardOverviewUseCase.execute(request);
  }
}
