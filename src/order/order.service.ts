import { EntityManager } from '@mikro-orm/mysql';
import { CreateOrderDto, OrderIdDto, UpdateOrderDto } from './order.dto.js';
import { Order } from './order.entity.js';
import { Client } from '../client/client.entity.js';
import { OrderItem } from './orderItem.entity.js';
import { ClientIdDto } from '../client/client.dto.js';
import { Dish } from '../dish/dish.entity.js';
import { Table } from '../table/table.entity.js';

export class OrderService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const newOrder = new Order();
    newOrder.description = data.description;
    newOrder.status = data.status;
    newOrder.estimatedEndTime = data.estimatedEndTime;
    newOrder.endTime = data.endTime;

    newOrder.client = this.em.getReference(Client, data.client);
    newOrder.table = this.em.getReference(Table, data.table);

    const orderItemList = data.orderItems.map((item) => {
      const orderItem = new OrderItem();
      orderItem.dish = this.em.getReference(Dish, item.dish);
      orderItem.order = newOrder;
      orderItem.quantity = item.quantity;
      return orderItem;
    });
    newOrder.subtotal = await this.computeSubtotal(orderItemList);

    newOrder.orderItems = orderItemList;

    this.em.persist(newOrder).flush();

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

  async deleteOrder(id: OrderIdDto): Promise<boolean> {
    const deletedOrder = await this.em.findOne(Order, id);
    if (deletedOrder) {
      // const order = await this.em.findOneOrFail(Order, id, {
      //   populate: ['orderItems'],
      // });
      await this.em.removeAndFlush(deletedOrder.orderItems);
      await this.em.removeAndFlush(deletedOrder);
      return true;
    }
    return false;
  }

  async findOrdersByClientId(clientId: ClientIdDto): Promise<Order[] | null> {
    const orderList = await this.em.find(Order, { client: clientId });
    return orderList;
  }

  private async computeSubtotal(orderItemList: OrderItem[]): Promise<number> {
    let subtotal = 0;

    const dishPromises = orderItemList.map((item) =>
      this.em.findOne(Dish, item.dish)
    );
    const dishes = await Promise.all(dishPromises);

    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];
      const item = orderItemList[i];
      if (dish) subtotal += dish.price * item.quantity;
    }
    return Math.round(subtotal * 100) / 100; // Redondear a 2 decimales
  }
}
