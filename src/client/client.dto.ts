import { Order } from "../order/order.entity.js";

export interface CreateClientDto {
  dni: number;
  penalty: number; // Default to 0 if not provided
}

export interface ClientIdDto {
  id: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
}
