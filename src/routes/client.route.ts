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

clientRouter.get('/', findAll);
clientRouter.get('/:cod', findOne);
clientRouter.post('/', sanitizeClientInput, add);
clientRouter.put('/:cod', sanitizeClientInput, update);
clientRouter.patch('/:cod', sanitizeClientInput, update);
clientRouter.delete('/:cod', remove);