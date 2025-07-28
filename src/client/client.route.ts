import { Router } from 'express';
import {
  findAll,
  findOneById,
  findOneByDni,
  add,
  update,
  remove,
} from '../client/client.controller.js';

export const clientRouter = Router();

clientRouter.post('/add', add);
clientRouter.get('/findAll', findAll);
clientRouter.get('/findOne/:dni', findOneByDni);
clientRouter.get('/findOne/:id', findOneById);
clientRouter.put('/update/:id', update);
clientRouter.delete('/remove/:id', remove);
