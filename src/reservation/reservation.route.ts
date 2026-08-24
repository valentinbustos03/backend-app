import { Router } from 'express';
import { add, findAll, findOne, update, remove } from './reservation.controller.js';

export const reservationRouter = Router();

reservationRouter.post('/add', add);
reservationRouter.get('/findAll', findAll);
reservationRouter.get('/id/:id', findOne);
reservationRouter.put('/:id', update);
reservationRouter.delete('/:id', remove);
