import { TransactionsRepositoryImpl } from '@core/transactions/infrastructure/transactions.repository.impl';
import type { TransactionsRequest, TransactionsResponse } from './transactions.interface';
import { DispatchTransactionsUseCase } from './transactions.usecase';

export class TransactionsController {
  private readonly dispatchUseCase = new DispatchTransactionsUseCase(new TransactionsRepositoryImpl());

  handle(request: TransactionsRequest): TransactionsResponse {
    return this.dispatchUseCase.execute(request);
  }
}
