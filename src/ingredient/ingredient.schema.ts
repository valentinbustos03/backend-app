import { z } from 'zod';

const SnowflakeId = z.string().min(1).regex(/^\d+$/, 'ID inválido');

export const IngredientSchema = z.object({
  cod: z.string().min(1),
  name: z.string().min(1).trim(),
  description: z.string().optional(),
  stock: z.number().int().min(0),
  uniteOfMeasure: z.string().min(1).trim(),
  origin: z.string().min(1).trim(),
  stockLimit: z.number().int().min(0),
  suppliers: z.array(SnowflakeId),
  dishes: z.array(SnowflakeId),
});

export const IngredientIdSchema = z.object({
  id: SnowflakeId,
});
