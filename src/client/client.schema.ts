import z from 'zod';
import { Order } from '../order/order.entity.js';

export const ClientSchema = z.object({
  dni: z.number().int().min(1),
  orderHistory: z.array(z.string().min(1).regex(/^\d+$/)),
  penalty: z.number().int().min(0).default(0),
})

export const ClientIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const ClientDniSchema = z.object({
  dni: z
    .number()
    .int()
    .min(1, 'ID is required')
});
