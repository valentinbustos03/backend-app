import { Request, Response } from 'express';
import { orm } from '../../shared/db/orm.js';
import { BillService } from './bill.service.js';
import { OrderIdSchema } from '../order.schema.js';

const billService = new BillService(orm.em);

async function findAll(req: Request, res: Response) {
  try {
    const billList = await billService.findAllBills();
    const msg =
      (billList?.length ?? 0) === 0 ? 'No bills found' : 'Bills found';
    return res.status(200).json({ message: msg, data: billList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const orderId = await OrderIdSchema.safeParseAsync(req.params);
  if (!orderId.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: orderId.error });
  }
  try {
    const bill = await billService.findBillByOrder(orderId.data);
    const msg = bill === null ? 'No bill found' : 'Bill found';
    return res.status(200).json({ message: msg, data: bill });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { findAll, findOne };
