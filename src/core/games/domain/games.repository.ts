import type { GamesSeed } from './games.interface';

export abstract class GamesRepository {
  abstract getSeed(): GamesSeed;
}
