import z from 'zod';

export const TableSchema = z.object({
  cod: z.string().min(1),
  capacity: z.number().int().min(1),
  description: z.string().optional(),
  occupied: z.boolean(),
});

export const TableIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const TableCodSchema = z.object({
  cod: z.string().min(1),
});
