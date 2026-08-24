import { OrderStatus } from "../shared/enum/order.statusEnum.js";

export interface CreateOrderDto {
  description?: string;
  status: OrderStatus;
  estimatedEndTime: Date;
  endTime: Date;
  orderItems: OrderItemDto[];
  client: string;
  table: string;
  waiter: string;
}

export interface OrderIdDto {
  orderId: string;
}

export interface OrderFilterDto {
  status?: OrderStatus;
  date?: string;
}

export type UpdateOrderDto = Partial<CreateOrderDto>;

export interface OrderItemDto {
  dish: string;
  quantity: number;
}

