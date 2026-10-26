import { AuthController } from '@core/auth/domain/auth.controller';
import { CatalogController } from '@core/catalog/domain/catalog.controller';
import { AdminController } from '@core/admin/domain/admin.controller';
import { RolesController } from '@core/roles/domain/roles.controller';
import { AdminUsersController } from '@core/user/domain/adminUsers.controller';
import { ActivityLogsController } from '@core/activity-logs/domain/activityLogs.controller';
import { TransactionsController } from '@core/transactions/domain/transactions.controller';
import { SettingsController } from '@core/settings/domain/settings.controller';
import { DashboardController } from '@core/dashboard/domain/dashboard.controller';
import { OrdersController } from '@core/orders/domain/orders.controller';
import { LegacyUserController } from '@core/user/domain/legacyUser.controller';
import { MockApiCall } from '@core/mock-data/domain/mockApi.model';
import { failure, parseBody } from '@core/mock-data/infrastructure/mockRuntime';

const authController = new AuthController();
const catalogController = new CatalogController();
const adminController = new AdminController();
const rolesController = new RolesController();
const adminUsersController = new AdminUsersController();
const activityLogsController = new ActivityLogsController();
const transactionsController = new TransactionsController();
const settingsController = new SettingsController();
const dashboardController = new DashboardController();
const ordersController = new OrdersController();
const legacyUserController = new LegacyUserController();
export async function mockApiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const inputUrl = input instanceof Request ? input.url : input.toString();
  const url = new URL(inputUrl, 'http://localhost');
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init?.headers).forEach((v, k) => headers.set(k, v));
  const rawBody = init?.body ?? (input instanceof Request ? await input.clone().text() : undefined);
  const body = parseBody(rawBody);
  const request = new MockApiCall(url, method, body, headers);
  const responses = [
    authController.handle(request),
    catalogController.handle(request),
    rolesController.handle(request),
    adminUsersController.handle(request),
    adminController.handle(request),
    activityLogsController.handle(request),
    transactionsController.handle(request),
    settingsController.handle(request),
    dashboardController.getOverview(request),
    ordersController.handle(request),
    legacyUserController.handle(request),
  ];
  const response = responses.find((item) => item !== null);
  if (response) return response;
  return failure(404, 'MOCK_ROUTE_NOT_FOUND', 'Mock API tidak mengenali ' + method + ' ' + url.pathname + '.');
}
