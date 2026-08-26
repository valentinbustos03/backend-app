import { Router } from 'express';
import {
  add,
  findAll,
  findOne,
  update,
  remove,
  findAllOrdersByClientId,
  findMyOrders,
} from './order.controller.js';

export const orderRouter = Router();

orderRouter.post('/add', add);
orderRouter.get('/findAll', findAll);
orderRouter.get('/mine', findMyOrders);
orderRouter.get('/orderId/:orderId', findOne);
orderRouter.put('/:orderId', update);
orderRouter.delete('/:orderId', remove);

orderRouter.get('/findAllClientOrders/:id', findAllOrdersByClientId);