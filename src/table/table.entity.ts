import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import generateId from '../shared/db/generate-id.js';
import { Order } from '../order/order.entity.js';

@Entity()
export class Table {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ nullable: false, unique: true })
  cod!: string;

  @Property({ nullable: false })
  capacity!: number;

  @Property()
  description?: string;

  @Property({ nullable: false })
  occupied: boolean = false;

  @OneToMany(() => Order, (order) => order.table, {
    mappedBy: 'table',
  })
  order = new Collection<Order>(this);
}
