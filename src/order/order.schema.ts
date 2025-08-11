import { z } from 'zod';
import { ClientIdSchema } from '../client/client.schema.js';
import { DishIdSchema } from '../dish/dish.schema.js';

export const OrderItemSchema = z
  .object({
    dish: DishIdSchema.transform((obj) => obj.id)
    ,
    quantity: z.coerce.number().pipe(z.number().min(1)),
  })

export const OrderItemIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});


export const OrderSchema = z.object({
  description: z.string().optional(),
  status: z.string(),
  // estimatedEndTime: z.date(),
  // endTime: z.date(),
  estimatedEndTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => new Date(val)),
  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => new Date(val)),
  orderItems: z
    .array(OrderItemSchema)
    .min(1, 'At least one order item is required'),
  client: ClientIdSchema.transform((obj) => obj.id), // Transformar a string
});

export type CreateOrderInput = z.infer<typeof OrderSchema>;

export type UpdateOrderInput = Partial<CreateOrderInput>;

export const OrderIdSchema = z.object({
  orderId: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});
