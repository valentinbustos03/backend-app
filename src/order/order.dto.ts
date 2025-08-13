export interface CreateOrderDto {
  description?: string;
  status: string;
  estimatedEndTime: Date;
  endTime: Date;
  orderItems: OrderItemDto[];
  client: string;
  table: string;
}

export interface OrderIdDto {
  orderId: string;
}

export type UpdateOrderDto = Partial<CreateOrderDto>;

export interface OrderItemDto {
  dish: string;
  quantity: number;
}

