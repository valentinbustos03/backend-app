import { EntityManager } from '@mikro-orm/mysql';
import bcrypt from 'bcryptjs';
import { Client } from '../client/client.entity.js';
import { AccessRole } from '../shared/enum/access.roleEnum.js';
import { UserRole } from '../shared/enum/user.roleEnum.js';
import { User } from '../user/user.entity.js';
import { MeDto, SessionDto } from './auth.dto.js';
import {
  DniAlreadyUsedError,
  EmailAlreadyUsedError,
  InvalidCredentialsError,
  InvalidCurrentPasswordError,
  NoAccessRoleError,
} from './auth.error.js';
import {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateMeInput,
} from './auth.schema.js';
import { signToken } from './auth.token.js';

const SALT_ROUNDS = 10;

export class AuthService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async login(data: LoginInput): Promise<SessionDto> {
    const user = await this.em.findOne(User, { email: data.email });
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const matches = await bcrypt.compare(data.password, user.password);
    if (!matches) {
      throw new InvalidCredentialsError();
    }

    return this.buildSession(user);
  }

  async register(data: RegisterInput): Promise<SessionDto> {
    const existingEmail = await this.em.findOne(User, { email: data.email });
    if (existingEmail) {
      throw new EmailAlreadyUsedError(data.email);
    }

    const existingDni = await this.em.findOne(Client, { dni: data.dni });
    if (existingDni) {
      throw new DniAlreadyUsedError(data.dni);
    }

    const client = new Client();
    client.dni = data.dni;
    client.penalty = 0;

    const user = new User();
    user.email = data.email;
    user.fullName = data.fullName;
    user.phoneNumber = data.phoneNumber;
    user.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    user.role = UserRole.USER;
    user.client = client;

    await this.em.persist([client, user]).flush();

    return this.buildSession(user);
  }

  async getMe(userId: string): Promise<MeDto> {
    const user = await this.requireUser(userId);
    return { user, accessRole: this.requireAccessRole(user) };
  }

  async updateMe(userId: string, data: UpdateMeInput): Promise<MeDto> {
    const user = await this.requireUser(userId);

    user.fullName = data.fullName;
    user.phoneNumber = data.phoneNumber;
    user.profilePicture = data.profilePicture;

    await this.em.flush();

    return { user, accessRole: this.requireAccessRole(user) };
  }

  async changePassword(
    userId: string,
    data: ChangePasswordInput
  ): Promise<void> {
    const user = await this.requireUser(userId);

    const matches = await bcrypt.compare(data.currentPassword, user.password);
    if (!matches) {
      throw new InvalidCurrentPasswordError();
    }

    user.password = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
    await this.em.flush();
  }

  resolveAccessRole(user: User): AccessRole | null {
    if (user.role === UserRole.ADMIN) {
      return AccessRole.ADMIN;
    }
    if (user.employee) {
      return AccessRole.EMPLEADO;
    }
    if (user.client) {
      return AccessRole.CLIENTE;
    }
    return null;
  }

  private async buildSession(user: User): Promise<SessionDto> {
    const accessRole = this.requireAccessRole(user);

    const token = await signToken({
      sub: user.id,
      accessRole,
      employeeRole: user.employee?.role,
    });

    return { user, accessRole, token };
  }

  private requireAccessRole(user: User): AccessRole {
    const accessRole = this.resolveAccessRole(user);
    if (!accessRole) {
      throw new NoAccessRoleError(user.id);
    }
    return accessRole;
  }

  private async requireUser(userId: string): Promise<User> {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new InvalidCredentialsError();
    }
    return user;
  }
}
