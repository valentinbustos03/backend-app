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

supplierRouter.get('/taxId/:taxId', findOneByTaxId);
supplierRouter.get('/id/:id', findOneById);

supplierRouter.put('/:id', update);

supplierRouter.delete('/:id', remove);
