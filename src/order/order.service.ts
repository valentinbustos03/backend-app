import { EntityManager } from "@mikro-orm/mysql";
import { CreateOrderDto, OrderItemsDto } from "./order.dto.js";
import { Order } from "./order.entity.js";
import { Dish } from "../dish/dish.entity.js";
import { Client } from "../client/client.entity.js";

export class OrderService{
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const client = this.em.getReference(Client, data.clientId);

    const newOrder = this.em.create(Order, {
      ...data,
      client, // override el string por la entidad
      subtotal: this.computeSubtotal(data.orderItems),
    });
    await this.em.persistAndFlush(newOrder);
    return newOrder;
  }


  private computeSubtotal(orderItems: OrderItemsDto[]): number {
    let subtotal = 0;
    for (const item of orderItems) {
      const dish = this.em.getReference(Dish, item.dishId);
      if (dish) {

        subtotal += dish.price * item.quantity;
      }
    }
    
    return Math.round(subtotal * 100) / 100; // Redondear a 2 decimales
  }
}
