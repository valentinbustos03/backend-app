import { EntityManager } from '@mikro-orm/mysql';
import { Bill } from './bill.entity.js';
import { OrderIdDto } from '../order.dto.js';

export class BillService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async findAllBills(): Promise<Bill[] | null> {
    const billList = this.em.findAll(Bill);
    return billList;
  }

  async findBillByOrder(orderId: OrderIdDto): Promise<Bill | null> {
    const bill = this.em.findOne(Bill, { order: orderId });
    return bill;
  }
}
