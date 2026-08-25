import { EntityManager } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto, UserIdDto } from './user.dto.js';
import { User } from './user.entity.js';

const SALT_ROUNDS = 10;

export class UserService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const newUser = this.em.create(User, {
      ...data,
      password: await bcrypt.hash(data.password, SALT_ROUNDS),
    });
    await this.em.persistAndFlush(newUser);
    return newUser;
  }

  async findAllUsers(): Promise<User[]> {
    const userList = await this.em.findAll(User);
    return userList;
  }

  async findUserById(id: UserIdDto): Promise<User | null> {
    const user = this.em.findOne(User, id);
    return user;
  }

  async updateUser(id: UserIdDto, data: UpdateUserDto): Promise<User | null> {
    const updatedUser = await this.em.findOne(User, id);
    if (updatedUser) {
      // El password se asigna aparte para no pisar el hash existente con
      // undefined cuando el body no lo trae.
      const { password, ...rest } = data;
      this.em.assign(updatedUser, rest);
      if (password) {
        updatedUser.password = await bcrypt.hash(password, SALT_ROUNDS);
      }
      await this.em.flush();
      return updatedUser;
    } else {
      return null;
    }
  }

  async deleteUser(id: UserIdDto): Promise<boolean> {
    const deletedUser = await this.em.findOne(User, id);
    if (deletedUser) {
      await this.em.removeAndFlush(deletedUser);
      return true;
    }
    return false;
  }
}
