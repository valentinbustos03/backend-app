import { Router } from 'express';
import { add, findAll, findOne, update, remove } from './user.controller.js';

export const userRoter = Router();

userRoter.post('/add', add);
userRoter.get('/findAll', findAll);
userRoter.get('/id/:id', findOne);
userRoter.put('/:id', update);
userRoter.delete('/:id', remove);
