import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { Client } from '../client/client.entity.js';
import { OrderItem } from './orderItem.entity.js';
import generateId from '../shared/db/generate-id.js';
import { Table } from '../table/table.entity.js';
import { Bill } from './bill/bill.entity.js';
import { OrderStatus } from '../shared/enum/order.statusEnum.js';
import { Waiter } from '../employee/type/waiter.entity.js';
import { Payment } from '../payment/payment.entity.js';

@Entity()
export class Order {
  @PrimaryKey({ nullable: false, unique: true })
  orderId: string = generateId();

  @Property({nullable: true})
  description?: string;

  @Enum(() => OrderStatus)
  status!: OrderStatus;

  @Property({ type: 'datetime' })
  startTime: Date = new Date();

  @Property({ type: 'datetime' })
  estimatedEndTime!: Date; //calculado con respecto a los productos pedidos??

  @Property({ type: 'datetime' })
  endTime!: Date;

  @Property({ nullable: false })
  subtotal!: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    eager: true,
  })
  orderItems!: OrderItem[];

  @ManyToOne(() => Client, { eager: true })
  client!: Rel<Client>;

  @ManyToOne(() => Table, { eager: true })
  table!: Rel<Table>;

  @ManyToOne(() => Waiter, { eager: true })
  waiter!: Rel<Waiter>;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments = new Collection<Payment>(this);

  @OneToOne(() => Bill, {
    mappedBy: 'order',
    nullable: true,
    cascade: [Cascade.ALL],
    unique: true,
    orphanRemoval: true,
    eager: true,
  })
  bill?: Rel<Bill>;
}
