import z from 'zod';

export const DishSchema = z.object({
  cod: z.string().min(1).trim(),
  name: z.string().min(1).trim(),
  description: z.string().optional(),
  picture: z.string().url().optional(), // usar Cloudinary
  price: z.number().min(0),
  calification: z.number().min(0).max(5),
  ingredients: z.array(z.string().min(1).regex(/^\d+$/)), // Array de IDs de ingredientes
  chef: z.string().min(1).regex(/^\d+$/).optional(), // ID del chef que creó el plato
});

export const DishIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});
