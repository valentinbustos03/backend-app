import { z } from 'zod';
import { DishIdSchema } from '../dish/dish.schema.js';

const DateTimeSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  })
  .transform((val) => new Date(val))
  .meta({ format: 'date-time' });

export const PromotionSchema = z
  .object({
    cod: z.string().min(1).trim(),
    name: z.string().min(1).trim(),
    description: z.string().optional(),
    discountPercentage: z.coerce.number().pipe(z.number().min(0).max(100)),
    dateFrom: DateTimeSchema,
    dateTo: DateTimeSchema,
    active: z
      .union([
        z.boolean(),
        z.enum(['true', 'false']).transform((val) => val === 'true'),
      ])
      .default(true),
    dishes: z
      .array(DishIdSchema)
      .min(1, 'At least one dish is required')
      .transform((arr) => arr.map((obj) => obj.id)),
  })
  .refine((data) => data.dateTo.getTime() >= data.dateFrom.getTime(), {
    message: 'dateTo must be greater than or equal to dateFrom',
    path: ['dateTo'],
  });

export type CreatePromotionInput = z.infer<typeof PromotionSchema>;

export const UpdatePromotionSchema = PromotionSchema;

export type UpdatePromotionInput = z.infer<typeof UpdatePromotionSchema>;

export const PromotionIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const PromotionFilterSchema = z.object({
  current: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
});

export type PromotionFilterInput = z.infer<typeof PromotionFilterSchema>;
