import {
  arrayOf,
  dataResponse,
  idPathParam,
  jsonBody,
  messageResponse,
  nullableRef,
  PathsObject,
  ref,
  refResponse,
  registerRequest,
} from '../shared/openapi/openapi.builder.js';
import {
  ReservationSchema,
  UpdateReservationSchema,
} from './reservation.schema.js';

registerRequest('ReservationInput', ReservationSchema);
registerRequest('ReservationUpdateInput', UpdateReservationSchema);

const idParam = idPathParam('id', 'ID de la reserva');

const CONFLICT_DESCRIPTION =
  'Conflicto de reserva: la mesa no existe, no entra la cantidad de personas, o ya tiene otra reserva confirmada dentro de las 2 horas de ese horario.';

export const reservationPaths: PathsObject = {
  '/reservation/add': {
    post: {
      tags: ['reservation'],
      operationId: 'addReservation',
      summary: 'Da de alta una reserva',
      description:
        'dateTime no puede quedar en el pasado. Al confirmar una reserva la mesa pasa a ocupada; el estado occupied de la mesa se recalcula solo, no se asigna a mano.',
      requestBody: jsonBody('ReservationInput', 'Datos de la reserva'),
      responses: {
        201: dataResponse('Reserva creada', ref('Reservation')),
        400: refResponse('ValidationError'),
        409: messageResponse(CONFLICT_DESCRIPTION),
        500: refResponse('ServerError'),
      },
    },
  },
  '/reservation/findAll': {
    get: {
      tags: ['reservation'],
      operationId: 'findAllReservations',
      summary: 'Lista todas las reservas',
      responses: {
        200: dataResponse('Listado de reservas', arrayOf('Reservation')),
        500: refResponse('ServerError'),
      },
    },
  },
  '/reservation/id/{id}': {
    get: {
      tags: ['reservation'],
      operationId: 'findReservationById',
      summary: 'Busca una reserva por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam],
      responses: {
        200: dataResponse('Reserva encontrada', nullableRef('Reservation')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/reservation/{id}': {
    put: {
      tags: ['reservation'],
      operationId: 'updateReservation',
      summary: 'Actualiza una reserva',
      description:
        'Reemplaza la reserva completa: exige todos los campos. A diferencia del alta, aca dateTime si puede quedar en el pasado, para poder marcar como completada una reserva vieja.',
      parameters: [idParam],
      requestBody: jsonBody('ReservationUpdateInput', 'Datos de la reserva'),
      responses: {
        200: dataResponse('Reserva actualizada', nullableRef('Reservation')),
        400: refResponse('ValidationError'),
        409: messageResponse(CONFLICT_DESCRIPTION),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['reservation'],
      operationId: 'removeReservation',
      summary: 'Elimina una reserva',
      description:
        'Despues de borrar se recalcula el estado occupied de la mesa.',
      parameters: [idParam],
      responses: {
        200: messageResponse('Reserva eliminada'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
