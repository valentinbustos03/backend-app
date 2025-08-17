import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { Order } from '../order/order.entity.js';
import generateId from '../shared/db/generate-id.js';
import { User } from '../user/user.entity.js';

@Entity()
export class Client {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ nullable: false, unique: true })
  dni!: number;

  @Property()
  penalty: number = 0;

  @OneToMany(() => Order, (order) => order.client, {
    mappedBy: 'client',
    cascade: [Cascade.REMOVE],
  })
  orderHistory = new Collection<Order>(this);

  @OneToOne(() => User, (user) => user.client)
  user?: Rel<User>;
}
