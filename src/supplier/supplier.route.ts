import { Router } from 'express';
import {
  sanitizeSupplierInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from '../supplier/supplier.controller.js';

export const supplierRouter = Router();

supplierRouter.post('/add', sanitizeSupplierInput, add);
supplierRouter.get('/findAll', findAll);
supplierRouter.get('/findOne/:id', findOne);
supplierRouter.put('/update/:id', sanitizeSupplierInput, update);
supplierRouter.delete('/remove/:id', remove);
