import type { GamesSeed } from './games.interface';

export class GamesCatalog implements GamesSeed {
  constructor(
    readonly games: GamesSeed['games'],
    readonly categories: GamesSeed['categories'],
    readonly services: GamesSeed['services']
  ) {}
}
