import { DashboardRepository } from '@core/dashboard/domain/dashboard.repository';
import type { DashboardRequest, DashboardResponse } from '@core/dashboard/domain/dashboard.interface';
import { handleDashboard } from './dashboard.mock';

export class DashboardRepositoryImpl implements DashboardRepository {
  handle(request: DashboardRequest): DashboardResponse {
    return handleDashboard(request.url, request.method, request.body);
  }
}
