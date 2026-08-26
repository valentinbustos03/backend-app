import z from 'zod';
import { PaymentMethod } from '../shared/enum/payment.methodEnum.js';

export const PaymentIdSchema = z.object({
  paymentId: z.string().regex(/^\d+$/, 'El ID debe ser numerico'),
});

export const OrderIdParamSchema = z.object({
  orderId: z.string().regex(/^\d+$/, 'El ID debe ser numerico'),
});

export const InternalPaymentSchema = z.object({
  method: z.enum(PaymentMethod),
});

export const WebhookSchema = z
  .object({
    type: z.string().optional(),
    action: z.string().optional(),
    data: z
      .object({
        id: z.union([z.string(), z.number()]),
      })
      .optional(),
  })
  .loose();

export type PaymentIdInput = z.infer<typeof PaymentIdSchema>;
export type OrderIdParamInput = z.infer<typeof OrderIdParamSchema>;
export type InternalPaymentInput = z.infer<typeof InternalPaymentSchema>;
export type WebhookInput = z.infer<typeof WebhookSchema>;
