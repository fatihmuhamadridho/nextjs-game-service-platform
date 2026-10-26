import type { MockApiRequest, MockApiResponse } from './mockApi.interface';

export abstract class MockApiRepository {
  abstract handle(request: MockApiRequest): MockApiResponse;
}
