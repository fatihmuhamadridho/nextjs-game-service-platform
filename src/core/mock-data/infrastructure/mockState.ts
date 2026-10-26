import { MockStateController } from '@core/mock-data/domain/mockState.controller';

export const state = new MockStateController().getState();
