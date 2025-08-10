import { Dish } from '../dish/dish.entity.js';
import { OrderItem } from './orderItem.entity.js';

export interface CreateOrderDto {
  description?: string;
  status: string;
  startTime: Date;
  estimatedEndTime: Date;
  endTime: Date;
  orderItems: OrderItem[];
  client: string;
}

export interface OrderIdDto {
  orderId: string;
}

export type UpdateOrderDto = Partial<CreateOrderDto>;

export interface OrderItemDto {
  dish: Dish;
  quantity: number;
}

// export interface OrderItemListDto {
//   orderItemList: OrderItemDto[];
// }
