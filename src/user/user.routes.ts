import { Router } from 'express';
import { add, findAll, findOne, update, remove } from './user.controller.js';

export const userRouter = Router();

userRouter.post('/add', add);
userRouter.get('/findAll', findAll);
userRouter.get('/id/:id', findOne);
userRouter.put('/:id', update);
userRouter.delete('/:id', remove);
