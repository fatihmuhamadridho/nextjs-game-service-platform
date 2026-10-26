import type { MockStateSnapshot } from './mockState.interface';

export abstract class MockStateRepository {
  abstract getState(): MockStateSnapshot;
}
