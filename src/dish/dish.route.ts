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
dishRouter.get('/findOne/:id', findOne);
dishRouter.put('/update/:id', update);
dishRouter.delete('/remove/:id', remove);
