import { MockStateRepositoryImpl } from '@core/mock-data/infrastructure/mockState.repository.impl';
import { GetMockStateUseCase } from './mockState.usecase';

export class MockStateController {
  private readonly getMockStateUseCase = new GetMockStateUseCase(new MockStateRepositoryImpl());

  getState() {
    return this.getMockStateUseCase.execute();
  }
}
