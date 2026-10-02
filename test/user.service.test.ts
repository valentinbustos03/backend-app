// test/user.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { UserService } from '../src/user/user.service.js';

describe('UserService.createUser', () => {
  let em: any;
  let service: UserService;

  beforeEach(() => {
    em = {
      create: vi.fn((_entity, data) => data),
      persistAndFlush: vi.fn().mockResolvedValue(undefined),
    };
    service = new UserService(em);
  });

  it('guarda el usuario con la contraseña hasheada, no en texto plano', async () => {
    const plainPassword = 'miClaveSecreta123';
    const data = { email: 'test@test.com', password: plainPassword } as any;

    const result = await service.createUser(data);

    expect(result.password).not.toBe(plainPassword);
    const matches = await bcrypt.compare(plainPassword, result.password);
    expect(matches).toBe(true);
  });
});