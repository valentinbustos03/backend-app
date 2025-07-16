import { z } from 'zod';

export const IngredientSchema = z.object({
  cod: z.string().min(1),
  name: z.string().min(1).trim(),
  description: z.string().optional(),
  stock: z.number().int().min(0),
  uniteOfMeasure: z.string().min(1).trim(),
  origin: z.string().min(1).trim(),
  stockLimit: z.number().int().min(0),
  suppliers: z.array(z.string().min(1).regex(/^\d+$/)),
  dishes: z.array(z.string().min(1).regex(/^\d+$/)),
});

export const IngredientIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});
