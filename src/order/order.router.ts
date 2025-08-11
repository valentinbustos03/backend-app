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
orderRouter.get('/id/:id', findOne);
orderRouter.put('/:id', update);
orderRouter.delete('/:id', remove);

orderRouter.get('/findAllClientOrders/:id ', findAllOrdersByClientId);