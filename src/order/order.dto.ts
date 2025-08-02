export interface CreateOrderDto {
  description?: string;
  status: string;
  startTime: Date;
  estimatedEndTime: Date;
  endTime: Date;
  orderItems: OrderItemsDto[];
  clientId: string; 
}

export interface OrderIdDto {
  orderId: string;
}

export type UpdateOrderDto = Partial<CreateOrderDto>;

export interface OrderItemsDto {
  dishId: string;
  quantity: number;
}
