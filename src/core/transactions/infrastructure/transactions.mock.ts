import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject } from '@core/mock-data/domain/types';
export const handleTransactions = (url: URL, method: string, _body: JsonObject) => {
  void _body;
  const { pathname } = url;
  if (pathname === '/api/admin/transactions/v1/list' && method === 'GET') {
    return mock.success(mock.filterPagedList(mock.state.transactions, url, 'transactions'));
  }
  const transactionMatch = pathname.match(/^\/api\/admin\/transactions\/v1\/detail\/([^/]+)$/);
  if (transactionMatch && method === 'GET') {
    const transaction = mock.state.transactions.find((item) => String(item.internalId) === decodeURIComponent(transactionMatch[1]));
    return transaction ? mock.success({ transaction }) : mock.failure(404, 'TRANSACTION_NOT_FOUND', 'Transaksi demo tidak ditemukan.');
  }

  return null;
};
