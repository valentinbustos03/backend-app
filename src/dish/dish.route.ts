import { Router } from 'express';
import {
  add,
  findAll,
  findOne,
  update,
  remove,
} from './dish.controller.js';

export const dishRouter = Router();

dishRouter.post('/add', add);
dishRouter.get('/findAll', findAll);
dishRouter.get('/id/:id', findOne);
dishRouter.put('/:id', update);
dishRouter.delete('/:id', remove);
