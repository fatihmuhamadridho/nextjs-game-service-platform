import { handleCatalog } from './catalog.mock';
import { CatalogRepository } from '@core/catalog/domain/catalog.repository';
import type { CatalogRequest, CatalogResponse } from '@core/catalog/domain/catalog.interface';

export class CatalogRepositoryImpl implements CatalogRepository {
  handle(request: CatalogRequest): CatalogResponse {
    return handleCatalog(request.url, request.method, request.body);
  }
}
