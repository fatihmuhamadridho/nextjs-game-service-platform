import { OrdersRepositoryImpl } from '@core/orders/infrastructure/orders.repository.impl';
import type { OrdersRequest, OrdersResponse } from './orders.interface';
import { DispatchOrdersUseCase } from './orders.usecase';

export class OrdersController {
  private readonly dispatchOrdersUseCase = new DispatchOrdersUseCase(new OrdersRepositoryImpl());

  handle(request: OrdersRequest): OrdersResponse {
    return this.dispatchOrdersUseCase.execute(request);
  }
}
