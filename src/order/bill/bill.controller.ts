import { Request, Response } from 'express';
import { orm } from '../../shared/db/orm.js';
import { BillSchema, CreateBillInput } from './bill.schema.js';
import { BillService } from './bill.service.js';
import { OrderIdSchema } from '../order.schema.js';
import { CreateBillDto } from './bill.dto.js';

const billService = new BillService(orm.em);

async function add(req: Request, res: Response) {
  const billBody = await BillSchema.safeParseAsync(req.body);
  const orderIdParam = await OrderIdSchema.shape.orderId.safeParseAsync(
    req.params.id
  );
  if (!orderIdParam.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: orderIdParam.error });
  }
  if (!billBody.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: billBody.error });
  }
  try {
    const billInput: CreateBillDto = {
      paymentMethod: billBody.data.paymentMethod,
      order: orderIdParam.data,
    };
    const bill = await billService.createBill(billInput);
    return res.status(201).json({ message: 'Bill created', data: bill });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating bill', error: error.message });
  }
}

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

async function remove(req: Request, res: Response) {
  const orderId = await OrderIdSchema.safeParseAsync(req.params);
  if (!orderId.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: orderId.error });
  }
  try {
    const deleted = await billService.deleteBillByOrder(orderId.data);
    const msg = deleted ? 'Bill deleted' : 'No bill found to delete';
    return res.status(200).json({ message: msg, data: deleted });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { add, findAll, findOne, remove };
