import z from 'zod';
import { OrderIdSchema } from '../order.schema.js';

export const BillSchema = z.object({
  paymentMethod: z.string().min(1).trim(),
});

export type CreateBillInput = z.infer<typeof BillSchema>;
export type UpdateBillInput = Partial<typeof BillSchema>;
