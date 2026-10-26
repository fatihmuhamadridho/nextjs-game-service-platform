import type { CategoryRecord, GameRecord, ServiceRecord } from '@core/mock-data/domain/types';

export interface GamesSeed {
  games: GameRecord[];
  categories: CategoryRecord[];
  services: ServiceRecord[];
}
