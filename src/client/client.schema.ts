import z from 'zod';

export const ClientSchema = z.object({
  dni: z
    .union([
      z.number().int().min(1),
      z.string().regex(/^\d+$/).transform(Number),
    ]),
    
  penalty: z
    .union([
      z.number().int().min(0),
      z.string().regex(/^\d+$/).transform(Number),
    ])
    .default(0),
});

export const ClientIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});

export const ClientDniSchema = z.object({
  dni: z.union([
    z.number().int().min(1),
    z.string().regex(/^\d+$/).transform(Number),
  ]),
});
