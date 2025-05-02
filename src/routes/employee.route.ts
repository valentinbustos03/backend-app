import { Router } from 'express';
import {
  sanitizeEmployeeInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from '../controllers/employee.controller.js';

export const employeeRouter = Router();

employeeRouter.get('/', findAll);
employeeRouter.get('/:taxId', findOne);
employeeRouter.post('/', sanitizeEmployeeInput, add);
employeeRouter.put('/:taxId', sanitizeEmployeeInput, update);
employeeRouter.patch('/:taxId', sanitizeEmployeeInput, update);
employeeRouter.delete('/:taxId', remove);
