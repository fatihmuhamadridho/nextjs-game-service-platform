import type { CatalogRequest, CatalogResponse } from './catalog.interface';
import { CatalogRepository } from './catalog.repository';
import { CatalogCall } from './catalog.model';

export class DispatchCatalogUseCase {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  execute(request: CatalogRequest): CatalogResponse {
    return this.catalogRepository.handle(new CatalogCall(request.url, request.method, request.body, request.headers));
  }
}
