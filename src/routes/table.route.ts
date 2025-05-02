import { Router } from 'express';
import {
  sanitizeTableInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from '../controllers/table.controller.js';

export const tableRouter = Router();

tableRouter.get('/', findAll);
tableRouter.get('/:cod', findOne);
tableRouter.post('/', sanitizeTableInput, add);
tableRouter.put('/:cod', sanitizeTableInput, update);
tableRouter.patch('/:cod', sanitizeTableInput, update);
tableRouter.delete('/:cod', remove);
