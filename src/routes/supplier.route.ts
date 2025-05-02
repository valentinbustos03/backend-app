import { Router } from 'express';
import {
  sanitizeSupplierInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from '../controllers/supplier.controller.js';

export const supplierRouter = Router();

supplierRouter.get('/', findAll);
supplierRouter.get('/:id', findOne);
supplierRouter.post('/', sanitizeSupplierInput, add);
supplierRouter.put('/:id', sanitizeSupplierInput, update);
supplierRouter.patch('/:id', sanitizeSupplierInput, update);
supplierRouter.delete('/:id', remove);
