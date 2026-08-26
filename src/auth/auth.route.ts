import { Router } from 'express';
import {
  changePassword,
  login,
  logout,
  me,
  register,
  updateMe,
} from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/logout', logout);
authRouter.get('/me', me);
authRouter.put('/me', updateMe);
authRouter.put('/password', changePassword);
