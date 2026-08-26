import {
  arrayOf,
  dataResponse,
  idPathParam,
  jsonBody,
  messageResponse,
  nullableRef,
  PathsObject,
  queryParam,
  ref,
  refResponse,
  registerRequest,
} from '../shared/openapi/openapi.builder.js';
import { PromotionSchema } from './promotion.schema.js';

registerRequest('PromotionInput', PromotionSchema);

const idParam = idPathParam('id', 'ID de la promocion');

export const promotionPaths: PathsObject = {
  '/promotion/add': {
    post: {
      tags: ['promotion'],
      operationId: 'addPromotion',
      summary: 'Da de alta una promocion',
      description:
        'dateTo tiene que ser mayor o igual que dateFrom y dishes exige al menos un plato existente. El descuento se aplica al calcular el subtotal de los pedidos mientras la promocion este vigente y activa.',
      requestBody: jsonBody('PromotionInput', 'Datos de la promocion'),
      responses: {
        201: dataResponse('Promocion creada', ref('Promotion')),
        400: refResponse('ValidationError'),
        409: messageResponse('Alguno de los platos referenciados no existe'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/promotion/findAll': {
    get: {
      tags: ['promotion'],
      operationId: 'findAllPromotions',
      summary: 'Lista las promociones',
      parameters: [
        queryParam(
          'current',
          'Con true devuelve solo las promociones activas y vigentes al momento de la consulta',
          { type: 'string', enum: ['true', 'false'] }
        ),
      ],
      responses: {
        200: dataResponse('Listado de promociones', arrayOf('Promotion')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/promotion/id/{id}': {
    get: {
      tags: ['promotion'],
      operationId: 'findPromotionById',
      summary: 'Busca una promocion por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam],
      responses: {
        200: dataResponse('Promocion encontrada', nullableRef('Promotion')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/promotion/{id}': {
    put: {
      tags: ['promotion'],
      operationId: 'updatePromotion',
      summary: 'Actualiza una promocion',
      description:
        'Reemplaza la promocion completa: exige todos los campos, incluida la lista de platos.',
      parameters: [idParam],
      requestBody: jsonBody('PromotionInput', 'Datos de la promocion'),
      responses: {
        200: dataResponse('Promocion actualizada', ref('Promotion')),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        409: messageResponse('Alguno de los platos referenciados no existe'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['promotion'],
      operationId: 'removePromotion',
      summary: 'Elimina una promocion',
      parameters: [idParam],
      responses: {
        200: messageResponse('Promocion eliminada'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
