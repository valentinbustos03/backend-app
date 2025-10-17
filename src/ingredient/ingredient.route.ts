import { Router } from 'express';
import {
  add,
  findAll,
  findOne,
  update,
  remove,
} from './ingredient.controller.js';

export const ingredientRouter = Router();

ingredientRouter.post('/add', add);
ingredientRouter.get('/findAll', findAll);
ingredientRouter.get('/id/:id', findOne);
ingredientRouter.put('/:id', update);
ingredientRouter.delete('/:id', remove);

