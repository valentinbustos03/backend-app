import {
  arrayOf,
  dataResponse,
  idPathParam,
  nullableRef,
  PathsObject,
  refResponse,
} from '../../shared/openapi/openapi.builder.js';

const orderIdParam = idPathParam('orderId', 'ID del pedido facturado');

export const billPaths: PathsObject = {
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
  },
};
