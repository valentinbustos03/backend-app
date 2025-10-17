import { Request, Response } from 'express';
import {
  CreateUserInput,
  UpdateUserInput,
  UserIdSchema,
  UserSchema,
} from './user.schema.js';
import { UserService } from './user.service.js';
import { orm } from '../shared/db/orm.js';

const userService = new UserService(orm.em);

async function add(req: Request, res: Response) {
  const userBody = await UserSchema.safeParseAsync(req.body);
  if (!userBody.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: userBody.error });
  }
  try {
    const userInput: CreateUserInput = userBody.data;
    const user = await userService.createUser(userInput);
    return res.status(201).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating user', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const userList = await userService.findAllUsers();
    const msg =
      (userList?.length ?? 0) === 0 ? 'No users found' : 'Users found';
    return res.status(200).json({ message: msg, data: userList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const idInput = await UserIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const user = await userService.findUserById(idInput.data);
    const msg = user === null ? 'No user found' : 'User found';
    return res.status(200).json({ message: msg, data: user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await UserIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }

  const userBody = await UserSchema.safeParseAsync(req.body);
  if (!userBody.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: userBody.error,
    });
  }

  try {
    const userInput: UpdateUserInput = userBody.data;
    const user = await userService.updateUser(idInput.data, userInput);
    return res.status(200).json({
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await UserIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const deleted = await userService.deleteUser(idInput.data);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { add, findAll, findOne, update, remove};
