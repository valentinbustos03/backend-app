export interface ReportFilterDto {
  from?: string;
  to?: string;
}

export interface DishSalesDto {
  dishId: string;
  name: string;
  units: number;
  share: number;
}

export interface PaymentMethodSalesDto {
  paymentMethod: string;
  salesCount: number;
  total: number;
}

export interface SalesReportDto {
  from: string | null;
  to: string | null;
  salesCount: number;
  totalRevenue: number;
  avgTicket: number;
  byDish: DishSalesDto[];
  byPaymentMethod: PaymentMethodSalesDto[];
}

export interface DishWithoutCostDto {
  dishId: string;
  name: string;
}

export interface ProfitabilityReportDto {
  from: string | null;
  to: string | null;
  revenue: number;
  cost: number;
  margin: number;
  marginPct: number | null;
  costIncomplete: boolean;
  dishesWithoutCost: DishWithoutCostDto[];
}
