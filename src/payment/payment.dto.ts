import { Bill } from '../order/bill/bill.entity.js';
import { PaymentMethod } from '../shared/enum/payment.methodEnum.js';
import { PaymentStatus } from '../shared/enum/payment.statusEnum.js';
import { Payment } from './payment.entity.js';

export interface CheckoutResultDto {
  paymentId: string;
  preferenceId: string;
  initPoint: string;
  amount: number;
  status: PaymentStatus;
}

export interface InternalPaymentResultDto {
  payment: Payment;
  bill: Bill;
}

export interface SyncResultDto {
  payment: Payment;
  bill: Bill | null;
}

export interface RegisterInternalDto {
  orderId: string;
  method: PaymentMethod;
}
