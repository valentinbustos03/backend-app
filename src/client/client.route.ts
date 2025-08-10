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

clientRouter.get('/dni/:dni', findOneByDni);
clientRouter.get('/id/:id', findOneById);

clientRouter.put('/:id', update);

clientRouter.delete('/:id', remove);
