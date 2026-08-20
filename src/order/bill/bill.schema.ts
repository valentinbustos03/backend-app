import z from 'zod';

export const BillSchema = z.object({
  paymentMethod: z.string().min(1).trim(),
});

export type CreateBillInput = z.infer<typeof BillSchema>;
export type UpdateBillInput = Partial<CreateBillInput>;
