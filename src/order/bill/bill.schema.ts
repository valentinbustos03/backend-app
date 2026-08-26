import z from 'zod';
import { PaymentMethod } from '../../shared/enum/payment.methodEnum.js';

export const BillSchema = z.object({
  paymentMethod: z.enum(PaymentMethod),
});

export type CreateBillInput = z.infer<typeof BillSchema>;
export type UpdateBillInput = Partial<CreateBillInput>;
