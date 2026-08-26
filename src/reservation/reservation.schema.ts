import { z } from 'zod';
import { ClientIdSchema } from '../client/client.schema.js';
import { TableIdSchema } from '../table/table.schema.js';
import { ReservationStatus } from '../shared/enum/reservation.statusEnum.js';

const DateTimeSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  })
  .transform((val) => new Date(val))
  .meta({ format: 'date-time' });

const reservationFields = {
  numberOfPeople: z.coerce.number().pipe(z.number().min(1)),
  status: z.enum(ReservationStatus),
  client: ClientIdSchema.transform((obj) => obj.id),
  table: TableIdSchema.transform((obj) => obj.id),
};

export const ReservationSchema = z.object({
  // Solo al crear: una reserva nueva no puede quedar en el pasado.
  dateTime: DateTimeSchema.refine((date) => date.getTime() >= Date.now(), {
    message: 'dateTime cannot be in the past',
  }).meta({ format: 'date-time' }),
  ...reservationFields,
});

export type CreateReservationInput = z.infer<typeof ReservationSchema>;

// Al actualizar no se valida la fecha pasada: el PUT exige el objeto completo,
// asi que marcar como completada una reserva vieja tiene que seguir andando.
export const UpdateReservationSchema = z.object({
  dateTime: DateTimeSchema,
  ...reservationFields,
});

export type UpdateReservationInput = z.infer<typeof UpdateReservationSchema>;

export const ReservationIdSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^\d+$/, 'ID must be a valid snowflake ID'),
});
