import { UserRole } from '../shared/enum/user.roleEnum.js';

export interface CreateUserDto {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
  profilePicture?: string;
  client?: string;
  employee?: string;
}

export interface UserIdDto{
  id: string;
}

export type UpdateUserDto = Partial<CreateUserDto>