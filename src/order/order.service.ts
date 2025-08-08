import { EntityManager } from '@mikro-orm/mysql';
import {
  CreateOrderDto,
  OrderIdDto,
  OrderItemDto,
  UpdateOrderDto,
} from './order.dto.js';
import { Order } from './order.entity.js';
import { Client } from '../client/client.entity.js';
import { OrderItem } from './orderItem.entity.js';
import { ClientIdDto } from '../client/client.dto.js';

export class OrderService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createOrder(
    data: CreateOrderDto
    //orderItemList: OrderItemDto[]
  ): Promise<Order> {
    const newOrder = new Order();
    newOrder.description = data.description;
    newOrder.status = data.status;
    newOrder.startTime = data.startTime;
    newOrder.estimatedEndTime = data.estimatedEndTime;
    newOrder.endTime = data.endTime;
    newOrder.subtotal = this.computeSubtotal(data.orderItems);

    newOrder.client = this.em.getReference(Client, data.client);

    const orderItemList = data.orderItems.map((item) => {
      const orderItem = new OrderItem();
      orderItem.dish = item.dish;
      orderItem.order = newOrder;
      orderItem.quantity = item.quantity;
      return orderItem;
    });

    newOrder.orderItems = orderItemList;

    return newOrder;
  }

  async findAllOrders(): Promise<Order[] | null> {
    const orderList = this.em.findAll(Order);
    return orderList;
  }

  async findOrderById(id: OrderIdDto): Promise<Order | null> {
    const order = this.em.findOne(Order, id);
    return order;
  }

  async updateOrder(
    id: OrderIdDto,
    data: UpdateOrderDto
  ): Promise<Order | null> {
    const updatedOrder = await this.em.findOne(Order, id);
    if (updatedOrder) {
      this.em.assign(updatedOrder, data);
      await this.em.flush();
      return updatedOrder;
    } else {
      return null;
    }
  }

  async deleteOrder(id: OrderIdDto) {
    const deletedOrder = await this.em.findOne(Order, id);
    if (deletedOrder) {
      await this.em.removeAndFlush(deletedOrder);
    }
  }

  async findOrdersByClientId(clientId: ClientIdDto): Promise<Order[] | null> {
    const orderList = await this.em.find(Order, { client: clientId });
    return orderList;
  }

  private computeSubtotal(orderItemList: OrderItemDto[]): number {
    let subtotal = 0;
    for (const item of orderItemList) {
      const dish = item.dish;
      subtotal += dish.price * item.quantity;
    }
    return Math.round(subtotal * 100) / 100; // Redondear a 2 decimales
  }
}
