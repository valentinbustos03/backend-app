import { Router } from 'express';
import {
  sanitizeEmployeeInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from '../employee/employee.controller.js';

export const employeeRouter = Router();

employeeRouter.post('/add',sanitizeEmployeeInput, add);
employeeRouter.get('/findAll', findAll);
employeeRouter.get('/findOne/:taxId', findOne);
employeeRouter.put('/update/:taxId',sanitizeEmployeeInput, update);
employeeRouter.delete('/remove/:taxId', remove);
