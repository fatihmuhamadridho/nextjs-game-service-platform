import type { OrdersRequest, OrdersResponse } from './orders.interface';
import { OrdersRepository } from './orders.repository';
import { OrdersCall } from './orders.model';

export class DispatchOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  execute(request: OrdersRequest): OrdersResponse {
    return this.ordersRepository.handle(new OrdersCall(request.url, request.method, request.body, request.headers));
  }
}
