import {
  arrayOf,
  dataResponse,
  idPathParam,
  jsonBody,
  nullableRef,
  PathsObject,
  ref,
  refResponse,
  registerRequest,
} from '../../shared/openapi/openapi.builder.js';
import { BillSchema } from './bill.schema.js';

registerRequest('BillInput', BillSchema);

const orderIdParam = idPathParam('orderId', 'ID del pedido facturado');

export const billPaths: PathsObject = {
  '/order/{id}/bill/add': {
    post: {
      tags: ['bill'],
      operationId: 'addBill',
      summary: 'Factura un pedido',
      description:
        'Genera la factura del pedido indicado. La relacion es uno a uno: un pedido admite una sola factura.',
      parameters: [
        idPathParam('id', 'ID del pedido a facturar'),
      ],
      requestBody: jsonBody('BillInput', 'Datos de la factura'),
      responses: {
        201: dataResponse('Factura creada', ref('Bill')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/order/bill/findAll': {
    get: {
      tags: ['bill'],
      operationId: 'findAllBills',
      summary: 'Lista todas las facturas',
      responses: {
        200: dataResponse('Listado de facturas', arrayOf('Bill')),
        500: refResponse('ServerError'),
      },
    },
  },
  '/order/{orderId}/bill': {
    get: {
      tags: ['bill'],
      operationId: 'findBillByOrder',
      summary: 'Busca la factura de un pedido',
      description:
        'Un pedido sin factura responde 200 con data en null (ver Convenciones).',
      parameters: [orderIdParam],
      responses: {
        200: dataResponse('Factura encontrada', nullableRef('Bill')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['bill'],
      operationId: 'removeBillByOrder',
      summary: 'Elimina la factura de un pedido',
      description:
        'Responde 200 aunque no hubiera factura que borrar: data indica si se elimino algo.',
      parameters: [orderIdParam],
      responses: {
        200: dataResponse('Resultado del borrado', { type: 'boolean' }),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
};
