import { OrderStatus } from '../shared/enum/order.statusEnum.js';

export class OrderNotFoundError extends Error {
  readonly orderId: string;

  constructor(orderId: string) {
    super('El pedido no existe');
    this.name = 'OrderNotFoundError';
    this.orderId = orderId;
  }
}

export class OrderNotPayableError extends Error {
  readonly orderId: string;
  readonly status: OrderStatus;

  constructor(orderId: string, status: OrderStatus) {
    super('Solo se puede pagar un pedido entregado');
    this.name = 'OrderNotPayableError';
    this.orderId = orderId;
    this.status = status;
  }
}

export class OrderAlreadyPaidError extends Error {
  readonly orderId: string;
  readonly billId: string;

  constructor(orderId: string, billId: string) {
    super('El pedido ya tiene factura');
    this.name = 'OrderAlreadyPaidError';
    this.orderId = orderId;
    this.billId = billId;
  }
}

export class PaymentNotFoundError extends Error {
  readonly paymentId: string;

  constructor(paymentId: string) {
    super('El pago no existe');
    this.name = 'PaymentNotFoundError';
    this.paymentId = paymentId;
  }
}

export class PaymentNotSyncableError extends Error {
  readonly paymentId: string;

  constructor(paymentId: string) {
    super('Un pago interno no se sincroniza con Mercado Pago');
    this.name = 'PaymentNotSyncableError';
    this.paymentId = paymentId;
  }
}

export class GatewayError extends Error {
  readonly detail: string;

  constructor(detail: string) {
    super('Error de comunicacion con Mercado Pago');
    this.name = 'GatewayError';
    this.detail = detail;
  }
}
