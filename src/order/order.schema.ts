import { z } from 'zod';
import { ClientIdSchema } from '../client/client.schema.js';
import { DishIdSchema } from '../dish/dish.schema.js';
import { OrderItem } from './orderItem.entity.js';
import { Dish } from '../dish/dish.entity.js';

// export const OrderItemSchema = z.object({
//   dishId: DishIdSchema.transform((obj) => obj.id), // Transformar a string
//   quantity: z.number().int().min(1),
// }).transform((obj) => ({
//   dishId: obj.dishId,
//   quantity: obj.quantity,
// }));

export const OrderItemSchema = z
  .object({
    dish: DishIdSchema.transform((obj) => obj.id),
    quantity: z.coerce.number().pipe(z.number().min(1)),
  })
  .transform((data) => {
    const orderItem = new OrderItem();
    orderItem.dish = { id: data.dish } as Dish;
    orderItem.quantity = data.quantity;
    return orderItem;
  });

// export const OrderItemListSchema = z.array(OrderItemSchema).transform((arr) =>
//   arr.map((obj) => ({
//     dishId: obj.dishId,
//     quantity: obj.quantity,
//   }))
// );

export const OrderItemIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

//export type OrderItemListInput = z.infer<typeof OrderItemListSchema>;

export const OrderSchema = z.object({
  description: z.string().optional(),
  status: z.string(),
  estimatedEndTime: z.date(),
  endTime: z.date(),
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
