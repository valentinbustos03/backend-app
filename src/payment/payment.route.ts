import { Router } from 'express';
import {
  checkout,
  findByOrder,
  findOne,
  internal,
  sync,
  webhook,
} from './payment.controller.js';

export const paymentRouter = Router();

paymentRouter.post('/webhook', webhook);
paymentRouter.post('/order/:orderId/checkout', checkout);
paymentRouter.post('/order/:orderId/internal', internal);
paymentRouter.get('/order/:orderId', findByOrder);
paymentRouter.post('/:paymentId/sync', sync);
paymentRouter.get('/:paymentId', findOne);
