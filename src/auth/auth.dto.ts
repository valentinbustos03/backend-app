import { AccessRole } from '../shared/enum/access.roleEnum.js';
import { User } from '../user/user.entity.js';

export interface SessionDto {
  user: User;
  accessRole: AccessRole;
  token: string;
}

export interface MeDto {
  user: User;
  accessRole: AccessRole;
}
