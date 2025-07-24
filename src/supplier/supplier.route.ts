import { Router } from 'express';
import {
  findAll,
  findOneById,
  findOneByTaxId,
  add,
  update,
  remove,
} from '../supplier/supplier.controller.js';

export const supplierRouter = Router();

supplierRouter.post('/add', add);
supplierRouter.get('/findAll', findAll);
supplierRouter.get('/findOne/:taxId', findOneByTaxId);
supplierRouter.get('/findOne/:id', findOneById);
supplierRouter.put('/update/:id', update);
supplierRouter.delete('/remove/:id', remove);
