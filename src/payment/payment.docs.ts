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
import { InternalPaymentSchema } from './payment.schema.js';

registerRequest('InternalPaymentInput', InternalPaymentSchema);

const orderIdParam = idPathParam('orderId', 'ID del pedido a pagar');
const paymentIdParam = idPathParam('paymentId', 'ID del intento de pago');

const conflictResponse = {
  description:
    'El pedido no esta entregado, o ya tiene factura. `data` trae el detalle del caso.',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
    },
  },
};

const gatewayResponse = {
  description:
    'Mercado Pago no respondio, rechazo la operacion, o falta configurar MP_ACCESS_TOKEN.',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
    },
  },
};

export const paymentPaths: PathsObject = {
  '/payment/order/{orderId}/checkout': {
    post: {
      tags: ['payment'],
      operationId: 'startCheckout',
      summary: 'Inicia un pago por Mercado Pago',
      description:
        'Crea un intento de pago en estado `pending` y una preferencia de Checkout Pro. El frontend tiene que redirigir al `initPoint` que devuelve. La factura NO se crea aca: nace recien cuando el pago queda aprobado, por webhook o por sync. Solo se puede pagar un pedido en estado `entregado`.',
      parameters: [orderIdParam],
      responses: {
        201: dataResponse('Preferencia creada', ref('CheckoutResult')),
        400: refResponse('ValidationError'),
        404: messageResponse('El pedido no existe'),
        409: conflictResponse,
        502: gatewayResponse,
      },
    },
  },
  '/payment/order/{orderId}/internal': {
    post: {
      tags: ['payment'],
      operationId: 'registerInternalPayment',
      summary: 'Registra un pago hecho fuera de la app',
      description:
        'Para el efectivo, la transferencia y las tarjetas cobradas en el salon. El intento nace directamente en `approved` —la plata ya cambio de manos, no hay nada que conciliar— y la factura se emite en el mismo flush. Solo se puede pagar un pedido en estado `entregado`.',
      parameters: [orderIdParam],
      requestBody: jsonBody('InternalPaymentInput', 'Metodo de pago utilizado'),
      responses: {
        201: dataResponse(
          'Pago registrado y factura emitida',
          ref('InternalPaymentResult')
        ),
        400: refResponse('ValidationError'),
        404: messageResponse('El pedido no existe'),
        409: conflictResponse,
      },
    },
  },
  '/payment/webhook': {
    post: {
      tags: ['payment'],
      operationId: 'mercadoPagoWebhook',
      summary: 'Notificacion de Mercado Pago',
      description:
        'Lo llama Mercado Pago, no el frontend. El body **no** se usa como fuente de verdad: de el se toma unicamente el id, y con ese id se re-consulta el pago contra la API de Mercado Pago. Responde 200 siempre, incluso ante un error interno, porque un error haria que Mercado Pago reintente la notificacion durante horas.',
      responses: {
        200: messageResponse('Notificacion recibida'),
      },
    },
  },
  '/payment/{paymentId}/sync': {
    post: {
      tags: ['payment'],
      operationId: 'syncPayment',
      summary: 'Re-consulta el estado del pago a Mercado Pago',
      description:
        'Hace a demanda lo mismo que el webhook hace solo. Existe para cuando el webhook no puede llegar —por ejemplo, una demo local sin tunel publico—: cierra el circuito a mano. Sobre un pago interno responde 409, porque no hay nada que consultar.',
      parameters: [paymentIdParam],
      responses: {
        200: dataResponse('Pago sincronizado', ref('SyncResult')),
        400: refResponse('ValidationError'),
        404: messageResponse('El pago no existe'),
        409: messageResponse('El pago es interno, no se sincroniza'),
        502: gatewayResponse,
      },
    },
  },
  '/payment/order/{orderId}': {
    get: {
      tags: ['payment'],
      operationId: 'findPaymentsByOrder',
      summary: 'Lista los intentos de pago de un pedido',
      description:
        'Del mas nuevo al mas viejo. Un pedido puede acumular varios intentos rechazados antes del que finalmente se aprueba.',
      parameters: [orderIdParam],
      responses: {
        200: dataResponse('Listado de intentos', arrayOf('Payment')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/payment/{paymentId}': {
    get: {
      tags: ['payment'],
      operationId: 'findPaymentById',
      summary: 'Busca un intento de pago',
      description:
        'Un pago inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [paymentIdParam],
      responses: {
        200: dataResponse('Intento encontrado', nullableRef('Payment')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
};
