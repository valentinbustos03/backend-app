import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import snowflake from "snowflake-id";
import { Order } from "./order.entity.js";
import { Dish } from "../dish/dish.entity.js";

@Entity()
export class OrderItem{
  @PrimaryKey({ nullable: false, unique: true })
  orderItemId: string = snowflake();

  @ManyToOne(() => Order)
  order!: Rel<Order>;

  @ManyToOne(() => Dish)
  dish!: Dish;

  @Property({ nullable: false })
  quantity!: number;
}