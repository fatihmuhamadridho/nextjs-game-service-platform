import { GamesRepository } from '@core/games/domain/games.repository';
import type { GamesSeed } from '@core/games/domain/games.interface';
import { games, categories, services } from './games.mockSeed';

export class GamesRepositoryImpl implements GamesRepository {
  getSeed(): GamesSeed {
    return { games, categories, services };
  }
}
