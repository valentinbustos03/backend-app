import { EntityManager } from '@mikro-orm/mysql';
import {
  CreateOrderDto,
  OrderFilterDto,
  OrderIdDto,
  UpdateOrderDto,
} from './order.dto.js';
import { Order } from './order.entity.js';
import { Client } from '../client/client.entity.js';
import { OrderItem } from './orderItem.entity.js';
import { ClientIdDto } from '../client/client.dto.js';
import { Dish } from '../dish/dish.entity.js';
import { Table } from '../table/table.entity.js';
import { Waiter } from '../employee/type/waiter.entity.js';
import { Promotion } from '../promotion/promotion.entity.js';
import { Ingredient } from '../ingredient/ingredient.entity.js';
import {
  InsufficientStockError,
  InvalidStatusTransitionError,
  StockShortage,
} from './order.error.js';
import { OrderStatus } from '../shared/enum/order.statusEnum.js';

export class OrderService {
  private static readonly RESTOCK_STATUSES: OrderStatus[] = [
    OrderStatus.CANCELADO,
    OrderStatus.RECHAZADO,
  ];

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
    newOrder.waiter = this.em.getReference(Waiter, data.waiter);

    const orderItemList = data.orderItems.map((item) => {
      const orderItem = new OrderItem();
      orderItem.dish = this.em.getReference(Dish, item.dish);
      orderItem.order = newOrder;
      orderItem.quantity = item.quantity;
      return orderItem;
    });

    const dishes = await this.em.find(
      Dish,
      { id: { $in: data.orderItems.map((item) => item.dish) } },
      { populate: ['ingredients.ingredient'] }
    );
    const dishById = new Map(dishes.map((dish) => [dish.id, dish]));

    if (!OrderService.RESTOCK_STATUSES.includes(data.status)) {
      const consumption = this.computeConsumption(orderItemList, dishById);

      const shortages: StockShortage[] = [];
      for (const { ingredient, required } of consumption.values()) {
        if (ingredient.stock < required) {
          shortages.push({
            id: ingredient.id,
            name: ingredient.name,
            stock: ingredient.stock,
            required,
          });
        }
      }

      if (shortages.length > 0) {
        throw new InsufficientStockError(shortages);
      }

      for (const { ingredient, required } of consumption.values()) {
        ingredient.stock -= required;
      }
    }

    newOrder.subtotal = await this.computeSubtotal(
      orderItemList,
      dishById,
      newOrder.startTime
    );

    newOrder.orderItems = orderItemList;

    await this.em.persist(newOrder).flush();

    return newOrder;
  }

  async findAllOrders(filter?: OrderFilterDto): Promise<Order[] | null> {
    const where: Record<string, unknown> = {};

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.date) {
      const start = new Date(`${filter.date}T00:00:00.000`);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.startTime = { $gte: start, $lt: end };
    }

    const orderList =
      Object.keys(where).length > 0
        ? await this.em.find(Order, where)
        : await this.em.findAll(Order);
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
    const updatedOrder = await this.em.findOne(Order, id, {
      populate: ['orderItems.dish.ingredients.ingredient'],
    });

    if (!updatedOrder) {
      return null;
    }

    const previousStatus = updatedOrder.status;
    const wasRestocked = OrderService.RESTOCK_STATUSES.includes(
      previousStatus
    );

    this.em.assign(updatedOrder, data);

    const isRestocked = OrderService.RESTOCK_STATUSES.includes(
      updatedOrder.status
    );

    if (wasRestocked && !isRestocked) {
      throw new InvalidStatusTransitionError(
        previousStatus,
        updatedOrder.status
      );
    }

    if (!wasRestocked && isRestocked) {
      this.restoreStock(updatedOrder);
    }

    await this.em.flush();
    return updatedOrder;
  }

  async deleteOrder(id: OrderIdDto): Promise<boolean> {
    const deletedOrder = await this.em.findOne(Order, id, {
      populate: ['orderItems.dish.ingredients.ingredient'],
    });
    if (deletedOrder) {
      if (!OrderService.RESTOCK_STATUSES.includes(deletedOrder.status)) {
        this.restoreStock(deletedOrder);
      }
      // const order = await this.em.findOneOrFail(Order, id, {
      //   populate: ['orderItems'],
      // });
      await this.em.removeAndFlush(deletedOrder.orderItems); //probar de sacar esto y usar el cascade
      await this.em.removeAndFlush(deletedOrder);
      return true;
    }
    return false;
  }

  async findOrdersByClientId(clientId: ClientIdDto): Promise<Order[] | null> {
    const orderList = await this.em.find(Order, { client: clientId });
    return orderList;
  }

  private async computeSubtotal(
    orderItemList: OrderItem[],
    dishById: Map<string, Dish>,
    when: Date
  ): Promise<number> {
    const activePromotions = await this.em.find(
      Promotion,
      {
        active: true,
        dateFrom: { $lte: when },
        dateTo: { $gte: when },
      },
      { populate: ['dishes'] }
    );

    const bestDiscountByDish = new Map<string, number>();
    for (const promotion of activePromotions) {
      for (const dish of promotion.dishes) {
        const currentDiscount = bestDiscountByDish.get(dish.id) ?? 0;
        if (promotion.discountPercentage > currentDiscount) {
          bestDiscountByDish.set(dish.id, promotion.discountPercentage);
        }
      }
    }

    let subtotal = 0;
    for (const item of orderItemList) {
      const dish = dishById.get(item.dish.id);
      if (!dish) continue;
      const discount = bestDiscountByDish.get(dish.id) ?? 0;
      subtotal += Number(dish.price) * (1 - discount / 100) * item.quantity;
    }

    return Math.round(subtotal * 100) / 100;
  }

  private computeConsumption(
    orderItemList: OrderItem[],
    dishById: Map<string, Dish>
  ): Map<string, { ingredient: Ingredient; required: number }> {
    const consumption = new Map<
      string,
      { ingredient: Ingredient; required: number }
    >();

    for (const item of orderItemList) {
      const dish = dishById.get(item.dish.id);
      if (!dish) continue;

      for (const recipeItem of dish.ingredients) {
        const ingredient = recipeItem.ingredient;
        const entry = consumption.get(ingredient.id) ?? {
          ingredient,
          required: 0,
        };
        entry.required += recipeItem.quantity * item.quantity;
        consumption.set(ingredient.id, entry);
      }
    }

    return consumption;
  }

  private restoreStock(order: Order): void {
    const dishById = new Map<string, Dish>();
    for (const item of order.orderItems) {
      dishById.set(item.dish.id, item.dish);
    }

    const consumption = this.computeConsumption(order.orderItems, dishById);
    for (const { ingredient, required } of consumption.values()) {
      ingredient.stock += required;
    }
  }
}
