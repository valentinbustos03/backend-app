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
