import {
  Entity,
  Enum,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import generateId from '../../shared/db/generate-id.js';
import { Order } from '../order.entity.js';
import { PaymentMethod } from '../../shared/enum/payment.methodEnum.js';

@Entity()
export class Bill {
  @PrimaryKey({ nullable: false, unique: true })
  billId: string = generateId();

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Enum(() => PaymentMethod)
  paymentMethod!: PaymentMethod;

  @OneToOne(() => Order, {
    owner: true,
    nullable: false,
    unique: true,
  })
  order!: Rel<Order>;
}
