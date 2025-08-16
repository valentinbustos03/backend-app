import { EntityManager } from '@mikro-orm/mysql';
import { CreateBillDto } from './bill.dto.js';
import { Bill } from './bill.entity.js';
import { Order } from '../order.entity.js';
import { OrderIdDto } from '../order.dto.js';

export class BillService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createBill(data: CreateBillDto): Promise<Bill> {
    const newBill = new Bill();
    newBill.paymentMethod = data.paymentMethod;
    newBill.order = this.em.getReference(Order, data.order as unknown as Order);
    this.em.persist(newBill).flush();
    return newBill;
  }

  async findAllBills(): Promise<Bill[] | null> {
    const billList = this.em.findAll(Bill);
    return billList;
  }

  async findBillByOrder(orderId: OrderIdDto): Promise<Bill | null> {
    const bill = this.em.findOne(Bill, { order: orderId });
    return bill;
  }

  async deleteBillByOrder(orderId: OrderIdDto): Promise<boolean> {
    const bill = await this.em.findOne(Bill, { order: orderId });
    if (bill) {
      await this.em.remove(bill).flush();
      return true;
    } else {
      return false;
    }
  }
}
