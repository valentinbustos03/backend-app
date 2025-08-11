import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import { Order } from './order.entity.js';
import { Dish } from '../dish/dish.entity.js';
import generateId from '../shared/db/generate-id.js';

@Entity()
export class OrderItem {
  @PrimaryKey({ nullable: false, unique: true })
  orderItemId: string = generateId();

  @ManyToOne(() => Order, { hidden: true })
  order!: Rel<Order>;

  @ManyToOne(() => Dish)
  dish!: Dish;

  @Property({ nullable: false })
  quantity!: number;
}
