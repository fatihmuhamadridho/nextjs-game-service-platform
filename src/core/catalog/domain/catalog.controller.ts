import { CatalogRepositoryImpl } from '@core/catalog/infrastructure/catalog.repository.impl';
import type { CatalogRequest, CatalogResponse } from './catalog.interface';
import { DispatchCatalogUseCase } from './catalog.usecase';

export class CatalogController {
  private readonly dispatchCatalogUseCase = new DispatchCatalogUseCase(new CatalogRepositoryImpl());

  handle(request: CatalogRequest): CatalogResponse {
    return this.dispatchCatalogUseCase.execute(request);
  }
}
