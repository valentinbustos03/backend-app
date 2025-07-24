import z from 'zod';

export const EmployeeSchema = z.object({
  taxId: z.string().min(1),
  companyName: z.string().min(1),
  shift: z.string().min(1),
  workedHours: z.number().min(0),
  priceHour: z.number().min(0),
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
