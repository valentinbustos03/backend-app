import { Router } from 'express';
import { findAll, findOne } from './bill.controller.js';

export const billRouter = Router();

billRouter.get('/bill/findAll', findAll);
billRouter.get('/:orderId/bill', findOne);
