import { Router } from 'express';
import {
  add,
  findAll,
  findOne,
  update,
  remove,
  findAllOrdersByClientId,
} from './order.controller.js';

export const orderRouter = Router();

orderRouter.post('/add', add);
orderRouter.get('/findAll', findAll);
orderRouter.get('/findAllClientOrders/:id ', findAllOrdersByClientId);
orderRouter.get('/findOne/:id', findOne);
orderRouter.put('/update/:id', update);
orderRouter.delete('/remove/:id', remove);
