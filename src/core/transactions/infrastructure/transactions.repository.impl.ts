import { TransactionsRepository } from '@core/transactions/domain/transactions.repository';
import type { TransactionsRequest, TransactionsResponse } from '@core/transactions/domain/transactions.interface';
import { handleTransactions } from './transactions.mock';

export class TransactionsRepositoryImpl implements TransactionsRepository {
  handle(request: TransactionsRequest): TransactionsResponse {
    return handleTransactions(request.url, request.method, request.body);
  }
}
