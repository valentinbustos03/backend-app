import z from 'zod';
import { EmployeeRole } from '../shared/enum/employee.roleEnum.js';

const stringToNumberSchema = z
  .union([
    z.number().min(0),
    z.string().regex(/^\d+(\.\d+)?$/).transform(Number),
  ]);

export const BaseEmployeeSchema = z.object({
  taxId: z.string().min(1),
  shift: z.string().min(1),
  workedHours: stringToNumberSchema,
  priceHour: stringToNumberSchema,
  role: z.enum(EmployeeRole),
});

export const ChefSchema = BaseEmployeeSchema.extend({
  role: z.literal(EmployeeRole.CHEF),
  hierarchy: z.string().min(1),
  tag: z.string().min(1),
});

export const WaiterSchema = BaseEmployeeSchema.extend({
  role: z.literal(EmployeeRole.WAITER),
  calification: stringToNumberSchema,
  sector: z.string().min(1),
});

export const EmployeeSchema = z.discriminatedUnion('role', [
  ChefSchema,
  WaiterSchema,
]);

export const EmployeeIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const EmployeeTaxIdSchema = z.object({
  taxId: z.string().min(1),
});

export const EmployeeFilterSchema = z.object({
  shift: z.string().min(1).optional(),
  role: z.enum(EmployeeRole).optional(),
  minCalification: z.coerce.number().min(0).optional(),
});

export type EmployeeFilterInput = z.infer<typeof EmployeeFilterSchema>;
