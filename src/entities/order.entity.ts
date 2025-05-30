import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import {v4} from 'uuid'
import { Client } from "./client.entity.js";

@Entity()
export class Order{
  @PrimaryKey({nullable: false, unique: true, type:'uuid'})
  orderId: string = v4();

  @Property()
  description?: string;

  @Property({nullable: false})
  status!: string;

  @Property({type:'datetime'})
  startTime: Date = new Date();

  @Property({type: 'datetime'})
  estimatedEndTime!: Date; //calculado con respecto a los productos pedidos

  @Property({type: 'datetime'})
  endTime?: Date;

  @Property({nullable: false})
  subtotal!: number; //calcular con el precio de los productos + iva + otros impuestos

  @Property({nullable: false})
  orderItems!: string;

  @ManyToOne(()=> Client, {nullable: false})
  client!: Rel<Client>;
}