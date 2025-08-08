import {
  Cascade,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { Client } from '../client/client.entity.js';
import snowflake from 'snowflake-id';
import { OrderItem } from './orderItem.entity.js';

@Entity()
export class Order {
  @PrimaryKey({ nullable: false, unique: true })
  orderId: string = snowflake();

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
    //eager: true,
  })
  orderItems!: OrderItem[];

  @ManyToOne(() => Client)
  client!: Rel<Client>;
}
