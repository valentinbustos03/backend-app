import z from 'zod';
import { OrderSchema } from '../order/order.schema.js';

export const ClientSchema = z.object({
  dni: z.number().int().min(1),
  //orderHistory: z.array(OrderSchema), 
  penalty: z.number().int().min(0).default(0),
});

export const ClientIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const ClientDniSchema = z.object({
  dni: z.number().int().min(1, 'ID is required'),
});
