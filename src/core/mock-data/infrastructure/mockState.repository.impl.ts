import { MockStateRepository } from '@core/mock-data/domain/mockState.repository';
import type { MockStateSnapshot } from '@core/mock-data/domain/mockState.interface';
import { GamesController } from '@core/games/domain/games.controller';
import { users } from '@core/user/infrastructure/user.mockSeed';
import { admins } from '@core/admin/infrastructure/admin.mockSeed';
import { roles } from '@core/roles/infrastructure/roles.mockSeed';
import { transactions } from '@core/transactions/infrastructure/transactions.mockSeed';
import { activityLogs } from '@core/activity-logs/infrastructure/activityLogs.mockSeed';
import { settings } from '@core/settings/infrastructure/settings.mockSeed';
import { orders, trackingTokens } from '@core/orders/infrastructure/orders.mockSeed';

const gameSeed = new GamesController().getSeed();

const initialState: MockStateSnapshot = {
  games: gameSeed.games,
  categories: gameSeed.categories,
  services: gameSeed.services,
  users,
  admins,
  roles,
  orders,
  transactions,
  activityLogs,
  settings,
  session: null,
  trackingTokens,
  idempotency: new Map(),
  nextId: 100,
};

export class MockStateRepositoryImpl implements MockStateRepository {
  getState(): MockStateSnapshot {
    return initialState;
  }
}
