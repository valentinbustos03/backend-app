import { Router } from 'express';
import {
  findAll,
  add,
  update,
  remove,
  findOneByCod,
  findOneById,
} from '../table/table.controller.js';

export const tableRouter = Router();

tableRouter.post('/add', add);
tableRouter.get('/findAll', findAll);
tableRouter.get('/findOne/:cod', findOneByCod);
tableRouter.get('/findOne/:id', findOneById);
tableRouter.put('/update/:id', update);
tableRouter.delete('/remove/:id', remove);
