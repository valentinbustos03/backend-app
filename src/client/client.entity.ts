import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Order } from '../order/order.entity.js';
import snowflake from 'snowflake-id';

@Entity()
export class Client {

  //[OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ nullable: false, unique: true })
  id: string = snowflake();

  @Property({ nullable: false, unique: true })
  dni!: number;

  @Property()
  penalty: number = 0;

  @OneToMany(() => Order, (order) => order.client, {
    mappedBy: 'client',
    cascade: [Cascade.REMOVE],
  })
  orderHistory = new Collection<Order>(this);
}
