import type { MockApiRequest } from './mockApi.interface';
import type { JsonObject } from '@core/mock-data/domain/types';

export class MockApiCall implements MockApiRequest {
  constructor(
    readonly url: URL,
    readonly method: string,
    readonly body: JsonObject,
    readonly headers: Headers
  ) {}
}
