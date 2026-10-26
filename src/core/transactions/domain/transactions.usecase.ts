import type { TransactionsRequest, TransactionsResponse } from './transactions.interface';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsCall } from './transactions.model';

export class DispatchTransactionsUseCase {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  execute(request: TransactionsRequest): TransactionsResponse {
    return this.transactionsRepository.handle(new TransactionsCall(request.url, request.method, request.body, request.headers));
  }
}
