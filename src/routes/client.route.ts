import { Router } from 'express';
import {
  sanitizeClientInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from '../controllers/client.controller.js';

export const clientRouter = Router();

clientRouter.post('/add', sanitizeClientInput, add);
clientRouter.get('/findAll', findAll);
clientRouter.get('/findOne/:dni', findOne);
clientRouter.put('/update/:dni', sanitizeClientInput, update);
clientRouter.delete('/remove/:dni', remove);