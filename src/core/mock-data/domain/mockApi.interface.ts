import type { JsonObject } from '@core/mock-data/domain/types';

export interface MockApiRequest {
  url: URL;
  method: string;
  body: JsonObject;
  headers: Headers;
}

export type MockApiResponse = Response | null;
