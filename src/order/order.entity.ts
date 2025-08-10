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
import { OrderItem } from './orderItem.entity.js';
import generateId from '../shared/db/generate-id.js';

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
    //eager: true,
  })
  orderItems!: OrderItem[];

  @ManyToOne(() => Client)
  client!: Rel<Client>;
}
