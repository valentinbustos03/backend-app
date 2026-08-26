import z from 'zod';
import { UserRole } from '../shared/enum/user.roleEnum.js';
import { ClientIdSchema } from '../client/client.schema.js';
import { EmployeeIdSchema } from '../employee/employee.schema.js';

const BaseUserSchema = z.object({
  email: z.email(),
  fullName: z.string().min(1),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .max(64, { message: 'La contraseña no puede superar los 64 caracteres' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una letra mayúscula' })
    .regex(/[a-z]/, { message: 'Debe contener al menos una letra minúscula' })
    .regex(/[0-9]/, { message: 'Debe contener al menos un número' }),
  phoneNumber: z.string().min(8),
  role: z.enum(UserRole).default(UserRole.USER),
  profilePicture: z.string().optional(),
  client: ClientIdSchema.transform((obj) => obj.id).optional(),
  employee: EmployeeIdSchema.transform((obj) => obj.id).optional(),
});

export const UserSchema = BaseUserSchema.refine(
  (data) => data.client !== undefined || data.employee !== undefined,
  {
    message: 'El usuario tiene que estar asociado a un cliente o a un empleado',
    path: ['client'],
  }
);

export const UpdateUserSchema = BaseUserSchema.partial({ password: true });

export type CreateUserInput = z.infer<typeof UserSchema>;

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const UserIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});