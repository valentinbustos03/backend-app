import z from 'zod';

export const TableSchema = z.object({
  cod: z.string().min(1),
  capacity: z.union([
    z.number().int().min(1),
    z.string().regex(/^\d+$/).transform(Number),
  ]),
  description: z.string().optional(),
  //occupied: z.boolean().default(false),
  occupied: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  sector: z.string().min(1),
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
