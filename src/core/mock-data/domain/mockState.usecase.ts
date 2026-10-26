import { MockStateModel } from './mockState.model';
import { MockStateRepository } from './mockState.repository';

export class GetMockStateUseCase {
  constructor(private readonly mockStateRepository: MockStateRepository) {}

  execute(): MockStateModel {
    return new MockStateModel(this.mockStateRepository.getState());
  }
}
