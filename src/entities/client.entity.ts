import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import{Order} from './order.entity.js';

@Entity() 
export class Client {
  @PrimaryKey({ nullable: false, unique: true })
  dni!: number; 

  @OneToMany(()=> Order, (order) => order.client, {cascade: [Cascade.ALL]}) 
  orderHistory = new Collection<Order>(this);

  @Property({ nullable: false })
  penalty: number=0;
}
