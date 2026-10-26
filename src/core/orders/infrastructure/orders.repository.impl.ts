import { OrdersRepository } from '@core/orders/domain/orders.repository';
import type { OrdersRequest, OrdersResponse } from '@core/orders/domain/orders.interface';
import { handleOrders } from './orders.mock';

export class OrdersRepositoryImpl implements OrdersRepository {
  handle(request: OrdersRequest): OrdersResponse {
    return handleOrders(request.url, request.method, request.body, request.headers);
  }
}
