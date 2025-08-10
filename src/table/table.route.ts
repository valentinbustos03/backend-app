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

tableRouter.get('/cod/:cod', findOneByCod);
tableRouter.get('/id/:id', findOneById);

tableRouter.put('/:id', update);

tableRouter.delete('/:id', remove);
