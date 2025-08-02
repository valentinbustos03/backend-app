import z from 'zod';
import { IngredientIdSchema, IngredientSchema } from '../ingredient/ingredient.schema.js';

export const DishSchema = z.object({
  cod: z.string().min(1).trim(),
  name: z.string().min(1).trim(),
  description: z.string().optional(),
  picture: z.string().url().optional(), // usar Cloudinary
  price: z.number().min(0),
  calification: z.number().min(0).max(5),
  ingredients: z.array(IngredientIdSchema), // Array de ingredientes
  chef: z.string().min(1).regex(/^\d+$/).optional(), // CUANDO ESTE 'CHEF' SACAR EL OPTIONAL
});

export const DishIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});
