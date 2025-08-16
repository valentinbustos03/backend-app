import {
  Cascade,
  Entity,
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

@Entity()
export class Order {
  @PrimaryKey({ nullable: false, unique: true })
  orderId: string = generateId();

  @Property()
  description?: string;

  @Property({ nullable: false })
  status!: string;

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

  @ManyToOne(() => Client)
  client!: Rel<Client>;

  @ManyToOne(() => Table)
  table!: Rel<Table>;

  @OneToOne(() => Bill, {
    mappedBy: 'order',
    nullable: true,
    cascade: [Cascade.ALL],
    unique: true,
    orphanRemoval: true,
  })
  bill?: Rel<Bill>;
}
