import { Entity, ManyToOne, PrimaryKey, Property, Ref, Rel } from '@mikro-orm/core';
import { Client } from '../client/client.entity.js';
import snowflake from 'snowflake-id';

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
  estimatedEndTime!: Date; //calculado con respecto a los productos pedidos

  @Property({ type: 'datetime' })
  endTime!: Date;

  @Property({ nullable: false })
  subtotal!: number; //calcular con el precio de los productos + iva + otros impuestos

  @Property({ nullable: false })
  orderItems!: string;

  @ManyToOne(() => Client)
  client!: Ref<Client>;

  constructor(id: string) {
    this.orderId = id;
  }
}

