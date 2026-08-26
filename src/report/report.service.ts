import { EntityManager } from '@mikro-orm/mysql';
import { Bill } from '../order/bill/bill.entity.js';
import { Dish } from '../dish/dish.entity.js';
import {
  DishSalesDto,
  DishWithoutCostDto,
  PaymentMethodSalesDto,
  ProfitabilityReportDto,
  ReportFilterDto,
  SalesReportDto,
} from './report.dto.js';

export class ReportService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async getSalesReport(filter: ReportFilterDto): Promise<SalesReportDto> {
    const bills = await this.findBilledOrders(filter);

    let totalRevenue = 0;
    let totalUnits = 0;
    const unitsByDish = new Map<string, { dish: Dish; units: number }>();
    const salesByMethod = new Map<
      string,
      { salesCount: number; total: number }
    >();

    for (const bill of bills) {
      const subtotal = Number(bill.order.subtotal);
      totalRevenue += subtotal;

      const method = salesByMethod.get(bill.paymentMethod) ?? {
        salesCount: 0,
        total: 0,
      };
      method.salesCount += 1;
      method.total += subtotal;
      salesByMethod.set(bill.paymentMethod, method);

      for (const item of bill.order.orderItems) {
        totalUnits += item.quantity;
        const entry = unitsByDish.get(item.dish.id) ?? {
          dish: item.dish,
          units: 0,
        };
        entry.units += item.quantity;
        unitsByDish.set(item.dish.id, entry);
      }
    }

    const byDish: DishSalesDto[] = [...unitsByDish.values()]
      .map(({ dish, units }) => ({
        dishId: dish.id,
        name: dish.name,
        units,
        share: totalUnits === 0 ? 0 : this.round((units / totalUnits) * 100),
      }))
      .sort((a, b) => b.units - a.units);

    const byPaymentMethod: PaymentMethodSalesDto[] = [...salesByMethod.entries()]
      .map(([paymentMethod, totals]) => ({
        paymentMethod,
        salesCount: totals.salesCount,
        total: this.round(totals.total),
      }))
      .sort((a, b) => b.total - a.total);

    return {
      from: filter.from ?? null,
      to: filter.to ?? null,
      salesCount: bills.length,
      totalRevenue: this.round(totalRevenue),
      avgTicket:
        bills.length === 0 ? 0 : this.round(totalRevenue / bills.length),
      byDish,
      byPaymentMethod,
    };
  }

  async getProfitabilityReport(
    filter: ReportFilterDto
  ): Promise<ProfitabilityReportDto> {
    const bills = await this.findBilledOrders(filter);

    let revenue = 0;
    let cost = 0;
    const dishesWithoutCost = new Map<string, DishWithoutCostDto>();

    for (const bill of bills) {
      revenue += Number(bill.order.subtotal);

      for (const item of bill.order.orderItems) {
        const dish = item.dish;
        let dishCost = 0;
        let ingredientCount = 0;
        let costed = true;

        for (const recipeItem of dish.ingredients) {
          ingredientCount += 1;
          const unitCost = recipeItem.ingredient.unitCost;
          if (unitCost === null || unitCost === undefined) {
            costed = false;
            continue;
          }
          dishCost += Number(unitCost) * recipeItem.quantity;
        }

        if (!costed || ingredientCount === 0) {
          dishesWithoutCost.set(dish.id, { dishId: dish.id, name: dish.name });
        }

        cost += dishCost * item.quantity;
      }
    }

    revenue = this.round(revenue);
    cost = this.round(cost);
    const margin = this.round(revenue - cost);

    return {
      from: filter.from ?? null,
      to: filter.to ?? null,
      revenue,
      cost,
      margin,
      marginPct: revenue === 0 ? null : this.round((margin / revenue) * 100),
      costIncomplete: dishesWithoutCost.size > 0,
      dishesWithoutCost: [...dishesWithoutCost.values()],
    };
  }

  private async findBilledOrders(filter: ReportFilterDto) {
    const where: Record<string, unknown> = {};

    if (filter.from || filter.to) {
      const createdAt: Record<string, Date> = {};
      if (filter.from) {
        createdAt.$gte = new Date(`${filter.from}T00:00:00.000`);
      }
      if (filter.to) {
        const end = new Date(`${filter.to}T00:00:00.000`);
        end.setDate(end.getDate() + 1);
        createdAt.$lt = end;
      }
      where.createdAt = createdAt;
    }

    return this.em.find(Bill, where, {
      populate: ['order.orderItems.dish.ingredients.ingredient'],
    });
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
