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

tableRouter.post('/add', sanitizeTableInput, add);
tableRouter.get('/findAll', findAll);
tableRouter.get('/findOne/:cod', findOne);
tableRouter.put('/update/:cod', sanitizeTableInput, update);
tableRouter.delete('/remove/:cod', remove);
