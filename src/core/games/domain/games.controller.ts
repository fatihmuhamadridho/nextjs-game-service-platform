import { GamesRepositoryImpl } from '@core/games/infrastructure/games.repository.impl';
import { GetGamesSeedUseCase } from './games.usecase';

export class GamesController {
  private readonly getGamesSeedUseCase = new GetGamesSeedUseCase(new GamesRepositoryImpl());

  getSeed() {
    return this.getGamesSeedUseCase.execute();
  }
}
