import { Router } from 'express';
import {
  add,
  findAll,
  findOne,
  update,
  remove,
} from './promotion.controller.js';

export const promotionRouter = Router();

promotionRouter.post('/add', add);
promotionRouter.get('/findAll', findAll);
promotionRouter.get('/id/:id', findOne);
promotionRouter.put('/:id', update);
promotionRouter.delete('/:id', remove);
