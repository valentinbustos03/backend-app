import { z } from 'zod';
import { SupplierIdSchema,  } from '../supplier/supplier.schema.js';

const SnowflakeId = z.string().min(1).regex(/^\d+$/, 'ID inválido');

export const IngredientSchema = z.object({
  cod: z.string().min(1),
  name: z.string().min(1).trim(),
  description: z.string().optional(),
  stock: z.number().int().min(0),
  uniteOfMeasure: z.string().min(1).trim(),
  origin: z.string().min(1).trim(),
  stockLimit: z.number().int().min(0),
  suppliers: z
    .array(SupplierIdSchema)
    .transform((arr) => arr.map((obj) => obj.id)),
});

export type CreateIngredientInput = z.infer<typeof IngredientSchema>;

export type UpdateIngredientInput = Partial<CreateIngredientInput>;


export const IngredientIdSchema = z.object({
  id: SnowflakeId,
});
