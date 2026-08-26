import { Router } from 'express';
import {
  findAll,
  findWaiters,
  findOneById,
  findOneByTaxId,
  add,
  update,
  remove,
} from '../employee/employee.controller.js';

export const employeeRouter = Router();

employeeRouter.post('/add', add);
employeeRouter.get('/findAll', findAll);
employeeRouter.get('/waiters', findWaiters);

employeeRouter.get('/taxId/:taxId', findOneByTaxId);
employeeRouter.get('/id/:id', findOneById);

employeeRouter.put('/:id', update);
employeeRouter.delete('/:id', remove);
