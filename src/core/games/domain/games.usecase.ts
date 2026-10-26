import { GamesCatalog } from './games.model';
import { GamesRepository } from './games.repository';

export class GetGamesSeedUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  execute(): GamesCatalog {
    const seed = this.gamesRepository.getSeed();
    return new GamesCatalog(seed.games, seed.categories, seed.services);
  }
}
