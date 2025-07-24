import { Router } from 'express';
import {
  findAll,
  findOneById,
  findOneByTaxId,
  add,
  update,
  remove,
} from '../employee/employee.controller.js';

export const employeeRouter = Router();

employeeRouter.post('/add', add);
employeeRouter.get('/findAll', findAll);
employeeRouter.get('/findOne/:taxId', findOneByTaxId);
employeeRouter.get('/findOne/:id', findOneById);
employeeRouter.put('/update/:id', update);
employeeRouter.delete('/remove/:id', remove);
