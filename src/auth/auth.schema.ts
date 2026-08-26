import z from 'zod';

const PasswordSchema = z
  .string()
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  .max(64, { message: 'La contraseña no puede superar los 64 caracteres' })
  .regex(/[A-Z]/, { message: 'Debe contener al menos una letra mayúscula' })
  .regex(/[a-z]/, { message: 'Debe contener al menos una letra minúscula' })
  .regex(/[0-9]/, { message: 'Debe contener al menos un número' });

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const RegisterSchema = z.object({
  email: z.email(),
  fullName: z.string().min(1),
  password: PasswordSchema,
  phoneNumber: z.string().min(8),
  dni: z.union([
    z.number().int().min(1),
    z.string().regex(/^\d+$/).transform(Number),
  ]),
});

export const UpdateMeSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z.string().min(8),
  profilePicture: z.string().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: PasswordSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type UpdateMeInput = z.infer<typeof UpdateMeSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
