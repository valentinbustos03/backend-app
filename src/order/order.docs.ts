import {
  arrayOf,
  dataResponse,
  idPathParam,
  jsonBody,
  jsonSchemaResponse,
  messageResponse,
  nullableRef,
  PathsObject,
  queryParam,
  ref,
  refResponse,
  registerRequest,
  envelope,
} from '../shared/openapi/openapi.builder.js';
import { OrderSchema, UpdateOrderSchema } from './order.schema.js';
import { OrderStatus } from '../shared/enum/order.statusEnum.js';

registerRequest('OrderInput', OrderSchema);
registerRequest('OrderStatusInput', UpdateOrderSchema);

const orderIdParam = idPathParam('orderId', 'ID del pedido');

export const orderPaths: PathsObject = {
  '/order/add': {
    post: {
      tags: ['order'],
      operationId: 'addOrder',
      summary: 'Da de alta un pedido',
      description:
        'Descuenta del stock los ingredientes de cada plato pedido, salvo que el pedido nazca cancelado o rechazado. El subtotal lo calcula el backend aplicando la mejor promocion vigente.',
      requestBody: jsonBody('OrderInput', 'Datos del pedido'),
      responses: {
        201: jsonSchemaResponse(
          'Pedido creado. La forma de las relaciones anidadas puede diferir de la de las lecturas segun que entidades quedaron cargadas durante el alta; la forma canonica del pedido es la de GET /order/orderId/{orderId}.',
          envelope(ref('Order'))
        ),
        400: jsonSchemaResponse(
          'Error de validacion, o referencias inexistentes: message es "Referencias inexistentes" y data lista cada una.',
          {
            oneOf: [ref('ValidationError'), envelope(arrayOf('MissingReference'))],
          }
        ),
        409: jsonSchemaResponse(
          'Stock insuficiente para alguno de los ingredientes',
          envelope(arrayOf('StockShortage'))
        ),
        500: refResponse('ServerError'),
      },
    },
  },
  '/order/findAll': {
    get: {
      tags: ['order'],
      operationId: 'findAllOrders',
      summary: 'Lista los pedidos, con filtros opcionales',
      parameters: [
        queryParam('status', 'Estado exacto del pedido', {
          type: 'string',
          enum: Object.values(OrderStatus),
        }),
        queryParam('date', 'Dia de alta del pedido, formato YYYY-MM-DD', {
          type: 'string',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        }),
      ],
      responses: {
        200: dataResponse('Listado de pedidos', arrayOf('Order')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/order/orderId/{orderId}': {
    get: {
      tags: ['order'],
      operationId: 'findOrderById',
      summary: 'Busca un pedido por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [orderIdParam],
      responses: {
        200: dataResponse('Pedido encontrado', nullableRef('Order')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/order/findAllClientOrders/{id}': {
    get: {
      tags: ['order'],
      operationId: 'findOrdersByClientId',
      summary: 'Lista los pedidos de un cliente',
      parameters: [idPathParam('id', 'ID del cliente')],
      responses: {
        200: dataResponse('Listado de pedidos del cliente', arrayOf('Order')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/order/{orderId}': {
    put: {
      tags: ['order'],
      operationId: 'updateOrder',
      summary: 'Cambia el estado de un pedido',
      description:
        'Un pedido no se actualiza entero: solo cambian status y description. Para cambiar los platos hay que cancelarlo y crear otro. El stock descontado no se repone al cancelar.',
      parameters: [orderIdParam],
      requestBody: jsonBody('OrderStatusInput', 'Nuevo estado del pedido'),
      responses: {
        200: dataResponse('Pedido actualizado', nullableRef('Order')),
        400: refResponse('ValidationError'),
        409: jsonSchemaResponse(
          'Transicion de estado invalida: un pedido cancelado o rechazado no puede volver a un estado activo.',
          envelope(ref('StatusTransition'))
        ),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['order'],
      operationId: 'removeOrder',
      summary: 'Elimina un pedido',
      description: 'Elimina tambien los renglones del pedido.',
      parameters: [orderIdParam],
      responses: {
        200: messageResponse('Pedido eliminado'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
