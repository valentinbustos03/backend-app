import { OrderStatus } from '../shared/enum/order.statusEnum.js';

export interface StockShortage {
  id: string;
  name: string;
  stock: number;
  required: number;
}

export class InsufficientStockError extends Error {
  readonly shortages: StockShortage[];

  constructor(shortages: StockShortage[]) {
    super('Stock insuficiente');
    this.name = 'InsufficientStockError';
    this.shortages = shortages;
  }
}

export class InvalidStatusTransitionError extends Error {
  readonly from: OrderStatus;
  readonly to: OrderStatus;

  constructor(from: OrderStatus, to: OrderStatus) {
    super('Transicion de estado invalida');
    this.name = 'InvalidStatusTransitionError';
    this.from = from;
    this.to = to;
  }
}
