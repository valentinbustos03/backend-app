import { z } from 'zod';
import { ClientIdSchema } from '../client/client.schema.js';
import { DishIdSchema } from '../dish/dish.schema.js';
import { TableIdSchema } from '../table/table.schema.js';
import { EmployeeIdSchema } from '../employee/employee.schema.js';
import { OrderStatus } from '../shared/enum/order.statusEnum.js';

export const OrderItemSchema = z.object({
  dish: DishIdSchema.transform((obj) => obj.id),
  quantity: z.coerce.number().pipe(z.number().int().min(1)),
});

export const OrderItemIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const OrderSchema = z.object({
  description: z.string().optional(),
  status: z.enum(OrderStatus),
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
  table: TableIdSchema.transform((obj) => obj.id),
  waiter: EmployeeIdSchema.transform((obj) => obj.id)
});

export type CreateOrderInput = z.infer<typeof OrderSchema>;

// Un pedido no se actualiza entero, solo cambia de estado.
// Si hay que cambiar los platos se cancela y se crea otro.
export const UpdateOrderSchema = z.object({
  status: z.enum(OrderStatus),
  description: z.string().optional(),
});

export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;

export const OrderIdSchema = z.object({
  orderId: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const OrderFilterSchema = z.object({
  status: z.enum(OrderStatus).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
});

export type OrderFilterInput = z.infer<typeof OrderFilterSchema>;
