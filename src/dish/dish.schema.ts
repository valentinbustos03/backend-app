import z from 'zod';
import {
  IngredientIdSchema,
  IngredientSchema,
} from '../ingredient/ingredient.schema.js';
import { EmployeeIdSchema } from '../employee/employee.schema.js';

export const DishSchema = z.object({
  cod: z.string().min(1).trim(),
  name: z.string().min(1).trim(),
  description: z.string().optional(),
  picture: z.url().optional(), // usar Cloudinary
  price: z.coerce.number().pipe(z.number().min(0)),
  calification: z.coerce.number().pipe(z.number().min(0).max(5)),
  tag: z.string().min(1).trim(),
  ingredients: z
    .array(IngredientIdSchema)
    .transform((arr) => arr.map((obj) => obj.id)),
  chef: EmployeeIdSchema.transform((obj) => obj.id), 
});

export type CreateDishInput = z.infer<typeof DishSchema>;

export type UpdateDishInput = Partial<CreateDishInput>;

export const DishIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});
