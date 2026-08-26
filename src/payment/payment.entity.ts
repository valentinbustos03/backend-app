import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import generateId from '../shared/db/generate-id.js';
import { Order } from '../order/order.entity.js';
import { PaymentMethod } from '../shared/enum/payment.methodEnum.js';
import { PaymentProvider } from '../shared/enum/payment.providerEnum.js';
import { PaymentStatus } from '../shared/enum/payment.statusEnum.js';

@Entity()
export class Payment {
  @PrimaryKey({ nullable: false, unique: true })
  paymentId: string = generateId();

  @ManyToOne(() => Order, { nullable: false })
  order!: Rel<Order>;

  @Enum(() => PaymentProvider)
  provider!: PaymentProvider;

  @Enum(() => PaymentMethod)
  method!: PaymentMethod;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount!: number;

  @Enum(() => PaymentStatus)
  status!: PaymentStatus;

  @Property({ nullable: true, unique: true })
  externalId?: string;

  @Property({ nullable: true })
  preferenceId?: string;

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Property({ type: 'datetime', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
