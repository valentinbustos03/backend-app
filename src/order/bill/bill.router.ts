import { Router } from 'express';
import { add, findAll, findOne, remove } from './bill.controller.js';

export const billRouter = Router();

billRouter.post('/:id/bill/add', add);
billRouter.get('/bill/findAll', findAll);
billRouter.get('/:orderId/bill', findOne);
billRouter.delete('/:orderId/bill', remove);
