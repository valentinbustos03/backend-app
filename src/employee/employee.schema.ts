import z from 'zod';

const stringToNumberSchema = z
  .union([
    z.number().min(0),
    z.string().regex(/^\d+(\.\d+)?$/).transform(Number),
  ]);

export const EmployeeSchema = z.object({
  taxId: z.string().min(1),
  shift: z.string().min(1),
  // workedHours: z.number().min(0),
  // priceHour: z.number().min(0),
  workedHours: stringToNumberSchema,
  priceHour: stringToNumberSchema,
});

export const EmployeeIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const EmployeeTaxIdSchema = z.object({
  taxId: z.string().min(1),
});
