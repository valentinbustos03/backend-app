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
ingredientRouter.get('/findOne/:id', findOne);
ingredientRouter.put('/update/:id', update);
ingredientRouter.delete('/remove/:id', remove);
