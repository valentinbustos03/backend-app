import { z } from 'zod';
import { SupplierIdSchema } from '../supplier/supplier.schema.js';

const SnowflakeId = z.string().min(1).regex(/^\d+$/, 'ID inválido');

export const IngredientSchema = z.object({
  cod: z.string().min(1),
  name: z.string().min(1).trim(),
  description: z.string().optional(),
  stock: z
    .union([
      z.number().int().min(0),
      z.string().regex(/^\d+$/).transform(Number),
    ])
    .default(0),
  uniteOfMeasure: z.string().min(1).trim(),
  origin: z.string().min(1).trim(),
  stockLimit: z
    .union([
      z.number().int().min(0),
      z.string().regex(/^\d+$/).transform(Number),
    ])
    .default(0),
  suppliers: z
    .array(SupplierIdSchema)
    .transform((arr) => arr.map((obj) => obj.id)),
});

export type CreateIngredientInput = z.infer<typeof IngredientSchema>;

export const UpdateIngredientSchema = IngredientSchema.partial();

export type UpdateIngredientInput = z.infer<typeof UpdateIngredientSchema>;

export const IngredientIdSchema = z.object({
  id: SnowflakeId,
});
